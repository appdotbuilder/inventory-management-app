import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { verifySession } from '../handlers/verify_session';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password_hash: 'hashed_password_123'
};

const createValidSession = async (userId: number) => {
  const futureDate = new Date();
  futureDate.setHours(futureDate.getHours() + 1); // Valid for 1 hour

  const sessionResult = await db.insert(sessionsTable)
    .values({
      user_id: userId,
      token: 'valid_session_token_123',
      expires_at: futureDate
    })
    .returning()
    .execute();

  return sessionResult[0];
};

const createExpiredSession = async (userId: number) => {
  const pastDate = new Date();
  pastDate.setHours(pastDate.getHours() - 1); // Expired 1 hour ago

  const sessionResult = await db.insert(sessionsTable)
    .values({
      user_id: userId,
      token: 'expired_session_token_123',
      expires_at: pastDate
    })
    .returning()
    .execute();

  return sessionResult[0];
};

describe('verifySession', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return user for valid session token', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();
    const user = userResult[0];

    // Create valid session
    await createValidSession(user.id);

    // Verify session
    const result = await verifySession('valid_session_token_123');

    expect(result).not.toBeNull();
    expect(result?.id).toEqual(user.id);
    expect(result?.username).toEqual('testuser');
    expect(result?.email).toEqual('test@example.com');
    expect(result?.password_hash).toEqual('hashed_password_123');
    expect(result?.created_at).toBeInstanceOf(Date);
    expect(result?.updated_at).toBeInstanceOf(Date);
  });

  it('should return null for expired session token', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();
    const user = userResult[0];

    // Create expired session
    await createExpiredSession(user.id);

    // Verify session
    const result = await verifySession('expired_session_token_123');

    expect(result).toBeNull();
  });

  it('should return null for non-existent session token', async () => {
    // Try to verify a session that doesn't exist
    const result = await verifySession('non_existent_token');

    expect(result).toBeNull();
  });

  it('should return null for empty session token', async () => {
    const result = await verifySession('');

    expect(result).toBeNull();
  });

  it('should handle multiple sessions for same user correctly', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();
    const user = userResult[0];

    // Create multiple sessions - one valid, one expired
    await createValidSession(user.id);
    await createExpiredSession(user.id);

    // Valid session should return user
    const validResult = await verifySession('valid_session_token_123');
    expect(validResult).not.toBeNull();
    expect(validResult?.id).toEqual(user.id);

    // Expired session should return null
    const expiredResult = await verifySession('expired_session_token_123');
    expect(expiredResult).toBeNull();
  });

  it('should verify session at exact expiration boundary', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values(testUser)
      .returning()
      .execute();
    const user = userResult[0];

    // Create session that expires very soon (within milliseconds)
    const nearFutureDate = new Date(Date.now() + 100); // 100ms from now

    await db.insert(sessionsTable)
      .values({
        user_id: user.id,
        token: 'boundary_session_token',
        expires_at: nearFutureDate
      })
      .execute();

    // Immediately verify - should be valid
    const result = await verifySession('boundary_session_token');
    expect(result).not.toBeNull();

    // Wait for expiration and verify again
    await new Promise(resolve => setTimeout(resolve, 150));
    const expiredResult = await verifySession('boundary_session_token');
    expect(expiredResult).toBeNull();
  });
});