"use client";
import { useState, useEffect } from 'react';
import supabase from '@/app/lib/api/supabase';

export default function MedicalHistory() {
  const [history, setHistory] = useState<string[]>(['Fever – Jan 2025', 'Routine Checkup – Nov 2024']);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch(`/api/user/profile?userId=${user.id}`);
          if (res.ok) {
            const profile = await res.json();
            const rec = profile.user_health_records?.[0];
            if (rec?.medical_history) {
              const items = rec.medical_history.split(',').map((s: string) => s.trim()).filter(Boolean);
              if (items.length > 0) setHistory(items);
            }
          }
        }
      } catch (err) {
        console.error('Error loading medical history:', err);
      }
    }
    load();
  }, []);

  return (
    <ul className="list-disc ml-5 text-sm">
      {history.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}
