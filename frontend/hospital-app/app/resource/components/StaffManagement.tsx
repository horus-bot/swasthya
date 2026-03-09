"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, Briefcase } from "lucide-react";
import { getStaffSchedule, getStaffStats } from "../../lib/api/doctor.service";
import { supabase } from "@/app/lib/api/supabase";

export default function StaffManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [stats, setStats] = useState({
    onDuty: 0,
    scheduled: 0,
    onBreak: 0,
    total: 0,
  });
  const [counts, setCounts] = useState({
    onDuty: 0,
    scheduled: 0,
    onBreak: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const getStatusColor = (status: string) => {
    const s = (status || "").toString().toLowerCase();
    if (s.includes("on_duty") || s.includes("on duty")) return "bg-green-100 text-green-700 border-green-200";
    if (s.includes("scheduled")) return "bg-blue-100 text-blue-700 border-blue-200";
    if (s.includes("on_break") || s.includes("on break")) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getShiftColor = (shift: string) => {
    const s = (shift || "").toString().toLowerCase();
    if (s.includes("morning")) return "bg-orange-100 text-orange-700";
    if (s.includes("afternoon")) return "bg-purple-100 text-purple-700";
    if (s.includes("night")) return "bg-indigo-100 text-indigo-700";
    return "bg-gray-100 text-gray-700";
  };

  const normalizeStatusLabel = (raw: any) => {
    if (!raw) return "Unknown";
    return String(raw).replace(/_/g, " ");
  };

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      try {
        const hospitalId = typeof window !== "undefined" ? localStorage.getItem("hospital_id") || "" : "";
        if (!hospitalId) {
          setStaff([]);
          setStats({ onDuty: 0, scheduled: 0, onBreak: 0, total: 0 });
          setCounts({ onDuty: 0, scheduled: 0, onBreak: 0, total: 0 });
          return;
        }

        const settled = await Promise.allSettled([
          getStaffSchedule(hospitalId),
          getStaffStats(hospitalId),
        ]);

        const schedRes = settled[0];
        const statRes = settled[1];

        const sched = schedRes.status === "fulfilled" && Array.isArray(schedRes.value) ? schedRes.value : [];
        const stat = statRes.status === "fulfilled" && statRes.value ? statRes.value : { onDuty: 0, scheduled: 0, onBreak: 0, total: 0 };

        if (!mounted) return;

        setStaff(sched);
        setStats(stat);

        // Fetch the counts row (separate query) with its own error handling
        try {
          const staffCounts = await getStaff(hospitalId);
          const rows = Array.isArray(staffCounts) ? staffCounts : [];

          if (rows.length > 0) {
            const row = rows[0];
            const onDuty = typeof row.on_duty === "number" ? row.on_duty : Number(row.on_duty) || 0;
            const scheduled = typeof row.schedule === "number" ? row.schedule : Number(row.schedule) || 0;
            const onBreak = typeof row.on_break === "number" ? row.on_break : Number(row.on_break) || 0;
            const total = typeof row.total_staff === "number" ? row.total_staff : Number(row.total_staff) || (stat?.total ?? 0);

            if (mounted) setCounts({ onDuty, scheduled, onBreak, total });
          } else {
            // fallback to stats-derived counts if no aggregate row found
            if (mounted) setCounts({
              onDuty: stat.onDuty ?? 0,
              scheduled: stat.scheduled ?? 0,
              onBreak: stat.onBreak ?? 0,
              total: stat.total ?? 0,
            });
          }
        } catch (err) {
          if (mounted) setCounts({
            onDuty: stat.onDuty ?? 0,
            scheduled: stat.scheduled ?? 0,
            onBreak: stat.onBreak ?? 0,
            total: stat.total ?? 0,
          });
        }
      } catch (err: any) {
        const errDetails = err && (err.message || Object.getOwnPropertyNames(err).length ? JSON.stringify(err, Object.getOwnPropertyNames(err)) : String(err));
        console.error("Failed to load staff:", errDetails);
        if (mounted) {
          setStaff([]);
          setStats({ onDuty: 0, scheduled: 0, onBreak: 0, total: 0 });
          setCounts({ onDuty: 0, scheduled: 0, onBreak: 0, total: 0 });
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Filter out entries without any identifying fields to avoid "Unknown" placeholders
  const displayedStaff = (staff || []).filter(
    (s) => Boolean(s?.name) || Boolean(s?.profile_id) || Boolean(s?.display_name)
  );

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <Users className="text-blue-600" size={24} />
          Staff Schedule
        </h3>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          Full Schedule →
        </button>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="text-sm text-gray-500">Loading staff...</div>
        ) : displayedStaff.length === 0 ? (
          <div className="text-sm text-gray-500">No staff schedule available.</div>
        ) : (
          displayedStaff.map((staffMember: any, index: number) => {
            const name = staffMember.name || staffMember.profile_id || staffMember.display_name || "Unknown";
            const role = staffMember.role || staffMember.dept_role || staffMember.specialization || "Staff";
            const shift = staffMember.shift || staffMember.shift_time || staffMember.available_shift || "N/A";
            const rawStatus = staffMember.availability_status || staffMember.status || staffMember.state || "";
            const statusLabel = normalizeStatusLabel(rawStatus);
            const department = staffMember.department || staffMember.dept || "";

            return (
              <div key={staffMember.id ?? index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-full flex items-center justify-center">
                    <UserCheck size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase size={12} />
                      <span>{role}{department ? ` • ${department}` : ""}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getShiftColor(shift)}`}>
                    {shift}
                  </span>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(statusLabel)}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-4 text-center">
          <div>
            <p className="text-green-600 font-semibold">{counts.onDuty}</p>
            <p className="text-xs">On Duty Now</p>
          </div>
          <div>
            <p className="text-blue-600 font-semibold">{counts.scheduled}</p>
            <p className="text-xs">Scheduled</p>
          </div>
          <div>
            <p className="text-yellow-600 font-semibold">{counts.onBreak}</p>
            <p className="text-xs">On Break</p>
          </div>
          <div>
            <p className="font-semibold">{counts.total}</p>
            <p className="text-xs">Total Staff</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaff(hospitalId: string) {
  const { data, error } = await supabase
    .from('staff')
    .select('on_duty, schedule, on_break, total_staff')
    .eq('hospital_id', hospitalId);

  if (error) {
    console.error("getStaff supabase error:", error);
    try {
      console.error("getStaff error (serialized):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } catch (e) {
      console.error("Failed to stringify error:", e);
    }
    return [];
  }

  return data ?? [];
}