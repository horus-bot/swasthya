"use client";

import React, { useEffect, useState } from "react";
import { Bell, Settings, Calendar, User, CheckCircle } from "lucide-react";
import { supabase } from "../../lib/api/supabase";

type NotificationItem = {
  id: number | string;
  type?: string;
  title: string;
  message?: string;
  time?: string;
  read?: boolean;
  category?: string;
};

export default function SystemNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "Maintenance": return "bg-purple-100 text-purple-700";
      case "Appointments": return "bg-blue-100 text-blue-700";
      case "Staff": return "bg-emerald-100 text-emerald-700";
      case "Equipment": return "bg-orange-100 text-orange-700";
      case "Reports": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "System": return <Settings size={16} className="text-purple-600" />;
      case "Appointment": return <Calendar size={16} className="text-blue-600" />;
      case "Staff": return <User size={16} className="text-emerald-600" />;
      case "Equipment": return <Settings size={16} className="text-orange-600" />;
      case "Report": return <CheckCircle size={16} className="text-gray-600" />;
      default: return <Bell size={16} className="text-gray-600" />;
    }
  };

  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("system_notifications")
          .select("id, type, title, message, category, read, created_at")
          .order("created_at", { ascending: false })
          .limit(30);

        if (error) {
          console.error("Failed to fetch system notifications:", error);
          if (mounted) setError(error.message ?? "Failed to load notifications");
          return;
        }

        if (!data) {
          if (mounted) setNotifications([]);
          return;
        }

        const mapped = data.map((row: any) => ({
          id: row.id,
          type: row.type,
          title: row.title || row.message || "Notification",
          message: row.message || "",
          time: row.created_at ? new Date(row.created_at).toLocaleString() : undefined,
          read: !!row.read,
          category: row.category || undefined,
        } as NotificationItem));

        if (mounted) setNotifications(mapped);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load notifications");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchNotifications();
    return () => { mounted = false; };
  }, []);

  const markAllRead = async () => {
    // optimistic UI
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await supabase.from('system_notifications').update({ read: true }).neq('read', true);
    } catch (e) {
      console.error('Failed to mark all read', e);
    }
  };

  const markRead = async (id: number | string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try { await supabase.from('system_notifications').update({ read: true }).eq('id', id); } catch (e) { console.error(e); }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-900 flex items-center gap-3">
          <Bell className="text-blue-600" size={22} />
          System Notifications
        </h3>
        <div className="flex items-center gap-3">
          <button onClick={markAllRead} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Mark all read</button>
        </div>
      </div>

      {loading && (
        <div className="py-6 text-center text-sm text-gray-500">Loading notifications...</div>
      )}

      {error && (
        <div className="py-4 text-center text-sm text-red-600">{error}</div>
      )}

      <div className="space-y-3">
        {notifications.length === 0 && !loading && !error && (
          <div className="py-8 text-center text-sm text-gray-500">No system notifications</div>
        )}

        {notifications.map((notification) => (
          <div key={notification.id} className={`p-4 border rounded-lg transition-shadow flex items-start gap-4 ${notification.read ? 'bg-white border-slate-100' : 'bg-blue-50 border-blue-200 shadow-sm'}`}>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/60 flex items-center justify-center border border-slate-100">
              {getTypeIcon(notification.type)}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate">
                  <div className="text-sm font-medium text-slate-900 truncate">{notification.title}</div>
                  <div className="text-xs text-gray-500 truncate mt-1">{notification.message}</div>
                </div>
                <div className="text-xs text-gray-400">{notification.time}</div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(notification.category)}`}>{notification.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  {!notification.read && (
                    <button onClick={() => markRead(notification.id)} className="text-xs text-blue-600 hover:text-blue-800">Mark read</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 text-center">
        <button className="text-sm text-gray-600 hover:text-gray-800">View all notifications</button>
      </div>
    </div>
  );
}