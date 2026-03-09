import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/camps — list camps (supports ?status=&date=)
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  const date = req.nextUrl.searchParams.get("date");

  let query = supabase.from("camps").select("*").order("camp_date", { ascending: true });

  if (status) query = query.eq("status", status);
  if (date) query = query.eq("camp_date", date);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/camps — create a new camp
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("camps")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
