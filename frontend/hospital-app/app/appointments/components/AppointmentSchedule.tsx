"use client";

import { Calendar, Clock, Users, AlertTriangle } from "lucide-react";

export default function AppointmentSchedule() {
  const todayAppointments = [
    { time: "09:00", patient: "Rahul Kumar", type: "Checkup", duration: "30 min" },
    { time: "09:30", patient: "Priya Sharma", type: "Consultation", duration: "45 min" },
    { time: "10:15", patient: "Amit Singh", type: "Follow-up", duration: "20 min" },
    { time: "11:00", patient: "Sunita Devi", type: "Emergency", duration: "60 min" },
    { time: "12:00", patient: "Lunch Break", type: "Break", duration: "60 min" },
    { time: "13:00", patient: "Vikash Yadav", type: "Surgery Prep", duration: "45 min" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <Calendar className="text-blue-600" size={24} />
          Today's Schedule
        </h3>
        <span className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div className="space-y-3">
        {todayAppointments.map((appointment, index) => (
          <div key={index} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
            appointment.type === "Emergency" 
              ? "bg-red-50 border-red-400" 
              : appointment.type === "Break"
              ? "bg-gray-50 border-gray-300"
              : "bg-blue-50 border-blue-400"
          }`}>
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold text-slate-900 min-w-[60px]">
                {appointment.time}
              </div>
              <div>
                <p className="font-medium text-slate-900">{appointment.patient}</p>
                <p className="text-sm text-gray-600">{appointment.type}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              {appointment.duration}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total appointments today</span>
          <span className="font-bold text-slate-900">5 patients</span>
        </div>
      </div>
    </div>
  );
}