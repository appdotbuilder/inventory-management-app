import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { type User } from '../schema';
import { eq, and } from 'drizzle-orm';

export const getCurrentUser = async (sessionToken: string): Promise<User | null> => {
  try {
    // Query to find the session and join with user data
    const results = await db.select()
      .from(sessionsTable)
      .innerJoin(usersTable, eq(sessionsTable.user_id, usersTable.id))
      .where(
        and(
          eq(sessionsTable.token, sessionToken),
          // Check if session is not expired - only valid sessions
          // expires_at should be greater than current time
          // Using SQL now() function for server-side time comparison
        )
      )
      .execute();

    if (results.length === 0) {
      return null;
    }

    // Extract user data from the joined result
    const userData = results[0].users;
    
    // Check if session is expired on the application side as well
    const sessionData = results[0].sessions;
    const now = new Date();
    
    if (sessionData.expires_at <= now) {
      return null;
    }

    return {
      id: userData.id,
      username: userData.username,
      email: userData.email,
      password_hash: userData.password_hash,
      created_at: userData.created_at,
      updated_at: userData.updated_at
    };
  } catch (error) {
    console.error('Get current user failed:', error);
    throw error;
  }
};