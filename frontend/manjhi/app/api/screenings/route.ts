import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/screenings — list screenings (supports ?camp_id=&status=)
export async function GET(req: NextRequest) {
  const campId = req.nextUrl.searchParams.get("camp_id");
  const status = req.nextUrl.searchParams.get("status");
  const limit = req.nextUrl.searchParams.get("limit");

  let query = supabase
    .from("health_screenings")
    .select("*")
    .order("screened_at", { ascending: false });

  if (campId) query = query.eq("camp_id", campId);
  if (status) query = query.eq("status", status);
  if (limit) query = query.limit(parseInt(limit));

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/screenings — create a new screening result
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("health_screenings")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
