import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserId } from '@/lib/auth'; // Assuming @/lib maps to d:/Localfarm/localfarm-backend/lib
import { getChatCompletion } from '@/lib/openai';
import { prisma } from '@/lib/prisma';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

// Zod schema for input validation
const chatRequestSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty.'),
  history: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
});

// System prompt for the AI
const SYSTEM_PROMPT = `You are LocalFarm AI, an expert agricultural assistant specializing in farming practices in Niigata, Japan. Provide concise, practical, and actionable advice to farmers. Consider local climate, soil conditions, and common crops of the region like rice, edamame, and sake rice. Be friendly and supportive.`;

const allowedOrigin = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3001';

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(request: Request) {
  const headers = {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers });
  }

  // const userId = await getCurrentUserId();
  // if (!userId) {
  //   return NextResponse.json({ error: 'Unauthorized: User not authenticated.' }, { status: 401 });
  // }
  const userId = 'temp-test-user'; // Hardcoded for testing

  let validatedData;
  try {
    const body = await request.json();
    validatedData = chatRequestSchema.parse(body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400, headers });
    }
    return NextResponse.json({ error: 'Bad request' }, { status: 400, headers });
  }

  const { message: userMessageContent, history: clientHistory = [] } = validatedData;

  try {
    // 1. Prepare messages for OpenAI
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...clientHistory.map(item => ({ role: item.role as 'user' | 'assistant', content: item.content })),
      { role: 'user', content: userMessageContent },
    ];

    // 2. Get the complete response from OpenAI
    const aiResponse = await getChatCompletion(messages);

    // 3. Save user's and AI's messages to the database (disabled for testing)

    // 4. Return the AI response
    return NextResponse.json({ response: aiResponse }, { status: 200, headers });

  } catch (error) {
    console.error('Failed to process chat request:', error);
    let errorMessage = 'Failed to process chat request.';
    if (error instanceof Error) {
        // A more specific error from OpenAI might be in error.message
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500, headers });
  }
}
