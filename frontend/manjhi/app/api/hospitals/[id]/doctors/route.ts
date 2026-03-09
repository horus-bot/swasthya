import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

type Params = { params: Promise<{ id: string }> };

// GET /api/hospitals/[id]/doctors
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("hospital_doctors")
    .select("*")
    .eq("hospital_id", id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/hospitals/[id]/doctors
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("hospital_doctors")
    .insert({ ...body, hospital_id: id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/hospitals/[id]/doctors — update doctor counts
export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const recordId = body.record_id;
  delete body.record_id;

  if (!recordId) {
    return NextResponse.json({ error: "record_id is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("hospital_doctors")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", recordId)
    .eq("hospital_id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
