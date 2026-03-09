"use client";

import { Check, X } from "lucide-react";

type Appointment = {
  id: string;
  patient_name: string;
  condition_type: string;
  appointment_time?: string;
  status?: "pending" | "scheduled" | "completed" | "cancelled";
  doctor?: { name: string; specialization: string };
  created_at?: string;
};

type AppointmentCardProps = {
  appt: Appointment;
  onUpdate?: (id: string, status: NonNullable<Appointment["status"]>) => void;
};

export function AppointmentCard({ appt, onUpdate }: AppointmentCardProps) {
  if (!appt) return null;
  const rawDate = appt.appointment_time ?? appt.created_at ?? null;
  const dateObj = rawDate ? new Date(rawDate) : null;
  const time = dateObj && !isNaN(dateObj.getTime())
    ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-xl hover:border-[#3b82f6] transition-all duration-300 group hover:-translate-y-1">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#1e3a8a] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      
      {/* Content */}
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <p className="text-lg font-bold text-slate-900 group-hover:text-[#1e3a8a] transition-colors duration-200">{appt.patient_name}</p>
          <p className="text-sm text-gray-600 mt-1">📋 {appt.condition_type} • ⏰ {time}</p>
          {appt.status && (
            <span
              className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                appt.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : appt.status === "scheduled"
                  ? "bg-green-100 text-green-800"
                  : appt.status === "completed"
                  ? "bg-[#dbeafe] text-[#1e3a8a]"
                  : appt.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {appt.status === "pending" ? (
            <>
              <button
                onClick={() => onUpdate?.(appt.id, "scheduled")}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-sm font-semibold border border-emerald-200 hover:from-emerald-100 hover:to-green-100 hover:shadow-md hover:scale-105 transition-all duration-200 transform"
              >
                <Check size={16} />
                Approve
              </button>

              <button
                onClick={() => onUpdate?.(appt.id, "cancelled")}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 text-red-700 text-sm font-semibold border border-red-200 hover:from-red-100 hover:to-rose-100 hover:shadow-md hover:scale-105 transition-all duration-200 transform"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : appt.status === "scheduled" ? (
            <>
              <button
                onClick={() => onUpdate?.(appt.id, "scheduled")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-50 to-sky-100 text-sky-700 text-sm font-semibold border border-sky-200 hover:from-sky-100 hover:to-sky-200 hover:shadow-md hover:scale-105 transition-all duration-200 transform"
              >
                <Check size={16} />
                Schedule
              </button>

              <button
                onClick={() => onUpdate?.(appt.id, "completed")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 text-sm font-semibold border border-emerald-200 hover:from-emerald-100 hover:to-green-100 hover:shadow-md hover:scale-105 transition-all duration-200 transform"
              >
                <Check size={16} />
                Complete
              </button>

              <button
                onClick={() => onUpdate?.(appt.id, "cancelled")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-red-50 to-rose-50 text-red-700 text-sm font-semibold border border-red-200 hover:from-red-100 hover:to-rose-100 hover:shadow-md hover:scale-105 transition-all duration-200 transform"
              >
                <X size={16} />
                Cancel
              </button>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
