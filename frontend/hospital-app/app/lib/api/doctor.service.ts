import { supabase } from './supabase';

export const getDoctors = async () => {
  return supabase.from('doctor').select('*');
};

export const getAvailableDoctors = async () => {
  return supabase
    .from('staff')
    .select('*')
    .eq('availability_status', 'available')
    .eq('on_duty', true);
};

export const createDoctor = async (doctor: {
  name: string;
  specialization: string;
  on_duty: boolean;
  availability_status: 'available' | 'busy' | 'off';
}) => {
  return supabase.from('doctor').insert(doctor);
};

export async function getStaffSchedule(hospitalId: string) {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('hospital_id', hospitalId)
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data;
}

export async function getStaffStats(hospitalId: string) {
  const { data, error } = await supabase
    .from('staff')
    .select('availability_status')
    .eq('hospital_id', hospitalId);

  if (error) throw error;

  const rows = data ?? [];

  return {
    onDuty: rows.filter((s: any) => s.availability_status === 'on_duty').length,
    scheduled: rows.filter((s: any) => s.availability_status === 'scheduled').length,
    onBreak: rows.filter((s: any) => s.availability_status === 'on_break').length,
    total: rows.length,
  };
}

export async function getStaff(hospitalId: string) {
  const { data, error } = await supabase
    .from('staff')
    .select('now, scheduled, on_break, total_staff')
    .eq('hospital_id', hospitalId);

  if (error) {
    console.error("getStaff supabase error:", error);
    try {
      console.error("getStaff error (serialized):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } catch (e) {
      console.error("Failed to stringify error:", e);
    }
    return [];
  }

  return data ?? [];
}