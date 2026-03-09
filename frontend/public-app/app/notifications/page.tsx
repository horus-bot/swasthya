"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./page.css";
import type { Notification } from "@/app/types/database";

export default function NotificationPage() {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const { default: supabase } = await import("@/app/lib/api/supabase");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const res = await fetch(`/api/notifications?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setNotifications(data);
          }
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    loadNotifications();
  }, []);

  useEffect(() => {
    gsap.from(cardsRef.current.filter(Boolean), {
      opacity: 0,
      y: 30,
      stagger: 0.15,
      duration: 0.6,
      ease: "power3.out",
    });
  }, [notifications]);

  const markDone = async (id: string, index: number) => {
    setDone([...done, id]);
    gsap.to(cardsRef.current[index], {
      opacity: 0.4,
      scale: 0.97,
      duration: 0.3,
    });

    // Mark as read in DB
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
    } catch (err) {
      console.error("Failed to mark notification read:", err);
    }
  };

  return (
    <div className="notifications-page-wrapper pb-28 md:pb-12">
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Health Reminders</h1>

      <div className="space-y-4">
        {notifications.map((item, i) => (
          <div
            key={item.id}
            ref={(el) => { if (el) cardsRef.current[i] = el; }}
            className="bg-white rounded-xl shadow p-5 flex items-center justify-between"
          >
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="text-sm text-gray-500">
                {item.notification_type?.type_name ?? "Notification"} &bull; {item.message ?? new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>

            <button
              disabled={done.includes(item.id) || item.is_read}
              onClick={() => markDone(item.id, i)}
              className={`px-3 py-1 text-sm rounded-lg ${
                done.includes(item.id) || item.is_read
                  ? "bg-gray-300 text-gray-600"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {done.includes(item.id) || item.is_read ? "Done" : "Mark Done"}
            </button>
          </div>
        ))}
      </div>
      </main>
    </div>
  );
}
