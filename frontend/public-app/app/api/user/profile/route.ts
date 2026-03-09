import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/user/profile?userId=<uuid>
export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("user_details")
    .select("*, user_health_records(*)")
    .eq("id", userId)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// PUT /api/user/profile  — update user details and/or health record
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, userDetails, healthRecord } = body;

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    let updatedUser = null;
    let updatedHealth = null;

    if (userDetails) {
      const { data, error } = await supabase
        .from("user_details")
        .update(userDetails)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      updatedUser = data;
    }

    if (healthRecord) {
      // Check if record exists
      const { data: existing } = await supabase
        .from("user_health_records")
        .select("id")
        .eq("user_id", userId)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from("user_health_records")
          .update({ ...healthRecord, updated_at: new Date().toISOString() })
          .eq("id", existing.id)
          .select()
          .single();
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        updatedHealth = data;
      } else {
        const { data, error } = await supabase
          .from("user_health_records")
          .insert({ user_id: userId, ...healthRecord })
          .select()
          .single();
        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }
        updatedHealth = data;
      }
    }

    return NextResponse.json({ user: updatedUser, healthRecord: updatedHealth });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
