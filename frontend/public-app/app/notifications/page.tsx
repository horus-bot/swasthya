"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./page.css";

const reminders = [
  { title: "Take BP Medicine", time: "8:00 AM", type: "Daily" },
  { title: "Blood Sugar Test", time: "7:30 AM", type: "Daily" },
  { title: "Doctor Follow-up", time: "15 Feb 2026", type: "Appointment" },
  { title: "Vaccination Reminder", time: "20 Mar 2026", type: "One-time" },
];

export default function NotificationPage() {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [done, setDone] = useState<number[]>([]);

  useEffect(() => {
    gsap.from(cardsRef.current, {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
      ease: "power3.out",
    });
  }, []);

  const markDone = (index: number) => {
    setDone([...done, index]);
    gsap.to(cardsRef.current[index], {
      opacity: 0.4,
      scale: 0.97,
      duration: 0.3,
    });
  };

  return (
    <div className="notifications-page-wrapper pb-28 md:pb-12">
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Health Reminders</h1>

      <div className="space-y-4">
        {reminders.map((item, i) => (
          <div
            key={i}
            ref={(el) => { if (el) cardsRef.current[i] = el; }}
            className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
          >
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-500">
                {item.type} • {item.time}
              </p>
            </div>

            <button
              disabled={done.includes(i)}
              onClick={() => markDone(i)}
              className={`px-3 py-1 text-sm rounded-lg ${
                done.includes(i)
                  ? "bg-gray-300 text-gray-600"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {done.includes(i) ? "Done" : "Mark Done"}
            </button>
          </div>
        ))}
      </div>
      </main>
    </div>
  );
}
