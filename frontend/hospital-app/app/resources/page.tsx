"use client";

import { useEffect, useState } from "react";
import {
  createEquipmentRequest,
  getEquipmentRequests,
  EquipmentRequest
} from "../lib/api/equipmentRequest.service";

interface Equipment {
  id: string;
  name: string;
  department: string;
  available: number;
  total: number;
  status: "LOW" | "MEDIUM" | "HIGH";
}

export default function ResourcesPage() {
  /* -------- STATE -------- */
  const [equipments, setEquipments] = useState<Equipment[]>([]);
  const [recentRequests, setRecentRequests] = useState<EquipmentRequest[]>([]);
  const [selectedMachine, setSelectedMachine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  /* -------- LOAD DATA -------- */
  useEffect(() => {
    // Fetch equipment inventory
    fetch("/api/equipment")
      .then(res => res.json())
      .then(data => {
        setEquipments(data);
        if (data.length > 0) {
          setSelectedMachine(data[0].name);
        }
      })
      .catch(err => {
        console.error("Failed to fetch equipment:", err);
        // Fallback to sample data for demo
        const sampleEquipment: Equipment[] = [
          { id: "e1", name: "Ventilator - Model A", department: "ICU", total: 10, available: 2, status: "LOW" },
          { id: "e2", name: "Oxygen Cylinder", department: "Store", total: 50, available: 18, status: "MEDIUM" },
          { id: "e3", name: "X-Ray Machine", department: "Radiology", total: 2, available: 1, status: "LOW" },
        ];
        setEquipments(sampleEquipment);
        setSelectedMachine(sampleEquipment[0].name);
      });

    // Fetch recent requests
    getEquipmentRequests()
      .then(setRecentRequests)
      .catch(err => console.error("Failed to fetch requests:", err));
  }, []);

  /* -------- SEND REQUEST -------- */
  async function handleSendRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedMachine || quantity <= 0) return;

    setError("");
    setLoading(true);
    
    try {
      await createEquipmentRequest({
        equipment_type: selectedMachine,
        quantity,
        priority: quantity > 5 ? "HIGH" : "MEDIUM",
        message: note
      });

      setNote("");
      setQuantity(1);
      setSuccessMsg('Request sent successfully');
      setTimeout(() => setSuccessMsg(''), 2000);

      // Refresh requests
      const updated = await getEquipmentRequests();
      setRecentRequests(updated);
    } catch (err) {
      console.error(err);
      setError("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 p-6" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes machineSlideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6" style={{ animation: 'slideInDown 0.6s ease-out' }}>
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Resources & Equipment</h2>
            <p className="text-sm text-slate-600 mt-1">Current availability and government resource requests.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Equipment List */}
          <div className="lg:col-span-2 space-y-4">
            {equipments.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 text-slate-600">
                No equipment available
              </div>
            ) : (
              equipments.map((eq, idx) => {
                const percent = Math.round((eq.available / Math.max(1, eq.total)) * 100);
                const statusColor = eq.status === "LOW" ? "red" : eq.status === "MEDIUM" ? "amber" : "green";
                
                return (
                  <div key={eq.id} className={`bg-white p-5 rounded-2xl shadow-sm hover:shadow-lg hover:bg-blue-50/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-between border border-slate-100 hover:border-blue-200 cursor-pointer`} style={{ animation: `machineSlideIn 0.4s ease-out ${idx*0.1}s both` }}>
                    <div>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-semibold text-slate-800">{eq.name}</div>
                          <div className="text-sm text-gray-500">{eq.department}</div>
                        </div>
                        {eq.status === "LOW" && (
                          <div className="ml-3 px-2 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium animate-pulse">Low</div>
                        )}
                      </div>

                      <div className="mt-3 w-72 max-w-full">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className={`h-2 ${percent < 25 ? 'bg-red-400' : percent < 60 ? 'bg-amber-400' : 'bg-blue-500'}`} style={{ width: `${percent}%` }} />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{eq.available} available • {eq.total} total</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Available</div>
                      <div className="text-lg font-semibold text-blue-600">{eq.available}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Request Panel */}
          <div className="bg-white p-8 rounded-2xl shadow-md border border-slate-100" style={{ animation: 'slideInUp 0.6s ease-out 0.2s both' }}>
            {successMsg && (
              <div className="fixed top-6 right-6 z-50" style={{ animation: 'slideInUp 0.3s ease-out' }}>
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-3 rounded-lg shadow-lg font-medium animate-bounce cursor-default">✓ {successMsg}</div>
              </div>
            )}
            <h3 className="text-xl font-bold text-slate-900 mb-5">Request from Government</h3>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Equipment</label>
                <select
                  value={selectedMachine}
                  onChange={(e) => { setSelectedMachine(e.target.value); setError(""); }}
                  disabled={equipments.length === 0}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all 300ms bg-white cursor-text"
                >
                  <option value="">Select Equipment</option>
                  {equipments.map(eq => (
                    <option key={eq.id} value={eq.name}>
                      {eq.name} — {eq.department}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Quantity</label>
                <input 
                  type="number" 
                  value={quantity} 
                  min={1} 
                  onChange={(e) => { setQuantity(Number(e.target.value)); setError(""); }} 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all 300ms cursor-text" 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Note (optional)</label>
                <textarea 
                  value={note} 
                  onChange={(e) => { setNote(e.target.value); setError(""); }} 
                  placeholder="e.g., Urgent for emergency department" 
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:border-slate-300 transition-all 300ms resize-none cursor-text" 
                  rows={3} 
                />
              </div>

              {error && <div className="text-sm text-red-600 font-medium bg-red-50 p-3 rounded-lg">{error}</div>}

              <div className="flex gap-2 pt-2">
                <button 
                  type="submit"
                  disabled={loading || !selectedMachine || quantity <= 0}
                  className={`px-4 py-2.5 rounded-lg font-semibold transition-all 300ms flex-1 ${
                    loading || !selectedMachine || quantity <= 0 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5 cursor-pointer'
                  }`}
                >
                  {loading ? "Sending..." : "Send Request to Government"}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <h4 className="text-sm font-semibold text-slate-800 mb-3">Recent Government Requests</h4>
              <div className="space-y-2">
                {recentRequests.length === 0 ? (
                  <div className="text-sm text-slate-500">No requests yet</div>
                ) : (
                  recentRequests.map(req => (
                    <div key={req.id} className="p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-slate-200 transition-all 300ms">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-slate-800">
                            {req.equipment_type} <span className="text-blue-600">×{req.quantity}</span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5">
                            {new Date(req.requested_at).toLocaleString()}
                          </div>
                          {req.message && <div className="text-xs text-slate-600 italic mt-1">{req.message}</div>}
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {req.status || 'Pending'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
