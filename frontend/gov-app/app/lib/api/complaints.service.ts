import { supabase } from "./supabase";

/**
 * TYPES
 * These mirror your DB structure
 */

export type ComplaintSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface ComplaintPayload {
  title: string;
  description: string;
  target_audience: "ALL_PUBLIC" | "HOSPITALS" | "NGOS";
  regions?: string[];
  expires_in_hours?: number;
  issued_by?: string;
  ui?: {
    show_as_banner?: boolean;
    priority?: "NORMAL" | "EMERGENCY";
  };
}

export interface GovtComplaint {
  id: string;
  hospital_id: string | null;
  category: string;
  severity: ComplaintSeverity;
  payload: ComplaintPayload;
  created_at: string;
}

/**
 * ================================
 * READ OPERATIONS
 * ================================
 */

/**
 * Get all PUBLIC advisories (hospital_id IS NULL)
 */
export async function getPublicComplaints(): Promise<GovtComplaint[]> {
  const { data, error } = await supabase
    .from("govt_complaints")
    .select("id, hospital_id, category, severity, payload, created_at")
    .is("hospital_id", null)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching public complaints:", error);
    throw error;
  }

  return data as GovtComplaint[];
}

/**
 * Get complaints for a specific hospital
 */
export async function getHospitalComplaints(
  hospitalId: string
): Promise<GovtComplaint[]> {
  const { data, error } = await supabase
    .from("govt_complaints")
    .select("id, hospital_id, category, severity, payload, created_at")
    .eq("hospital_id", hospitalId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching hospital complaints:", error);
    throw error;
  }

  return data as GovtComplaint[];
}

/**
 * ================================
 * WRITE OPERATIONS
 * ================================
 */

/**
 * Create a new complaint / advisory
 */
export async function createComplaint(input: {
  hospital_id?: string | null;
  category: string;
  severity: ComplaintSeverity;
  payload: ComplaintPayload;
}) {
  const { error } = await supabase.from("govt_complaints").insert({
    hospital_id: input.hospital_id ?? null,
    category: input.category,
    severity: input.severity,
    payload: input.payload
  });

  if (error) {
    console.error("Error creating complaint:", error);
    throw error;
  }
}

/**
 * ================================
 * UPDATE OPERATIONS
 * ================================
 */

/**
 * Update complaint payload or severity
 */
export async function updateComplaint(
  id: string,
  updates: Partial<{
    category: string;
    severity: ComplaintSeverity;
    payload: ComplaintPayload;
  }>
) {
  const { error } = await supabase
    .from("govt_complaints")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Error updating complaint:", error);
    throw error;
  }
}

/**
 * ================================
 * DELETE (OPTIONAL – ADMIN ONLY)
 * ================================
 */

export async function deleteComplaint(id: string) {
  const { error } = await supabase
    .from("govt_complaints")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting complaint:", error);
    throw error;
  }
}
