"use client";
import { useState, useEffect } from 'react';
import supabase from '@/app/lib/api/supabase';

export default function HealthTrackerCard() {
  const [info, setInfo] = useState('Last checkup: Normal | Next follow-up in 7 days');

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch(`/api/user/profile?userId=${user.id}`);
          if (res.ok) {
            const profile = await res.json();
            const rec = profile.user_health_records?.[0];
            if (rec) {
              const parts = [];
              if (rec.blood_type) parts.push(`Blood: ${rec.blood_type}`);
              if (rec.bmi) parts.push(`BMI: ${rec.bmi}`);
              if (rec.updated_at) {
                const d = new Date(rec.updated_at);
                parts.push(`Last updated: ${d.toLocaleDateString()}`);
              }
              if (parts.length > 0) setInfo(parts.join(' | '));
            }
          }
        }
      } catch (err) {
        console.error('Error loading tracker data:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow text-sm">
      {info}
    </div>
  );
}
