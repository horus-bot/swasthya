import { supabase } from "./supabase";

/* ---------- TYPES ---------- */

export type RequestPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface EquipmentRequest {
  id: string;
  equipment_type: string;
  quantity: number;
  priority: RequestPriority;
  status: RequestStatus;
  message: string | null;
  requested_at: string;
  reviewed_at: string | null;
}

/* ---------- CREATE ---------- */

/**
 * Create a new equipment / resource request
 * Called when "Send Request" is clicked
 */
export async function createEquipmentRequest(input: {
  equipment_type: string;
  quantity: number;
  priority: RequestPriority;
  message?: string;
}) {
  const { error } = await supabase
    .from("equipment_requests")
    .insert({
      equipment_type: input.equipment_type,
      quantity: input.quantity,
      priority: input.priority,
      status: "PENDING",
      message: input.message ?? null,
      requested_at: new Date().toISOString()
    });

  if (error) {
    console.error("Failed to create equipment request:", error);
    throw error;
  }
}

/* ---------- READ ---------- */

export async function getEquipmentRequests() {
  const { data, error } = await supabase
    .from("equipment_requests")
    .select(`
      id,
      equipment_type,
      quantity,
      priority,
      status,
      message,
      requested_at,
      reviewed_at
    `)
    .order("requested_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch equipment requests:", error);
    throw error;
  }

  return data as EquipmentRequest[];
}
