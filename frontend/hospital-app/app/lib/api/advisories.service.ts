import { supabase } from "./supabase";

/* ---------------- TYPES ---------------- */

export type AdvisorySeverity = "Info" | "Warning" | "Critical";

export interface AdvisoryPayload {
  target_audience?: "ALL" | "HOSPITALS" | "PUBLIC";
  regions?: string[];
  expires_in_hours?: number;
  issued_by?: string;
  ui?: {
    priority?: "NORMAL" | "EMERGENCY";
    show_as_banner?: boolean;
  };
}

export interface Advisory {
  id: string;
  title: string;
  category: string;
  severity: AdvisorySeverity;
  message: string;
  payload: AdvisoryPayload;
  created_at: string;
}

/* ---------------- READ ---------------- */

/**
 * Fetch advisories for Government Alerts screen
 */
export async function getAdvisories(params?: {
  search?: string;
  severity?: AdvisorySeverity | "All";
}) {
  let query = supabase
    .from("advisories")
    .select("id, title, category, severity, message, payload, created_at")
    .order("created_at", { ascending: false });

  /* Filter by severity */
  if (params?.severity && params.severity !== "All") {
    query = query.eq("severity", params.severity);
  }

  /* Search (title + message) */
  if (params?.search && params.search.trim() !== "") {
    query = query.or(
      `title.ilike.%${params.search}%,message.ilike.%${params.search}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    console.error("Failed to fetch advisories:", error);
    throw error;
  }

  return data as Advisory[];
}
