"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import StatCard from "./components/StatCard";
import BedStatus from "./components/BedStatus";
import EquipmentStatus from "./components/EquipmentStatus";
import { AppointmentCard } from "./components/AppointmentCard";
import { AppointmentRequestCard } from "../appointments/components/AppointmentRequestCard";
import Link from "next/link";
import { getPendingAppointments, Appointment, updateAppointmentStatus } from "../lib/api/appointment.service";
import { getEquipmentRequests } from "../lib/api/equipmentRequest.service";
import { getBedStatusByHospital } from "../lib/api/bed.service";
import { getEquipmentByHospital, updateEquipmentStatus } from "../lib/api/equipment.service";
import { EquipmentRequest } from "../lib/api/equipmentRequest.service";
import { supabase, clearInvalidSession } from "../lib/api/supabase";

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [bedData, setBedData] = useState<any>(null);
  const [equipmentData, setEquipmentData] = useState<any[]>([]);
  const [equipmentRequests, setEquipmentRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const router = useRouter();

  const normalize = (res: any) => {
    if (!res) return null;
    if (Array.isArray(res)) return res;
    if (res.data) return res.data;
    return null;
  };

  const handleAuthError = async () => {
    console.warn("Authentication error detected, clearing session...");
    await clearInvalidSession();
    setAuthError(true);
    // Optionally redirect to login
    // router.push('/login');
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Check authentication first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.warn("No valid session found");
        // Continue anyway for now, or redirect to login
        // return handleAuthError();
      }

      // Appointments
      try {
        const apptRes = await getPendingAppointments();
        const pendingAppts = normalize(apptRes) ?? [];
        setAppointments(pendingAppts);
      } catch (e: any) {
        if (e?.message?.includes('refresh token') || e?.message?.includes('JWT')) {
          return handleAuthError();
        }
        console.warn("Error fetching pending appointments:", e);
        setAppointments([]);
      }

      // Bed status (by hospital id) - NO HARDCODED FALLBACK
      try {
        const hospitalId = typeof window !== "undefined" ? localStorage.getItem("hospital_id") : null;
        if (hospitalId) {
          const { data, error } = await getBedStatusByHospital(hospitalId);
          if (error) {
            if (error.message?.includes('refresh token') || error.message?.includes('JWT')) {
              return handleAuthError();
            }
            console.warn("Error from getBedStatusByHospital:", error);
            setBedData(null);
          } else if (data && data.length > 0) {
            setBedData(data[0]);
          } else {
            console.warn("No bed status found for hospital");
            setBedData(null);
          }
        } else {
          console.warn("No hospital_id in localStorage");
          setBedData(null);
        }
      } catch (e: any) {
        if (e?.message?.includes('refresh token') || e?.message?.includes('JWT')) {
          return handleAuthError();
        }
        console.warn("Error fetching bed status:", e);
        setBedData(null);
      }

      // Equipment: fetch from DB (no hardcoded fallback)
      try {
        const hospitalId = typeof window !== "undefined" ? localStorage.getItem("hospital_id") : null;
        if (hospitalId) {
          const rows = await getEquipmentByHospital(hospitalId);
          setEquipmentData(Array.isArray(rows) ? rows : normalize(rows) ?? []);
        } else {
          setEquipmentData([]);
        }
      } catch (e: any) {
        if (e?.message?.includes('refresh token') || e?.message?.includes('JWT')) {
          return handleAuthError();
        }
        console.warn("Error fetching equipment:", e);
        setEquipmentData([]);
      }

      // Equipment requests
      try {
        const reqRes = await getEquipmentRequests();
        const requests = normalize(reqRes) ?? [];
        setEquipmentRequests(requests);
      } catch (e: any) {
        if (e?.message?.includes('refresh token') || e?.message?.includes('JWT')) {
          return handleAuthError();
        }
        console.warn("Error fetching equipment requests:", e);
        setEquipmentRequests([]);
      }
    } catch (e: any) {
      if (e?.message?.includes('refresh token') || e?.message?.includes('JWT')) {
        return handleAuthError();
      }
      console.error("Error fetching dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAppointmentUpdate = async (id: string, newStatus: "pending" | "scheduled" | "completed" | "cancelled") => {
    try {
      await updateAppointmentStatus(id, newStatus);
      if (newStatus !== "pending") setAppointments(prev => prev.filter(appt => appt.id !== id));
      if (newStatus === "scheduled") router.push("/appointments");
    } catch (e: any) {
      console.error("updateAppointmentStatus error", e);
      const message = e?.message || (typeof e === 'object' ? JSON.stringify(e) : String(e));
      alert("Failed to update appointment: " + message);
    }
  };

  const handleBedStatusRefresh = () => {
    fetchDashboardData();
  };

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h2>
          <p className="text-gray-600 mb-6">Your session has expired. Please log in again.</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-[#1e3a8a] via-[#3b82f6] to-[#1e3a8a] shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">Hospital Overview</h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl font-medium">Welcome back! Here's your facility status at a glance.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Beds Available" 
          value={bedData?.available_beds?.toString() ?? "—"} 
          subtitle={bedData ? `Out of ${bedData.total_beds}` : "No data"} 
        />
        <StatCard title="Doctors On Duty" value="8" subtitle="Today" />
        <StatCard title="Avg Waiting Time" value="25 min" subtitle="Emergency" />
        <StatCard 
          title="Equipment Requests" 
          value={equipmentRequests.filter((r) => r.status === "pending").length.toString()} 
          subtitle="Pending" 
        />
      </div>

      {/* Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BedStatus data={bedData} onUpdate={handleBedStatusRefresh} />
        <EquipmentStatus data={equipmentData} onUpdate={updateEquipmentStatus} />
      </div>

      {/* Appointments (compact) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-slate-900">📅 Appointment Requests</h2>
          <Link href="/appointments" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="space-y-4">
          {loading ? (
            <p className="text-gray-500">Loading requests...</p>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
              <p className="text-gray-500 italic">No pending appointment requests.</p>
            </div>
          ) : (
            // show up to 3 recent requests in compact form
            appointments.slice(0, 3).map((appt) => (
              <AppointmentRequestCard
                key={appt.id}
                id={appt.id}
                patientName={appt.name ?? `${appt.first_name || ''} ${appt.last_name || ''}`.trim()}
                reason={appt.preferred_doc ?? appt.depart ?? 'Appointment'}
                requestedTime={appt.preferred_time ?? ''}
                requestedDate={appt.appointment_date || 'Not set'}
                priority={"Medium"}
                contactNumber={appt.phone ?? appt.email ?? 'N/A'}
                onApprove={(e) => handleAppointmentUpdate(appt.id, 'scheduled')}
                onDecline={(e) => handleAppointmentUpdate(appt.id, 'cancelled')}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
