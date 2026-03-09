"use client";
import { useState, useEffect } from 'react';
import supabase from '@/app/lib/api/supabase';
import type { Notification as DBNotification } from '@/app/types/database';

export default function AppointmentCard() {
  const [text, setText] = useState('Appointment confirmed for 10:30 AM');

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch(`/api/notifications?userId=${user.id}`);
          if (res.ok) {
            const notifications: DBNotification[] = await res.json();
            const appt = notifications.find(n => 
              n.notification_type?.type_name?.toLowerCase() === 'appointment' && !n.is_read
            );
            if (appt?.message) setText(appt.message);
          }
        }
      } catch (err) {
        console.error('Error loading appointment:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow text-sm">
      {text}
    </div>
  );
}
