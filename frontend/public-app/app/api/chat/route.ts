import { NextRequest, NextResponse } from 'next/server';

import { runChennaiHealthAgent } from '@/lib/ai/chennai-agent';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const result = await runChennaiHealthAgent({
      message,
      history: Array.isArray(history) ? history : [],
    });

    return NextResponse.json({
      response: result.response,
      toolsUsed: result.toolsUsed,
      agent: 'langgraph-groq',
    });
  } catch (error) {
    console.error('Error in chat handler:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Internal server error',
      },
      { status: 500 },
    );
  }
}