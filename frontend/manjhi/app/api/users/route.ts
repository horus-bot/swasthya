import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import supabase from "@/app/lib/api/supabase";

// GET /api/users — list all users (supports ?search=)
export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("search");

  let query = supabase.from("user_details").select("*").order("created_at", { ascending: false });

  if (search) {
    query = query.or(`name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/users — create a new user
// user_details.id has no DEFAULT, so we generate a UUID server-side
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, age, gender, phone, email } = body;
  const id = body.id || crypto.randomUUID();

  const { data, error } = await supabase
    .from("user_details")
    .insert({ id, name, age, gender, phone, email })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
