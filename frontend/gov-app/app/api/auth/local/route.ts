import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();
    const expected = process.env.GOV_LOCAL_PASSWORD;
    if (!expected) {
      return NextResponse.json({ error: 'Server not configured' }, { status: 500 });
    }
    if (password === expected) {
      return NextResponse.json({ ok: true, username });
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
