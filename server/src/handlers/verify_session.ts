import { db } from '../db';
import { sessionsTable, usersTable } from '../db/schema';
import { type User } from '../schema';
import { eq, and, gt } from 'drizzle-orm';

export const verifySession = async (sessionToken: string): Promise<User | null> => {
  try {
    // Query session with joined user data
    const results = await db.select()
      .from(sessionsTable)
      .innerJoin(usersTable, eq(sessionsTable.user_id, usersTable.id))
      .where(
        and(
          eq(sessionsTable.token, sessionToken),
          gt(sessionsTable.expires_at, new Date()) // Session must not be expired
        )
      )
      .execute();

    // If no valid session found, return null
    if (results.length === 0) {
      return null;
    }

    // Return the user data from the joined result
    const userData = results[0].users;
    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      password_hash: userData.password_hash,
      created_at: userData.created_at,
      updated_at: userData.updated_at
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    throw error;
  }
};