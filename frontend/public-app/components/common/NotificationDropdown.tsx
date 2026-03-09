"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Info, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NotificationDropdown({ triggerClass, dotBorderColor = "border-white" }: { triggerClass?: string, dotBorderColor?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead && !n.is_read).length;

  // Load notifications from Supabase
  useEffect(() => {
    async function loadNotifications() {
      try {
        const { default: supabase } = await import("@/app/lib/api/supabase");
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        setUserId(user.id);

        const res = await fetch(`/api/notifications?userId=${user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setNotifications(
              data.map((n: any) => ({
                id: n.id,
                type: n.notification_type?.type_name?.toLowerCase() ?? "info",
                title: n.title ?? "Notification",
                message: n.message ?? "",
                time: n.created_at ? timeAgo(n.created_at) : "",
                isRead: n.is_read,
              }))
            );
          }
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    }
    loadNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = async () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    if (userId) {
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ markAll: true, userId }),
        });
      } catch (err) {
        console.error("Failed to mark all read:", err);
      }
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "alert": return <AlertTriangle size={16} className="text-amber-500" />;
      case "info": return <FileText size={16} className="text-blue-500" />;
      case "success": return <CheckCircle2 size={16} className="text-emerald-500" />;
      default: return <Info size={16} className="text-slate-500" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClass || "relative p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-700 transition-all active:scale-95 shadow-sm"}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className={`absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 shadow-sm ${dotBorderColor}`}></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-[120%] right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 duration-200 origin-top-right text-left">
          <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm">
            <h3 className="font-bold text-slate-800 text-sm tracking-wide">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
            ) : (
              <div className="flex flex-col">
                {notifications.map((notif) => (
                  <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50/80 transition-colors flex gap-4 ${notif.isRead ? 'opacity-75' : 'bg-teal-50/20'}`}>
                    <div className={`mt-0.5 h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 ${notif.isRead ? 'bg-slate-100' : 'bg-white shadow-sm border border-slate-100'}`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm tracking-tight ${notif.isRead ? 'font-medium text-slate-700' : 'font-bold text-slate-900'}`}>{notif.title}</h4>
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">{notif.time}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">{notif.message}</p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-teal-500 rounded-full mt-2.5 flex-shrink-0 shadow-sm shadow-teal-500/30"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link href="/notification" onClick={() => setIsOpen(false)} className="text-[11px] font-[900] text-slate-500 hover:text-teal-600 transition-colors uppercase tracking-widest inline-flex items-center gap-1 active:scale-95">
              View All History
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
