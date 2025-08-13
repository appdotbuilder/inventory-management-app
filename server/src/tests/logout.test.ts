import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { logout } from '../handlers/logout';
import { eq } from 'drizzle-orm';

describe('logout', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should successfully logout with valid session token', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password'
      })
      .returning()
      .execute();

    const userId = userResult[0].id;

    // Create test session
    const sessionResult = await db.insert(sessionsTable)
      .values({
        user_id: userId,
        token: 'valid_session_token_123',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
      })
      .returning()
      .execute();

    const result = await logout('valid_session_token_123');

    expect(result.success).toBe(true);
    expect(result.message).toEqual('Successfully logged out');

    // Verify session was deleted from database
    const sessions = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.token, 'valid_session_token_123'))
      .execute();

    expect(sessions).toHaveLength(0);
  });

  it('should return failure when session token not found', async () => {
    const result = await logout('nonexistent_token');

    expect(result.success).toBe(false);
    expect(result.message).toEqual('Session not found or already expired');
  });

  it('should handle empty session token', async () => {
    const result = await logout('');

    expect(result.success).toBe(false);
    expect(result.message).toEqual('Session not found or already expired');
  });

  it('should delete correct session when multiple sessions exist', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password'
      })
      .returning()
      .execute();

    const userId = userResult[0].id;

    // Create multiple test sessions
    await db.insert(sessionsTable)
      .values([
        {
          user_id: userId,
          token: 'session_token_1',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
          user_id: userId,
          token: 'session_token_2',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        {
          user_id: userId,
          token: 'session_token_3',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      ])
      .execute();

    // Logout with specific token
    const result = await logout('session_token_2');

    expect(result.success).toBe(true);
    expect(result.message).toEqual('Successfully logged out');

    // Verify only the targeted session was deleted
    const remainingSessions = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.user_id, userId))
      .execute();

    expect(remainingSessions).toHaveLength(2);
    
    const tokenExists = remainingSessions.some(session => session.token === 'session_token_2');
    expect(tokenExists).toBe(false);

    // Verify other sessions still exist
    const token1Exists = remainingSessions.some(session => session.token === 'session_token_1');
    const token3Exists = remainingSessions.some(session => session.token === 'session_token_3');
    expect(token1Exists).toBe(true);
    expect(token3Exists).toBe(true);
  });

  it('should handle expired sessions correctly', async () => {
    // Create test user
    const userResult = await db.insert(usersTable)
      .values({
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password'
      })
      .returning()
      .execute();

    const userId = userResult[0].id;

    // Create expired session
    await db.insert(sessionsTable)
      .values({
        user_id: userId,
        token: 'expired_token_123',
        expires_at: new Date(Date.now() - 60 * 60 * 1000) // 1 hour ago
      })
      .execute();

    // Should still be able to delete expired sessions
    const result = await logout('expired_token_123');

    expect(result.success).toBe(true);
    expect(result.message).toEqual('Successfully logged out');

    // Verify session was deleted
    const sessions = await db.select()
      .from(sessionsTable)
      .where(eq(sessionsTable.token, 'expired_token_123'))
      .execute();

    expect(sessions).toHaveLength(0);
  });
});