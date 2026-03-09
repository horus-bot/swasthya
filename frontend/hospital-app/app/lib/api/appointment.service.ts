import { supabase } from "./supabase";

/* ---------- TYPES ---------- */

export interface Appointment {
  id: string;
  created_at: string;

  name: string;
  email: string;
  phone: string;
  emergency_contact: string | null;

  depart: string;
  preferred_doc: string;
  appointment_date: string;   // date
  preferred_time: string;     // time / timestamptz
  d_o_birth: string;
}

/* ---------- READ (HOSPITAL DASHBOARD) ---------- */

/**
 * Fetch ALL appointment requests for hospital
 * (since hospital_id does not exist)
 */
export async function getPendingAppointments() {
  const { data, error } = await supabase
    .from("appointments")
    .select(`
      id,
      created_at,
      name,
      email,
      phone,
      emergency_contact,
      depart,
      preferred_doc,
      appointment_date,
      preferred_time,
      d_o_birth
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch appointments:", error);
    throw error;
  }

  return data as Appointment[];
}

/* ---------- UPDATE ---------- */

export async function updateAppointmentStatus(
  id: string,
  status: 'pending' | 'scheduled' | 'completed' | 'cancelled'
) {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select();

  if (error) {
    const message = error?.message ?? JSON.stringify(error ?? {});
    console.error('Failed to update appointment status:', error);
    throw new Error(message);
  }

  return { data };
}
