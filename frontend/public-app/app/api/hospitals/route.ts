import { NextRequest, NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/hospitals — list all hospitals with doctors & equipment
export async function GET() {
  const { data, error } = await supabase
    .from("hospital_details")
    .select(`
      *,
      hospital_doctors(*),
      hospital_equipment_inventory(*, equipment_types:equipment_type_id(*))
    `)
    .order("hospital_name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
