import { db } from '../db';
import { sessionsTable } from '../db/schema';
import { eq } from 'drizzle-orm';

export const logout = async (sessionToken: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Find and delete the session by token
    const result = await db.delete(sessionsTable)
      .where(eq(sessionsTable.token, sessionToken))
      .returning()
      .execute();

    if (result.length === 0) {
      return {
        success: false,
        message: 'Session not found or already expired'
      };
    }

    return {
      success: true,
      message: 'Successfully logged out'
    };
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};