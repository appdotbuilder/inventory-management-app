import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { getCurrentUser } from '../handlers/get_current_user';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'hashed_password_123'
};

const validToken = 'valid_session_token_123';
const expiredToken = 'expired_session_token_456';
const invalidToken = 'invalid_token_789';

describe('getCurrentUser', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return user for valid session token', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();
    
    const userId = userResult[0].id;

    // Create valid session (expires in future)
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1); // 1 hour from now

    await db.insert(sessionsTable)
      .values({
        user_id: userId,
        token: validToken,
        expires_at: futureDate
      })
      .execute();

    // Test the handler
    const result = await getCurrentUser(validToken);

    expect(result).toBeDefined();
    expect(result!.id).toEqual(userId);
    expect(result!.username).toEqual('testuser');
    expect(result!.email).toEqual('test@example.com');
    expect(result!.password_hash).toEqual('hashed_password_123');
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return null for expired session token', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();
    
    const userId = userResult[0].id;

    // Create expired session (expires in past)
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() - 1); // 1 hour ago

    await db.insert(sessionsTable)
      .values({
        user_id: userId,
        token: expiredToken,
        expires_at: pastDate
      })
      .execute();

    // Test the handler
    const result = await getCurrentUser(expiredToken);

    expect(result).toBeNull();
  });

  it('should return null for non-existent session token', async () => {
    // Create test user but no session
    await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();

    // Test with token that doesn't exist
    const result = await getCurrentUser(invalidToken);

    expect(result).toBeNull();
  });

  it('should return null for empty session token', async () => {
    // Test with empty string token
    const result = await getCurrentUser('');

    expect(result).toBeNull();
  });

  it('should handle session exactly at expiration time', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();
    
    const userId = userResult[0].id;

    // Create session that expires right now (or very close to now)
    const now = new Date();
    
    await db.insert(sessionsTable)
      .values({
        user_id: userId,
        token: 'expires_now_token',
        expires_at: now
      })
      .execute();

    // Small delay to ensure session is expired
    await new Promise(resolve => setTimeout(resolve, 10));

    // Test the handler
    const result = await getCurrentUser('expires_now_token');

    expect(result).toBeNull();
  });

  it('should return correct user when multiple sessions exist', async () => {
    // Create two test users
    const user1Result = await db.insert(usersTable)
      .values({
        username: 'user1',
        email: 'user1@example.com',
        password_hash: 'hash1'
      })
      .returning()
      .execute();

    const user2Result = await db.insert(usersTable)
      .values({
        username: 'user2',
        email: 'user2@example.com',
        password_hash: 'hash2'
      })
      .returning()
      .execute();

    const user1Id = user1Result[0].id;
    const user2Id = user2Result[0].id;

    // Create valid sessions for both users
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);

    await db.insert(sessionsTable)
      .values([
        {
          user_id: user1Id,
          token: 'user1_token',
          expires_at: futureDate
        },
        {
          user_id: user2Id,
          token: 'user2_token',
          expires_at: futureDate
        }
      ])
      .execute();

    // Test that we get the correct user for each token
    const result1 = await getCurrentUser('user1_token');
    const result2 = await getCurrentUser('user2_token');

    expect(result1).toBeDefined();
    expect(result1!.username).toEqual('user1');
    expect(result1!.email).toEqual('user1@example.com');

    expect(result2).toBeDefined();
    expect(result2!.username).toEqual('user2');
    expect(result2!.email).toEqual('user2@example.com');
  });
});