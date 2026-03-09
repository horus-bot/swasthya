import { supabase } from './supabase';

/**
 * Get the currently logged-in user's profile
 */
export const getMyProfile = async () => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: authError || new Error('No user logged in') };
  }

  return supabase
    .from('profile')
    .select('*')
    .eq('user_uuid', user.id)   // ✅ FIXED
    .single();
};

/**
 * Update the logged-in user's profile
 * Used AFTER signup
 */
export const updateMyProfile = async (profile: {
  full_name: string;
  department: string;
  role: string;
  phone?: string;
}) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { data: null, error: authError || new Error('No user logged in') };
  }

  return supabase
    .from('profile')
    .update({
      full_name: profile.full_name,
      department: profile.department,
      role: profile.role,
      phone: profile.phone,
    })
    .eq('user_uuid', user.id);   // ✅ FIXED
};
