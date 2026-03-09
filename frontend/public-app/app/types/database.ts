// Types derived from the Supabase database schema

export interface UserDetails {
  id: string;
  name: string;
  age: number | null;
  gender: string | null;
  phone: string | null;
  email: string | null;
  created_at: string | null;
}

export interface UserHealthRecord {
  id: string;
  user_id: string | null;
  blood_type: string | null;
  allergies: string | null;
  bmi: number | null;
  disabilities: string | null;
  medical_history: string | null;
  updated_at: string | null;
}

export interface HospitalDetails {
  id: string;
  user_id: string | null;
  hospital_name: string;
  address: string | null;
  phone: string | null;
  created_at: string | null;
}

export interface HospitalDoctors {
  id: string;
  hospital_id: string | null;
  total_doctors: number | null;
  available_doctors: number | null;
  updated_at: string | null;
}

export interface BedType {
  id: string;
  type_name: string;
}

export interface EquipmentType {
  id: string;
  equipment_name: string;
}

export interface HospitalEquipmentInventory {
  id: string;
  hospital_id: string | null;
  equipment_type_id: string | null;
  total_quantity: number | null;
  available_quantity: number | null;
  updated_at: string | null;
  equipment_type?: EquipmentType;
}

export interface NotificationType {
  id: string;
  type_name: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  notification_type_id: string | null;
  title: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string | null;
  notification_type?: NotificationType;
}

// Joined/enriched types for frontend use
export interface HospitalWithDetails extends HospitalDetails {
  hospital_doctors: HospitalDoctors[];
  hospital_equipment_inventory: (HospitalEquipmentInventory & {
    equipment_types: EquipmentType | null;
  })[];
}

export interface UserProfile extends UserDetails {
  user_health_records: UserHealthRecord[];
}
