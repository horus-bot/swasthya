import { NextResponse } from "next/server";
import supabase from "@/app/lib/api/supabase";

// GET /api/dashboard/stats — aggregated dashboard KPIs
export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const [
    appointmentsToday,
    totalUsers,
    activeCamps,
    flaggedScreenings,
    activeUnits,
    todayCamps,
    unreadNotifications,
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("id", { count: "exact", head: true })
      .eq("appointment_date", today),
    supabase
      .from("user_details")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("camps")
      .select("id", { count: "exact", head: true })
      .in("status", ["active", "closing_soon"]),
    supabase
      .from("health_screenings")
      .select("id", { count: "exact", head: true })
      .in("status", ["flagged", "critical"]),
    supabase
      .from("mobile_health_units")
      .select("id", { count: "exact", head: true })
      .in("status", ["active", "en_route"]),
    supabase
      .from("camps")
      .select("*")
      .eq("camp_date", today)
      .in("status", ["active", "closing_soon", "scheduled"])
      .order("start_time", { ascending: true }),
    supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
  ]);

  return NextResponse.json({
    appointments_today: appointmentsToday.count ?? 0,
    total_users: totalUsers.count ?? 0,
    active_camps: activeCamps.count ?? 0,
    high_risk_cases: flaggedScreenings.count ?? 0,
    active_units: activeUnits.count ?? 0,
    today_camps: todayCamps.data ?? [],
    unread_notifications: unreadNotifications.count ?? 0,
  });
}
