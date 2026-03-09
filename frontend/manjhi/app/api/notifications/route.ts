import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/notifications — list notifications (supports ?user_id=&is_read=)
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id");
  const isRead = req.nextUrl.searchParams.get("is_read");

  let query = supabase
    .from("notifications")
    .select("*, notification_types(type_name)")
    .order("created_at", { ascending: false });

  if (userId) query = query.eq("user_id", userId);
  if (isRead !== null && isRead !== undefined) query = query.eq("is_read", isRead === "true");

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/notifications — create a new notification
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { data, error } = await supabase
    .from("notifications")
    .insert(body)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
