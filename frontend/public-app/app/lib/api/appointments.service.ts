import { supabase } from "./supabase";

/* ---------------- TYPES ---------------- */

export interface CreateAppointmentInput {
  hospital_id: string;

  name: string;
  email: string;
  phone: string;
  d_o_birth: string; // yyyy-mm-dd
  emergency_contact?: string;

  depart: string;
  preferred_doc: string;
  appointment_date: string; // yyyy-mm-dd
  preferred_time: string;   // ISO timestamp or HH:mm
}

/* ---------------- CREATE ---------------- */

/**
 * Book a new appointment
 * Called ONLY when user clicks "Book Appointment"
 */
export async function bookAppointment(
  data: CreateAppointmentInput
) {
  const { error } = await supabase
    .from("appointments")
    .insert({

      name: data.name,
      email: data.email,
      phone: data.phone,
      d_o_birth: data.d_o_birth,
      emergency_contact: data.emergency_contact,

      depart: data.depart,
      preferred_doc: data.preferred_doc,
      appointment_date: data.appointment_date,
      preferred_time: data.preferred_time
    });

  if (error) {
    console.error("Failed to book appointment:", error);
    throw error;
  }
}
