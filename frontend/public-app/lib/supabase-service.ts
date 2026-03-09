import supabase from "@/app/lib/api/supabase";
import type {
  UserProfile,
  UserDetails,
  UserHealthRecord,
  HospitalWithDetails,
  Notification,
  NotificationType,
} from "@/app/types/database";

// ─── User Details ─────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("user_details")
    .select("*, user_health_records(*)")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error.message);
    return null;
  }
  return data as UserProfile;
}

export async function updateUserDetails(
  userId: string,
  updates: Partial<Omit<UserDetails, "id" | "created_at">>
) {
  const { data, error } = await supabase
    .from("user_details")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as UserDetails;
}

// ─── User Health Records ──────────────────────────────────

export async function getUserHealthRecord(userId: string): Promise<UserHealthRecord | null> {
  const { data, error } = await supabase
    .from("user_health_records")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching health record:", error.message);
    return null;
  }
  return data as UserHealthRecord | null;
}

export async function upsertHealthRecord(
  userId: string,
  record: Partial<Omit<UserHealthRecord, "id" | "user_id" | "updated_at">>
) {
  // Check if a record already exists
  const existing = await getUserHealthRecord(userId);

  if (existing) {
    const { data, error } = await supabase
      .from("user_health_records")
      .update({ ...record, updated_at: new Date().toISOString() })
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as UserHealthRecord;
  } else {
    const { data, error } = await supabase
      .from("user_health_records")
      .insert({ user_id: userId, ...record })
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as UserHealthRecord;
  }
}

// ─── Hospitals ────────────────────────────────────────────

export async function getHospitals(): Promise<HospitalWithDetails[]> {
  const { data, error } = await supabase
    .from("hospital_details")
    .select(`
      *,
      hospital_doctors(*),
      hospital_equipment_inventory(*, equipment_types:equipment_type_id(*))
    `)
    .order("hospital_name");

  if (error) {
    console.error("Error fetching hospitals:", error.message);
    return [];
  }
  return (data ?? []) as HospitalWithDetails[];
}

export async function getHospitalById(id: string): Promise<HospitalWithDetails | null> {
  const { data, error } = await supabase
    .from("hospital_details")
    .select(`
      *,
      hospital_doctors(*),
      hospital_equipment_inventory(*, equipment_types:equipment_type_id(*))
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching hospital:", error.message);
    return null;
  }
  return data as HospitalWithDetails;
}

// ─── Notifications ────────────────────────────────────────

export async function getNotifications(userId: string): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*, notification_type:notification_type_id(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching notifications:", error.message);
    return [];
  }
  return (data ?? []) as Notification[];
}

export async function markNotificationRead(notificationId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) throw new Error(error.message);
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) throw new Error(error.message);
}

// ─── Notification Types ───────────────────────────────────

export async function getNotificationTypes(): Promise<NotificationType[]> {
  const { data, error } = await supabase
    .from("notification_types")
    .select("*");

  if (error) {
    console.error("Error fetching notification types:", error.message);
    return [];
  }
  return (data ?? []) as NotificationType[];
}

// ─── Equipment & Bed Types ────────────────────────────────

export async function getEquipmentTypes() {
  const { data, error } = await supabase
    .from("equipment_types")
    .select("*");

  if (error) {
    console.error("Error fetching equipment types:", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBedTypes() {
  const { data, error } = await supabase
    .from("bed_types")
    .select("*");

  if (error) {
    console.error("Error fetching bed types:", error.message);
    return [];
  }
  return data ?? [];
}
