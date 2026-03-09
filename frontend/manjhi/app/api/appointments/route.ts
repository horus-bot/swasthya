import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/appointments — list appointments (supports ?hospital_id=&status=&date=)
export async function GET(req: NextRequest) {
  const hospitalId = req.nextUrl.searchParams.get("hospital_id");
  const status = req.nextUrl.searchParams.get("status");
  const date = req.nextUrl.searchParams.get("date");

  let query = supabase
    .from("appointments")
    .select("*, hospital_details(hospital_name)")
    .order("appointment_date", { ascending: true });

  if (hospitalId) query = query.eq("hospital_id", hospitalId);
  if (status) query = query.eq("status", status);
  if (date) query = query.eq("appointment_date", date);

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/appointments — create a new appointment
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("appointments")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
