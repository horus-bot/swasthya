import { NextRequest, NextResponse } from 'next/server';

const SANITY_PROJECT = process.env.SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.SANITY_DATASET;
const SANITY_TOKEN = process.env.SANITY_READ_TOKEN; // optional read token

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    if (!SANITY_PROJECT || !SANITY_DATASET) {
      return NextResponse.json({ error: 'Sanity project/dataset not configured' }, { status: 500 });
    }

    const url = `https://${SANITY_PROJECT}.api.sanity.io/v2024-10-01/data/query/${SANITY_DATASET}?query=${encodeURIComponent(query)}`;
    const resp = await fetch(url, {
      headers: SANITY_TOKEN ? { Authorization: `Bearer ${SANITY_TOKEN}` } : undefined,
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error('Sanity error:', resp.status, text);
      return NextResponse.json({ error: 'Sanity request failed' }, { status: 502 });
    }

    const json = await resp.json();
    return NextResponse.json(json);
  } catch (e) {
    console.error('GROQ proxy error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
