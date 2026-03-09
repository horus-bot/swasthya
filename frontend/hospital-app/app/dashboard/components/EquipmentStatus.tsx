"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getEquipmentByHospital, updateEquipmentStatus } from "../../lib/api/equipment.service";

export default function EquipmentStatusCard() {
  const router = useRouter();
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    setLoading(true);
    try {
      const hospitalId = typeof window !== "undefined" ? localStorage.getItem("hospital_id") : null;
      if (!hospitalId) {
        setEquipment([]);
        return;
      }
      const rows = await getEquipmentByHospital(hospitalId);
      setEquipment(Array.isArray(rows) ? rows : []);
    } catch (err) {
      console.warn("Failed to load equipment:", err);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (equipmentId: string, newStatus: string) => {
    setSavingId(equipmentId);
    try {
      await updateEquipmentStatus(equipmentId, newStatus);
      await fetchEquipment();
    } catch (err) {
      console.error("Failed to update equipment status:", err);
    } finally {
      setSavingId(null);
    }
  };

  const resolveName = (eq: any) => eq?.type || eq?.equipment_name || eq?.name || eq?.display_name || "";

  if (loading) {
    return <div>Loading equipment...</div>;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-lg font-semibold mb-4">⚙️ Equipment Status</h2>

      {equipment.length === 0 ? (
        <div className="text-sm text-gray-500">No equipment data available</div>
      ) : (
        equipment.map(eq => (
          <div key={eq.id} className="flex items-center justify-between mb-4">
            <div>
              <p className="font-medium">{resolveName(eq)}</p>
              <p className={`text-sm ${eq.status === 'available' ? 'text-green-600' : 'text-orange-600'}`}>
                {eq.status ?? "unknown"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={eq.status ?? ""}
                onChange={e => handleStatusChange(eq.id, e.target.value)}
                className="border rounded px-3 py-1"
                disabled={!!savingId}
              >
                <option value="">Select</option>
                <option value="available">Available</option>
                <option value="in_use">In Use</option>
                <option value="maintenance">Maintenance</option>
                <option value="broken">Broken</option>
              </select>
              {savingId === eq.id && <span className="text-xs text-gray-500">Saving...</span>}
            </div>
          </div>
        ))
      )}

      <button
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded"
        onClick={() => router.push("/resources")}
      >
        Request Equipment Support →
      </button>
    </div>
  );
}
