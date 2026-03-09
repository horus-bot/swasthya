import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/hospitals — list all hospitals
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search");

  let query = supabase.from("hospital_details").select("*").order("created_at", { ascending: false });

  if (search) {
    query = query.or(`hospital_name.ilike.%${search}%,address.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/hospitals — create a new hospital
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { user_id, hospital_name, address, phone } = body;

  const { data, error } = await supabase
    .from("hospital_details")
    .insert({ user_id, hospital_name, address, phone })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
