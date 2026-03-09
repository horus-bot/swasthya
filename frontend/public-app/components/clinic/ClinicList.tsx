"use client";
import { useState, useEffect } from 'react';
import ClinicCard from "./ClinicCard";
import type { HospitalWithDetails } from '@/app/types/database';

export default function ClinicList() {
  const [clinics, setClinics] = useState<{ name: string; waitingTime: string }[]>([
    { name: "City Health Center", waitingTime: "15 mins" },
    { name: "Community Clinic", waitingTime: "10 mins" },
  ]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/hospitals');
        if (res.ok) {
          const data: HospitalWithDetails[] = await res.json();
          if (data.length > 0) {
            setClinics(data.map(h => ({
              name: h.hospital_name,
              waitingTime: `${Math.floor(Math.random() * 20 + 5)} mins`,
            })));
          }
        }
      } catch (err) {
        console.error('Error loading clinics:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-3">
      {clinics.map((clinic, i) => (
        <ClinicCard key={i} name={clinic.name} waitingTime={clinic.waitingTime} />
      ))}
    </div>
  );
}
