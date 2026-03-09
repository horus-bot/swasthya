"use client";
import { useState, useEffect } from 'react';
import supabase from '@/app/lib/api/supabase';
import type { UserHealthRecord } from '@/app/types/database';

export default function HealthProfileCard() {
  const [record, setRecord] = useState<UserHealthRecord | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch(`/api/user/profile?userId=${user.id}`);
          if (res.ok) {
            const profile = await res.json();
            if (profile.user_health_records?.length > 0) {
              setRecord(profile.user_health_records[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error loading health profile:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-medium">User Health Profile</h3>
      <p className="text-sm text-gray-600">Blood Group: {record?.blood_type ?? 'O+'}</p>
      {record?.bmi && <p className="text-sm text-gray-600">BMI: {record.bmi}</p>}
      {record?.allergies && <p className="text-sm text-gray-600">Allergies: {record.allergies}</p>}
    </div>
  );
}
