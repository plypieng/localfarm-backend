import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

/**
 * Retrieves the current user's ID from the session.
 * @returns {Promise<string | null>} The user ID if authenticated, otherwise null.
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions);
    // The session is properly typed through our next-auth.d.ts declaration
    return session?.user?.id || null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
}
