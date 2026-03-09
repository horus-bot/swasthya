"use client";

import { useEffect, useState } from "react";
import { Bed, User, Clock, MapPin } from "lucide-react";
import {
  getBedStatusByHospital,
  getBedsByHospital,
  updateBedStatus,
  updateBedRecord,
} from "../../lib/api/bed.service";

type BedItem = {
  id: string;
  bed_number?: string;
  patient_name?: string | null;
  patient_id?: string | null;
  status: string;
  ward?: string;
  department?: string;
  updated_at?: string;
  created_at?: string;
};

export default function BedManagement() {
  const [beds, setBeds] = useState<BedItem[]>([]);
  const [bedStatusRowId, setBedStatusRowId] = useState<string | null>(null);
  const [bedSummary, setBedSummary] = useState<{ total: number; available: number; occupied: number } | null>(null);
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBeds();
  }, []);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const hospitalId = typeof window !== "undefined" ? localStorage.getItem("hospital_id") : null;

      if (!hospitalId) {
        console.warn("No hospital_id found in localStorage");
        setBeds([]);
        setBedSummary(null);
        setLoading(false);
        return;
      }

      // Fetch aggregate status row
      const { data: statusData, error: statusError } = await getBedStatusByHospital(hospitalId);
      if (!statusError && statusData && statusData.length > 0) {
        setBedStatusRowId(statusData[0].id ?? statusData[0].ID ?? null);
        // Use aggregate if individual beds aren't returned below
      }

      // Fetch individual beds
      const { data: bedsData, error: bedsError } = await getBedsByHospital(hospitalId);
      if (!bedsError && bedsData && bedsData.length > 0) {
        setBeds(bedsData);
        setBedSummary(computeSummaryFromBeds(bedsData));
      } else {
        setBeds([]);
        // fallback to aggregate summary if available
        if (statusData && statusData.length > 0) {
          const s = statusData[0];
          setBedSummary({
            total: s.total_beds ?? 0,
            available: s.available_beds ?? 0,
            occupied: s.occupied_beds ?? 0,
          });
        } else {
          setBedSummary(null);
        }
      }
    } catch (e) {
      console.warn("Error fetching beds:", e);
      setBeds([]);
      setBedSummary(null);
    } finally {
      setLoading(false);
    }
  };

  const computeSummaryFromBeds = (bedsList: BedItem[]) => {
    const total = bedsList.length;
    const available = bedsList.filter((b) => (b.status || "").toLowerCase() === "available").length;
    const occupied = bedsList.filter((b) => (b.status || "").toLowerCase() === "occupied").length;
    return { total, available, occupied };
  };

  const getStatusColor = (status: string) => {
    const normalized = (status || "").toLowerCase();
    if (normalized === "occupied") return "bg-red-100 text-red-700 border-red-200";
    if (normalized === "available") return "bg-green-100 text-green-700 border-green-200";
    if (normalized === "maintenance") return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  const normalizeStatus = (status: string): "Occupied" | "Available" | "Maintenance" => {
    const s = (status || "").toLowerCase();
    if (s === "occupied") return "Occupied";
    if (s === "available") return "Available";
    if (s === "maintenance") return "Maintenance";
    return "Available";
  };

  const formatTimeSince = (dateString?: string) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const recalcAndPersist = async (newBeds: BedItem[]) => {
    const summary = computeSummaryFromBeds(newBeds);
    setBeds(newBeds);
    setBedSummary(summary);

    if (!bedStatusRowId) {
      console.warn("No bed_status row id available; skipping aggregate DB update.");
      return;
    }

    setUpdating(true);
    try {
      const { error } = await updateBedStatus(bedStatusRowId, {
        total_beds: summary.total,
        available_beds: summary.available,
        occupied_beds: summary.occupied,
      });

      if (error) {
        console.error("Failed to update bed_status:", error);
      } else {
        console.log("Bed status updated:", summary);
      }
    } catch (e) {
      console.error("updateBedStatus error:", e);
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusChange = async (bedId: string, newStatus: string) => {
    const normalizedStatus = newStatus.toLowerCase();
    setUpdating(true);
    try {
      // Update individual bed record
      const { error } = await updateBedRecord(bedId, { status: normalizedStatus });
      if (error) {
        console.error("Failed to update bed record:", error);
        setUpdating(false);
        return;
      }

      // update local list and aggregate
      const newBeds = beds.map((b) => (b.id === bedId ? { ...b, status: normalizedStatus } : b));
      await recalcAndPersist(newBeds);
    } catch (e) {
      console.error("handleStatusChange error:", e);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-center text-gray-500">Loading bed management...</p>
      </div>
    );
  }

  const totalBeds = bedSummary?.total ?? 0;
  const availableBeds = bedSummary?.available ?? 0;
  const occupiedBeds = bedSummary?.occupied ?? 0;
  const occupancyPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <Bed className="text-blue-600" size={24} />
          Bed Management
        </h3>
        <div className="flex items-center gap-4">
          <button onClick={fetchBeds} className="text-blue-600 hover:text-blue-800 font-medium text-sm">
            Refresh →
          </button>
          <button
            onClick={() => {}}
            className="text-sm px-3 py-1 bg-slate-50 rounded-lg border border-gray-200 hover:bg-slate-100"
            disabled
          >
            Export
          </button>
        </div>
      </div>

      {/* Availability summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-3 bg-gradient-to-r from-slate-50 to-[#dbeafe] rounded-xl flex flex-col items-start">
          <span className="text-sm text-gray-600">Total Beds</span>
          <span className="text-2xl font-bold text-slate-900">{totalBeds}</span>
        </div>
        <div className="p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl flex flex-col items-start">
          <span className="text-sm text-gray-600">Available</span>
          <span className="text-2xl font-bold text-emerald-600">{availableBeds}</span>
        </div>
        <div className="p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl flex flex-col items-start">
          <span className="text-sm text-gray-600">Occupied</span>
          <span className="text-2xl font-bold text-amber-600">{occupiedBeds}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600">Occupancy Rate</span>
          <span className="text-xs font-bold text-gray-900">{occupancyPercent}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-3 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-full transition-all"
            style={{ width: `${occupancyPercent}%` }}
          />
        </div>
      </div>

      {beds.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No bed records found in database.</p>
          <p className="text-sm text-gray-400">Add bed records to your "beds" table to manage them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beds.map((bed) => (
            <div key={bed.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{bed.bed_number || bed.id}</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(bed.status)}`}>
                    {normalizeStatus(bed.status)}
                  </span>
                </div>
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <MapPin size={12} />
                  {bed.ward || bed.department || "General"}
                </span>
              </div>

              <div className="space-y-2">
                {bed.patient_name ? (
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-gray-500" />
                    <span className="text-slate-900 font-medium">{bed.patient_name}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User size={14} />
                    <span>No patient assigned</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock size={14} />
                  <span>{formatTimeSince(bed.updated_at)}</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <select
                    value={(bed.status || "").toLowerCase()}
                    onChange={(e) => handleStatusChange(bed.id, e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    disabled={updating}
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                    <option value="maintenance">Maintenance</option>
                  </select>

                  <button
                    onClick={() => handleStatusChange(bed.id, (bed.status || "").toLowerCase() === "available" ? "occupied" : "available")}
                    disabled={updating}
                    className="px-3 py-2 text-sm bg-slate-50 rounded-lg border border-gray-200 hover:bg-slate-100"
                  >
                    Toggle
                  </button>
                  {updating && <span className="text-xs text-gray-500">Saving...</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}