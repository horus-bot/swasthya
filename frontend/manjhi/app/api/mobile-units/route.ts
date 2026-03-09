import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/mobile-units — list all mobile health units
export async function GET() {
  const { data, error } = await supabase
    .from("mobile_health_units")
    .select("*, camps(name)")
    .order("unit_code", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/mobile-units — create a new unit
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("mobile_health_units")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
