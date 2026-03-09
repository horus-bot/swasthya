"use client";

import { useState, useEffect } from "react";
import AppointmentStatCard from "./components/AppointmentStatCard";
import { AppointmentRequestCard } from "./components/AppointmentRequestCard";
import AppointmentSchedule from "./components/AppointmentSchedule";
import AppointmentFilters from "./components/AppointmentFilters";
import { Calendar, Clock, Users, AlertTriangle } from "lucide-react";
import { getPendingAppointments, updateAppointmentStatus } from "../lib/api/appointment.service";

export default function AppointmentsPage() {
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingAppointments();
      if (Array.isArray(data)) setPendingRequests(data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: 'scheduled' | 'cancelled') => {
    try {
      await updateAppointmentStatus(id, status as any);
      setPendingRequests(prev => prev.filter(req => req.id !== id));
    } catch (err: any) {
      console.error("Error updating appointment:", err);
      const message = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
      alert(`Failed to update appointment status: ${message}`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
          Appointments Management
        </h1>
        <p className="text-gray-500 mt-2">Manage patient appointments, schedules and requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AppointmentStatCard 
          title="Today's Appointments" 
          value="12" 
          subtitle="5 remaining" 
          icon={<Calendar className="text-blue-600" size={24} />}
        />
        <AppointmentStatCard 
          title="Pending Requests" 
          value={pendingRequests.length.toString()} 
          subtitle="Awaiting approval" 
          icon={<Clock className="text-orange-600" size={24} />}
        />
        <AppointmentStatCard 
          title="Total Patients" 
          value="156" 
          subtitle="This month" 
          icon={<Users className="text-emerald-600" size={24} />}
        />
        <AppointmentStatCard 
          title="Emergency Slots" 
          value="3" 
          subtitle="Available today" 
          icon={<AlertTriangle className="text-red-600" size={24} />}
        />
      </div>

      {/* Filters */}
      <AppointmentFilters />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Schedule */}
        <div>
          <AppointmentSchedule />
        </div>

        {/* Pending Requests */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            📋 Pending Appointment Requests
          </h2>
          <div className="space-y-4">
            {loading ? (
              <p className="text-gray-500">Loading requests...</p>
            ) : pendingRequests.length === 0 ? (
              <p className="text-gray-500 italic">No pending requests found.</p>
            ) : (
              pendingRequests.map((request) => (
                <AppointmentRequestCard 
                  key={request.id} 
                  id={request.id}
                  patientName={request.name ?? `${request.first_name || ''} ${request.last_name || ''}`.trim()}
                  reason={request.preferred_doc ?? request.depart ?? 'Appointment'}
                  requestedTime={request.preferred_time ?? ''}
                  requestedDate={request.appointment_date || "Not set"}
                  priority={"Medium"}
                  contactNumber={request.phone ?? request.email ?? "N/A"}
                  onApprove={() => handleAction(request.id, 'scheduled')}
                  onDecline={() => handleAction(request.id, 'cancelled')}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
