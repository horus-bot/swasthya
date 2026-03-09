import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/notification-types — list all notification types
export async function GET() {
  const { data, error } = await supabase
    .from("notification_types")
    .select("*")
    .order("type_name", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/notification-types — create a new notification type
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("notification_types")
    .insert({ type_name: body.type_name })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
