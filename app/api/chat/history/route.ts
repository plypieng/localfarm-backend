import { NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth'; // Assuming @/lib maps to d:/Localfarm/localfarm-backend/lib
import prisma from '@/lib/prisma'; // Assuming @/lib maps to d:/Localfarm/localfarm-backend/lib

const MESSAGES_TO_FETCH = 20;

export async function GET(request: Request) {
  if (request.method !== 'GET') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized: User not authenticated.' }, { status: 401 });
  }

  try {
    const history = await prisma.chatMessage.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'asc', // Fetch in ascending order to maintain conversation flow
      },
      take: MESSAGES_TO_FETCH, // Get the last N messages
    });

    // The 'history' will contain objects with id, userId, role, content, createdAt
    // We can directly return this, or map it if a different structure is needed for the client
    return NextResponse.json(history, { status: 200 });

  } catch (error) {
    console.error('Failed to fetch chat history:', error);
    return NextResponse.json({ error: 'Failed to fetch chat history.' }, { status: 500 });
  }
}
