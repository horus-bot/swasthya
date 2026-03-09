"use client";
import { useState, useEffect } from 'react';
import type { HospitalWithDetails } from '@/app/types/database';

export default function WaitingTimeCard() {
  const [waitTime, setWaitTime] = useState('15 mins');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/hospitals');
        if (res.ok) {
          const data: HospitalWithDetails[] = await res.json();
          if (data.length > 0) {
            const avail = data[0].hospital_doctors?.[0]?.available_doctors ?? 0;
            const estimated = avail > 0 ? Math.max(5, Math.floor(30 / avail) * 5) : 30;
            setWaitTime(`${estimated} mins`);
          }
        }
      } catch (err) {
        console.error('Error loading waiting time:', err);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-yellow-100 p-3 rounded text-sm">
      Estimated Waiting Time: {waitTime}
    </div>
  );
}
