import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/equipment-types — list all equipment types
export async function GET() {
  const { data, error } = await supabase
    .from("equipment_types")
    .select("*")
    .order("equipment_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/equipment-types — create a new equipment type
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("equipment_types")
    .insert({ equipment_name: body.equipment_name })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
