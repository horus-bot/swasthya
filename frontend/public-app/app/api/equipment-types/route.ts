import { NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/equipment-types
export async function GET() {
  const { data, error } = await supabase
    .from("equipment_types")
    .select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
