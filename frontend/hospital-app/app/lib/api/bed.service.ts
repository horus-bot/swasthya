import { supabase } from "./supabase";

/**
 * Get bed status rows for a hospital (aggregate counts)
 */
export const getBedStatusByHospital = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from("bed_status")
    .select("*")
    .eq("hospital_id", hospitalId);

  return { data, error };
};

/**
 * Get bed status (latest aggregated snapshot)
 */
export const getBedStatus = async () => {
  return supabase
    .from("bed_status")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .single();
};

/**
 * Get individual bed records by hospital
 */
export const getBedsByHospital = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from("beds")
    .select("*")
    .eq("hospital_id", hospitalId)
    .order("bed_number", { ascending: true });

  return { data, error };
};

/**
 * Update individual bed status
 */
export const updateBedRecord = async (
  bedId: string,
  updates: {
    status?: string;
    patient_name?: string | null;
    patient_id?: string | null;
  }
) => {
  const { data, error } = await supabase
    .from("beds")
    .update(updates)
    .eq("id", bedId);

  return { data, error };
};

/**
 * Update bed status (aggregate counts)
 */
export const updateBedStatus = async (
  id: string,
  statusOrData:
    | string
    | {
        total_beds: number;
        available_beds: number;
        occupied_beds: number;
      }
) => {
  if (typeof statusOrData === "string") {
    const { data, error } = await supabase
      .from("bed_status")
      .update({ status: statusOrData })
      .eq("id", id);

    return { data, error };
  }

  // aggregate update
  const { data, error } = await supabase
    .from("bed_status")
    .update({
      total_beds: statusOrData.total_beds,
      available_beds: statusOrData.available_beds,
      occupied_beds: statusOrData.occupied_beds,
    })
    .eq("id", id);

  return { data, error };
};
