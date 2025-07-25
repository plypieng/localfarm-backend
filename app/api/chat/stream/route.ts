import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getCurrentUserId } from '@/lib/auth'; // Assuming @/lib maps to d:/Localfarm/localfarm-backend/lib
import { streamChatCompletion } from '@/lib/openai';
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

const allowedOrigins = [
  process.env.NEXT_PUBLIC_WEB_URL,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean) as string[];

const getCorsHeaders = (origin: string | null) => {
  const headers: { [key: string]: string } = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  if (origin && allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }
  return headers;
};

export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  const corsHeaders = getCorsHeaders(origin);

  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
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
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400, headers: corsHeaders });
    }
    return NextResponse.json({ error: 'Bad request' }, { status: 400, headers: corsHeaders });
  }

  const { message: userMessageContent, history: clientHistory = [] } = validatedData;

  try {
    // 1. Save user's message to the database (disabled for testing)
    // await prisma.chatMessage.create({
    //   data: {
    //     userId: userId,
    //     role: 'user',
    //     content: userMessageContent,
    //   },
    // });

    // 2. Prepare messages for OpenAI
    const messages: ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...clientHistory.map(item => ({ role: item.role as 'user' | 'assistant', content: item.content })),
      { role: 'user', content: userMessageContent },
    ];

    // 3. Get the streaming response from OpenAI
    const stream = streamChatCompletion(messages);
    let accumulatedAIResponse = '';

    // 4. Create a new ReadableStream to send to the client
    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            accumulatedAIResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (error) {
          console.error('Error during stream processing:', error);
          // Optionally enqueue an error message to the client stream
          controller.enqueue(encoder.encode(JSON.stringify({ error: 'Error processing AI response.' })));
        } finally {
          controller.close();

          // 5. Save accumulated AI response to the database after stream ends (disabled for testing)
          // if (accumulatedAIResponse.trim()) {
          //   try {
          //     await prisma.chatMessage.create({
          //       data: {
          //         userId: userId,
          //         role: 'assistant',
          //         content: accumulatedAIResponse.trim(),
          //       },
          //     });
          //   } catch (dbError) {
          //     console.error('Failed to save AI response to DB:', dbError);
          //   }
          // }
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Failed to process chat stream request:', error);
    // Check if it's an OpenAI API error or other type
    let errorMessage = 'Failed to process chat request.';
    if (error instanceof Error && error.message.includes('OPENAI_API_KEY')) {
        errorMessage = 'OpenAI API key is not configured or invalid.';
    }
    return NextResponse.json({ error: errorMessage }, { status: 500, headers: corsHeaders });
  }
}
