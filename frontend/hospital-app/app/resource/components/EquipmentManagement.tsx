"use client";

import { useEffect, useState } from "react";
import { Wrench, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { updateEquipmentStatus } from "../../lib/api/equipment.service";

type EquipmentItem = {
  id: string;
  equipment_name?: string;
  name?: string;
  location?: string;
  status?: string;
  lastMaintenance?: string;
};

export default function EquipmentManagement({ data }: { data?: EquipmentItem[] }) {
  const [equipment, setEquipment] = useState<EquipmentItem[]>(data ?? []);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    if (data && data.length) setEquipment(data);
  }, [data]);

  const getStatusColor = (status: string | undefined) => {
    switch ((status ?? "").toLowerCase()) {
      case "operational":
      case "available":
        return "bg-green-100 text-green-700 border-green-200";
      case "under maintenance":
      case "maintenance":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "needs repair":
      case "broken":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch ((status ?? "").toLowerCase()) {
      case "operational":
      case "available":
        return <CheckCircle size={16} className="text-green-600" />;
      case "under maintenance":
      case "maintenance":
        return <Clock size={16} className="text-yellow-600" />;
      case "needs repair":
      case "broken":
        return <AlertCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    setSavingId(id);
    try {
      await updateEquipmentStatus(id, status);
      setEquipment((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    } catch (e) {
      console.error("Failed to update equipment status:", e);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <Wrench className="text-blue-600" size={24} />
          Equipment Status
        </h3>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">Equipment Inventory →</button>
      </div>

      <div className="space-y-3">
        {equipment.length === 0 ? (
          <div className="text-center py-6 text-gray-500">No equipment data available</div>
        ) : (
          equipment.map((item) => {
            const name = item.equipment_name ?? item.name ?? "Unknown";
            const status = item.status ?? "unknown";
            return (
              <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <div>
                      <p className="font-medium text-slate-900">{name}</p>
                      <p className="text-sm text-gray-600">{item.id} • {item.location ?? "—"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Last Maintenance</p>
                    <p className="text-sm font-medium text-slate-900">{item.lastMaintenance ?? "—"}</p>
                  </div>

                  <select
                    value={status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    className="px-3 py-1 text-sm border rounded"
                    disabled={!!savingId}
                  >
                    <option value="available">Operational</option>
                    <option value="in_use">In Use</option>
                    <option value="maintenance">Under Maintenance</option>
                    <option value="broken">Needs Repair</option>
                  </select>

                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{equipment.filter(e => (e.status ?? "").toLowerCase() === "available").length}</p>
            <p className="text-xs text-gray-500">Operational</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{equipment.filter(e => ["maintenance","under maintenance"].includes((e.status ?? "").toLowerCase())).length}</p>
            <p className="text-xs text-gray-500">Maintenance</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-600">{equipment.filter(e => ["broken","needs repair"].includes((e.status ?? "").toLowerCase())).length}</p>
            <p className="text-xs text-gray-500">Need Repair</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900">{equipment.length}</p>
            <p className="text-xs text-gray-500">Total Equipment</p>
          </div>
        </div>
      </div>
    </div>
  );
}