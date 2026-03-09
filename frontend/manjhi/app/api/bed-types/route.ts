import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/bed-types — list all bed types
export async function GET() {
  const { data, error } = await supabase
    .from("bed_types")
    .select("*")
    .order("type_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/bed-types — create a new bed type
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("bed_types")
    .insert({ type_name: body.type_name })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
