"use client";

import { useEffect, useState } from "react";
import { getBedStatus } from "../../lib/api/bed.service";

interface BedData {
  total_beds?: number;
  available_beds?: number;
  occupied_beds?: number;
}

interface BedStatusProps {
  data?: BedData;
  onUpdate?: () => void;
}

export default function BedStatus({ data, onUpdate }: BedStatusProps) {
  const [snapshot, setSnapshot] = useState<BedData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data && Object.keys(data).length) return;
    
    const fetchBedStatus = async () => {
      setLoading(true);
      try {
        const { data: fetchedData, error } = await getBedStatus();
        if (error) {
          console.warn("Failed to load bed status snapshot:", error);
          setSnapshot(null);
        } else {
          setSnapshot(fetchedData ?? null);
        }
      } catch (err) {
        console.warn("Failed to load bed status snapshot:", err);
        setSnapshot(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBedStatus();
  }, [data]);

  const bed = data ?? snapshot ?? {};
  const totalBeds = bed?.total_beds ?? 0;
  const availableBeds = bed?.available_beds ?? 0;
  const occupiedBeds = bed?.occupied_beds ?? 0;
  const occupancyPercent = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  if (loading) {
    return (
      <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <p className="text-center text-gray-500">Loading bed availability...</p>
      </div>
    );
  }

  if (!bed || totalBeds === 0) {
    return (
      <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="font-bold text-lg mb-4 text-slate-900">🛏️ Bed Availability</h3>
        <p className="text-center text-gray-500 py-4">No bed status data available. Please add bed records to your database.</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-[#3b82f6] transition-all group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
      <div className="relative">
        <h3 className="font-bold text-lg mb-6 text-slate-900 group-hover:text-[#1e3a8a] transition-colors">🛏️ Bed Availability</h3>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-[#dbeafe] rounded-xl group-hover:to-[#bfdbfe] transition-all">
            <span className="font-medium text-gray-700">Total Beds</span>
            <span className="font-bold text-xl text-slate-900">{totalBeds}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
            <span className="font-medium text-gray-700">Available</span>
            <span className="font-bold text-xl text-emerald-600">{availableBeds}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 hover:shadow-md transition-all">
            <span className="font-medium text-gray-700">Occupied</span>
            <span className="font-bold text-xl text-amber-600">{occupiedBeds}</span>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Occupancy Rate</span>
            <span className="text-xs font-bold text-gray-900">{occupancyPercent}%</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div className="h-3 bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] rounded-full transition-all" style={{ width: `${occupancyPercent}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
