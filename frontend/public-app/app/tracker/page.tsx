"use client";
import { useState, useEffect } from 'react';
import { AlertTriangle, Info, ShieldAlert, ThermometerSun, Zap, BellRing, Clock } from 'lucide-react';
import supabase from '@/app/lib/api/supabase';
import type { Notification as DBNotification } from '@/app/types/database';

interface Alert {
  id: number;
  type: string;
  title: string;
  message: string;
  time: string;
  icon: any;
  color: string;
  lightColor: string;
  borderColor: string;
  textColor: string;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hours ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function mapDbToAlert(n: DBNotification, idx: number): Alert {
  const typeName = n.notification_type?.type_name?.toLowerCase() ?? 'system';
  const styleMap: Record<string, { icon: any; color: string; lightColor: string; borderColor: string; textColor: string; type: string }> = {
    emergency: { icon: ThermometerSun, color: "bg-rose-500", lightColor: "bg-rose-50", borderColor: "border-rose-200", textColor: "text-rose-700", type: "critical" },
    health: { icon: ShieldAlert, color: "bg-amber-500", lightColor: "bg-amber-50", borderColor: "border-amber-200", textColor: "text-amber-700", type: "warning" },
    appointment: { icon: Info, color: "bg-blue-500", lightColor: "bg-blue-50", borderColor: "border-blue-200", textColor: "text-blue-700", type: "info" },
    system: { icon: Zap, color: "bg-slate-500", lightColor: "bg-slate-50", borderColor: "border-slate-200", textColor: "text-slate-700", type: "info" },
  };
  const style = styleMap[typeName] ?? styleMap['system'];
  return {
    id: idx + 1,
    type: style.type,
    title: n.title ?? 'Alert',
    message: n.message ?? '',
    time: timeAgo(n.created_at),
    icon: style.icon,
    color: style.color,
    lightColor: style.lightColor,
    borderColor: style.borderColor,
    textColor: style.textColor,
  };
}

export default function AlertsPage() {
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch(`/api/notifications?userId=${user.id}`);
          if (res.ok) {
            const dbNotifications: DBNotification[] = await res.json();
            if (dbNotifications.length > 0) {
              setActiveAlerts(dbNotifications.map(mapDbToAlert));
              return;
            }
          }
        }
      } catch (err) {
        console.error('Error loading alerts:', err);
      }
    }
    loadAlerts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 sm:px-6 lg:px-8 font-sans pb-28 md:pb-12 overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-5 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-amber-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
          
          <div className="relative z-10 w-full">
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-1.5 md:mb-2 flex items-center gap-2">
              Alerts Hub
              <span className="flex h-3 w-3 relative ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-snug">
              Stay informed with real-time health warnings and locality updates.
            </p>
          </div>
          
          <div className="relative z-10 hidden sm:flex w-14 md:w-16 h-14 md:h-16 rounded-full bg-amber-50 items-center justify-center text-amber-600 border border-amber-100 shadow-sm shrink-0 animate-pulse">
             <BellRing size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Priority Status Box */}
        <div className="bg-rose-50 border border-rose-200 p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm flex items-start gap-4 animate-in slide-in-from-bottom-4 relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-32 h-32 bg-rose-500/10 blur-2xl rounded-full"></div>
           <div className="p-3 bg-white rounded-xl shadow-sm text-rose-500 shrink-0 border border-rose-100 relative z-10">
             <AlertTriangle size={24} strokeWidth={2.5} />
           </div>
           <div className="relative z-10">
             <h3 className="text-lg font-black text-rose-800 mb-1">1 Critical Area Warning</h3>
             <p className="text-sm font-medium text-rose-700/80 leading-relaxed">Please pay extreme attention to the heatwave advisory issued by local authorities. Hydration measures are strictly advised.</p>
           </div>
        </div>

        {/* Alerts Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-black text-slate-800">Recent Broadcasts</h2>
            <button className="text-sm font-bold text-teal-600 hover:text-teal-700 transition">Filter</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {activeAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border ${alert.borderColor} shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group`}
              >
                {/* Priority Glow Effect */}
                <div className={`absolute -right-20 -top-20 w-40 h-40 ${alert.lightColor} rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity`}></div>
                
                <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl ${alert.lightColor} flex items-center justify-center ${alert.color.replace('bg-', 'text-')} shrink-0 border ${alert.borderColor} shadow-inner`}>
                    <alert.icon size={22} strokeWidth={2.5} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-lg font-black ${alert.textColor} tracking-tight leading-tight`}>{alert.title}</h3>
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${alert.lightColor} ${alert.textColor} bg-opacity-50`}>
                          {alert.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full border border-slate-100">
                        <Clock size={12} />
                        {alert.time}
                      </div>
                    </div>
                    <p className="text-sn sm:text-base text-slate-600 font-medium leading-relaxed">
                      {alert.message}
                    </p>
                    
                    {alert.type === 'critical' && (
                      <button className="mt-4 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors active:scale-95 shadow-sm shadow-rose-500/20">
                        View Safety Instructions
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
