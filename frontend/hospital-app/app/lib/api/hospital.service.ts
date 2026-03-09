import { supabase } from "./supabase";

/**
 * Register a new hospital with specific details
 */
export const registerHospital = async (hospitalData: {
  id: string;
  name: string;
  ward_id: string;
  total_doctors: number;
  available_doctors: number;
  total_staff: number;
  available_staff: number;
  beds_available: number;
  equipment_available: number;
}) => {
  const { data, error } = await supabase
    .from("hospitals")
    .insert([hospitalData])
    .single();

  if (error) throw error;
  return data;
};

/**
 * Create a new hospital
 */
export const createHospital = async (hospitalData: {
  id: string;
  name: string;
  ward_id: string;
  district: string;
  state: string;
  total_doctors: number;
  total_staff: number;
  equipment_available: number;
  beds_available: number;
}) => {
  const { data, error } = await supabase
    .from("hospitals")
    .insert([hospitalData])
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get all hospitals (for govt / admin dashboards)
 */
export const getAllHospitals = async () => {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*");

  if (error) throw error;
  return data;
};

/**
 * Get hospital by ID
 */
export const getHospitalById = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from("hospitals")
    .select("*")
    .eq("id", hospitalId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update hospital stats (beds, doctors, equipment, staff)
 */
export const updateHospitalStats = async (
  hospitalId: string,
  updates: {
    total_doctors?: number;
    total_staff?: number;
    equipment_available?: number;
    beds_available?: number;
  }
) => {
  const { data, error } = await supabase
    .from("hospitals")
    .update(updates)
    .eq("id", hospitalId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Create user profile for hospital staff
 */
export const createUserProfile = async (profileData: {
  id: string;
  name: string;
  email: string;
  role: string;
  hospital_id?: string;
}) => {
  const { data, error } = await supabase
    .from("profiles")
    .insert([{
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      role: profileData.role,
      hospital_id: profileData.hospital_id || null,
      created_at: new Date().toISOString()
    }])
    .single();

  if (error) throw error;
  return data;
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  updates: {
    name?: string;
    role?: string;
    hospital_id?: string;
  }
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

/**
 * Insert SIMS Hospital data
 */
export const insertSIMSHospital = async () => {
  const { data, error } = await supabase.from("hospitals").insert({
    id: "sims1012",
    name: "SIMS Hospital",
    ward_id: "ward-123",
    total_doctors: 55,
    available_doctors: 6,
    total_staff: 200,
    available_staff: 150,
    total_beds: 200,
    beds_available: 100
  });

  if (error) throw error;
  return data;
};
