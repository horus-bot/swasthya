import { NextResponse } from 'next/server';

export async function GET() {
  // Replace axios request to wttr.in with mock weather
  const temp = "29";
  const desc = "Partly Cloudy";
  const humidity = "70";

  return NextResponse.json({ temp, desc, humidity });
}