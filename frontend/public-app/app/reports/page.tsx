"use client";
import { useState, useEffect } from 'react';
import { Activity, Heart, Moon, Flame, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import supabase from '@/app/lib/api/supabase';
import type { UserHealthRecord } from '@/app/types/database';

export default function AnalyticsPage() {
  const [activeRange, setActiveRange] = useState('Week');
  const [healthRecord, setHealthRecord] = useState<UserHealthRecord | null>(null);

  const ranges = ['Day', 'Week', 'Month', 'Year'];

  useEffect(() => {
    async function loadHealthData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const res = await fetch(`/api/user/profile?userId=${user.id}`);
          if (res.ok) {
            const profile = await res.json();
            if (profile.user_health_records?.length > 0) {
              setHealthRecord(profile.user_health_records[0]);
            }
          }
        }
      } catch (err) {
        console.error('Error loading health data:', err);
      }
    }
    loadHealthData();
  }, []);

  const weeklyData = [
    { day: 'Mon', steps: 60, hr: 45, sleep: 80 },
    { day: 'Tue', steps: 85, hr: 55, sleep: 60 },
    { day: 'Wed', steps: 40, hr: 40, sleep: 90 },
    { day: 'Thu', steps: 95, hr: 60, sleep: 75 },
    { day: 'Fri', steps: 70, hr: 50, sleep: 65 },
    { day: 'Sat', steps: 100, hr: 70, sleep: 85 },
    { day: 'Sun', steps: 50, hr: 45, sleep: 95 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 sm:px-6 lg:px-8 font-sans pb-28 md:pb-12 overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-5 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 md:gap-6 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-teal-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
          
          <div className="relative z-10 w-full">
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-1.5 md:mb-2">My Analytics</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-snug">
              Track your biological performance and health trends over time.
            </p>
          </div>
          
          <div className="relative z-10 hidden sm:flex w-14 md:w-16 h-14 md:h-16 rounded-full bg-teal-50 items-center justify-center text-teal-600 border border-teal-100 shadow-sm shrink-0">
             <TrendingUp size={28} strokeWidth={2.5} />
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-full font-bold text-sm">
          {ranges.map(range => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`flex-1 py-2.5 rounded-xl transition-all duration-300 ${activeRange === range ? 'bg-teal-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Highlight Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <StatCard title="Total Steps" value="45,231" unit="steps" icon={Activity} color="bg-blue-500" lightColor="bg-blue-50" textColor="text-blue-500" trend="+12%" />
          <StatCard title="Avg Heart Rate" value="72" unit="bpm" icon={Heart} color="bg-rose-500" lightColor="bg-rose-50" textColor="text-rose-500" trend="-2%" />
          <StatCard title="BMI" value={healthRecord?.bmi?.toFixed(1) ?? '22.5'} unit="kg/m²" icon={Moon} color="bg-indigo-500" lightColor="bg-indigo-50" textColor="text-indigo-500" trend="" />
          <StatCard title="Blood Type" value={healthRecord?.blood_type ?? 'N/A'} unit="" icon={Flame} color="bg-orange-500" lightColor="bg-orange-50" textColor="text-orange-500" trend="" />
        </div>

        {/* Main Chart Section */}
        <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-black text-slate-800">Activity Overview ({activeRange})</h3>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Steps
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-200 ml-2"></span> Sleep
            </div>
          </div>
          
          {/* Faux Chart Area */}
          <div className="h-48 md:h-64 flex items-end justify-between gap-1.5 sm:gap-4 pt-4 border-b border-slate-100 relative">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              <div className="w-full h-px bg-slate-50"></div>
              <div className="w-full h-px bg-slate-50"></div>
              <div className="w-full h-px bg-slate-50"></div>
              <div className="w-full h-px bg-slate-50"></div>
            </div>

            {weeklyData.map((data, idx) => (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center gap-1 h-full z-10 relative group pb-1">
                <div className="w-full flex justify-center items-end gap-1 px-1 h-full">
                  <div 
                    className="w-1/2 bg-blue-500 rounded-t-sm md:rounded-t-md transition-all duration-700 ease-out group-hover:bg-blue-400 max-w-3 md:max-w-5" 
                    style={{ height: `${data.steps}%` }}
                  ></div>
                  <div 
                    className="w-1/2 bg-indigo-200 rounded-t-sm md:rounded-t-md transition-all duration-700 ease-out group-hover:bg-indigo-300 max-w-3 md:max-w-5" 
                    style={{ height: `${data.sleep}%` }}
                  ></div>
                </div>
                {/* Tooltip on Hover */}
                <div className="absolute -top-10 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                   {data.day}: {data.steps*100} steps
                </div>
                <span className="text-[10px] md:text-xs font-bold text-slate-400 mt-2">{data.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Logs List */}
        <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 mb-10">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-black text-slate-800">Recent Logs</h3>
             <button className="text-teal-600 text-sm font-bold hover:underline">View All</button>
           </div>
           <div className="space-y-3">
             <LogItem icon={Heart} title="Blood Pressure Logged" value="120/80 mmHg" time="2h ago" color="bg-rose-50" iconColor="text-rose-500" />
             <LogItem icon={Activity} title="Morning Run Completed" value="4.2 km" time="6h ago" color="bg-blue-50" iconColor="text-blue-500" />
             <LogItem icon={Moon} title="Sleep Data Synced" value="7h 15m" time="9h ago" color="bg-indigo-50" iconColor="text-indigo-500" />
           </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, unit, icon: Icon, color, lightColor, textColor, trend }: any) {
  const isPositive = trend?.startsWith('+');
  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group overflow-hidden relative">
      <div className={`absolute -right-4 -top-4 w-16 h-16 rounded-full ${lightColor} blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className={`p-2 sm:p-2.5 rounded-xl ${lightColor} ${textColor}`}>
          <Icon size={18} className="sm:w-5 sm:h-5" />
        </div>
        {trend && (
          <div className={`text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <h4 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight leading-none">{value}</h4>
          <span className="text-xs font-bold text-slate-500">{unit}</span>
        </div>
      </div>
    </div>
  );
}

function LogItem({ icon: Icon, title, value, time, color, iconColor }: any) {
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer group">
      <div className="flex items-center gap-3 md:gap-4">
        <div className={`p-2.5 md:p-3 rounded-xl ${color} ${iconColor}`}>
          <Icon size={20} />
        </div>
        <div>
          <h4 className="text-sm md:text-base font-bold text-slate-800">{title}</h4>
          <p className="text-[11px] md:text-xs font-bold text-slate-500 mt-0.5">{time}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-black text-slate-700">{value}</span>
        <ChevronRight size={16} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </div>
  );
}
