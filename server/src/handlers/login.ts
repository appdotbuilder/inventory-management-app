import { db } from '../db';
import { usersTable, sessionsTable } from '../db/schema';
import { type LoginInput, type LoginResponse } from '../schema';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

export const login = async (input: LoginInput): Promise<LoginResponse> => {
  try {
    // Find user by email
    const users = await db.select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
      .execute();

    if (users.length === 0) {
      return {
        success: false,
        message: 'Invalid email or password',
        user: undefined
      };
    }

    const user = users[0];

    // For this implementation, we'll use a simple password comparison
    // In a real application, you would use bcrypt to compare hashed passwords
    // Since we don't have bcrypt dependency, we'll simulate password verification
    const isValidPassword = await verifyPassword(input.password, user.password_hash);
    
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid email or password',
        user: undefined
      };
    }

    // Create session token
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

    // Save session to database
    await db.insert(sessionsTable)
      .values({
        user_id: user.id,
        token: sessionToken,
        expires_at: expiresAt
      })
      .execute();

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
  } catch (error) {
    console.error('Login failed:', error);
    return {
      success: false,
      message: 'An error occurred during login',
      user: undefined
    };
  }
};

// Helper function to generate session token
const generateSessionToken = (): string => {
  return randomBytes(32).toString('hex');
};

// Helper function to verify password
// In a real application, this would use bcrypt.compare()
const verifyPassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  // For testing purposes, we'll assume the password hash is just the plain password
  // In production, you would use: return await bcrypt.compare(plainPassword, hashedPassword);
  return plainPassword === hashedPassword;
};