import { supabase } from './supabase';

export const getNotifications = async () => {
  return supabase
    .from('notification')
    .select('*')
    .order('created_at', { ascending: false });
};

export const markNotificationAsRead = async (id: string) => {
  return supabase.from('notification').update({ is_read: true }).eq('id', id);
};

export const createNotification = async (notification: {
  type: string;
  message: string;
}) => {
  return supabase.from('notification').insert(notification);
};