import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { type LoginInput } from '../schema';
import { login } from '../handlers/login';
import { eq } from 'drizzle-orm';

// Test user data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'testpassword123', // In real app, this would be bcrypt hashed
  created_at: new Date(),
  updated_at: new Date()
};

const validLoginInput: LoginInput = {
  email: 'test@example.com',
  password: 'testpassword123'
};

const invalidEmailInput: LoginInput = {
  email: 'nonexistent@example.com',
  password: 'testpassword123'
};

const invalidPasswordInput: LoginInput = {
  email: 'test@example.com',
  password: 'wrongpassword'
};

describe('login', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully log in with valid credentials', async () => {
    // Create test user
    const insertedUsers = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const result = await login(validLoginInput);

    // Verify successful login response
    expect(result.success).toBe(true);
    expect(result.message).toBe('Login successful');
    expect(result.user).toBeDefined();
    expect(result.user?.id).toBe(insertedUsers[0].id);
    expect(result.user?.username).toBe('testuser');
    expect(result.user?.email).toBe('test@example.com');
  });

  it('should create a session token on successful login', async () => {
    // Create test user
    const insertedUsers = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const userId = insertedUsers[0].id;

    await login(validLoginInput);

    // Verify session was created
    const sessions = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.user_id, userId))
      .execute();

    expect(sessions).toHaveLength(1);
    expect(sessions[0].user_id).toBe(userId);
    expect(sessions[0].token).toBeDefined();
    expect(sessions[0].token.length).toBeGreaterThan(0);
    expect(sessions[0].expires_at).toBeInstanceOf(Date);
    expect(sessions[0].expires_at > new Date()).toBe(true); // Should expire in the future
  });

  it('should fail login with non-existent email', async () => {
    // Create test user but try to login with different email
    await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const result = await login(invalidEmailInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email or password');
    expect(result.user).toBeUndefined();
  });

  it('should fail login with incorrect password', async () => {
    // Create test user
    await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const result = await login(invalidPasswordInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email or password');
    expect(result.user).toBeUndefined();
  });

  it('should not create session on failed login', async () => {
    // Create test user
    const insertedUsers = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const userId = insertedUsers[0].id;

    // Try login with wrong password
    await login(invalidPasswordInput);

    // Verify no session was created
    const sessions = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.user_id, userId))
      .execute();

    expect(sessions).toHaveLength(0);
  });

  it('should handle empty database gracefully', async () => {
    // Don't create any users
    const result = await login(validLoginInput);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Invalid email or password');
    expect(result.user).toBeUndefined();
  });

  it('should create session with correct expiration time', async () => {
    // Create test user
    const insertedUsers = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const userId = insertedUsers[0].id;
    const beforeLogin = new Date();

    await login(validLoginInput);

    const afterLogin = new Date();
    afterLogin.setHours(afterLogin.getHours() + 24); // Expected expiration

    // Get created session
    const sessions = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.user_id, userId))
      .execute();

    expect(sessions).toHaveLength(1);
    
    // Session should expire approximately 24 hours from now (within 1 minute tolerance)
    const sessionExpiry = sessions[0].expires_at;
    const expectedExpiry = new Date(beforeLogin);
    expectedExpiry.setHours(expectedExpiry.getHours() + 24);
    
    const timeDifference = Math.abs(sessionExpiry.getTime() - expectedExpiry.getTime());
    const oneMinuteInMs = 60 * 1000;
    
    expect(timeDifference).toBeLessThan(oneMinuteInMs);
  });

  it('should handle multiple login attempts for same user', async () => {
    // Create test user
    const insertedUsers = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    const userId = insertedUsers[0].id;

    // Login multiple times
    await login(validLoginInput);
    await login(validLoginInput);
    await login(validLoginInput);

    // Should have multiple sessions
    const sessions = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.user_id, userId))
      .execute();

    expect(sessions).toHaveLength(3);
    
    // All sessions should have different tokens
    const tokens = sessions.map(s => s.token);
    const uniqueTokens = new Set(tokens);
    expect(uniqueTokens.size).toBe(3);
  });
});