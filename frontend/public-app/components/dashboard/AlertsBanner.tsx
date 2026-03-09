"use client";
import { useState, useEffect } from 'react';
import supabase from '@/app/lib/api/supabase';
import type { Notification as DBNotification } from '@/app/types/database';

export default function AlertsBanner() {
  const [alert, setAlert] = useState('🚨 Fever cases reported in nearby areas');

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch(`/api/notifications?userId=${user.id}`);
          if (res.ok) {
            const notifications: DBNotification[] = await res.json();
            const unread = notifications.find(n => !n.is_read);
            if (unread?.title) setAlert(`🚨 ${unread.title}`);
          }
        }
      } catch (err) {
        console.error('Error loading alert:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-red-100 text-red-800 p-3 rounded">
      {alert}
    </div>
  );
}
