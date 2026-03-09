import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

type Params = { params: Promise<{ id: string }> };

// GET /api/users/[id]/health-records
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("user_health_records")
    .select("*")
    .eq("user_id", id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/users/[id]/health-records
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("user_health_records")
    .insert({ ...body, user_id: id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/users/[id]/health-records — update latest record
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const recordId = body.record_id;
  delete body.record_id;

  if (!recordId) {
    return NextResponse.json({ error: "record_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("user_health_records")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", recordId)
    .eq("user_id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
