import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Return Mock AI response
    const mockResponse = `This is a mock response from MediBot. I received your message: "**${message}**". \n\nAs requested, the real AI dependency has been removed across the application, and we are working entirely with static mock data now.`;

    return NextResponse.json({ response: mockResponse });
  } catch (error) {
    console.error('Error in mock chat handler:', error);
    return NextResponse.json({ error: 'Internal server error. Please try again later.' }, { status: 500 });
  }
}