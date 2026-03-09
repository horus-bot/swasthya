import { supabase } from "./supabase";

export const getEquipmentByHospital = async (hospitalId: string) => {
  const { data, error } = await supabase
    .from("equipment")
    .select("*")
    .eq("hospital_id", hospitalId);

  if (error) throw error;
  return data;
};

export const updateEquipmentStatus = async (
  equipmentId: string,
  status: string
) => {
  const { error } = await supabase
    .from("equipment")
    .update({ status })
    .eq("id", equipmentId);

  if (error) throw error;
};
