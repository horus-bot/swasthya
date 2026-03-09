"use client";

import { useEffect, useState } from "react";
import { getAdvisories, Advisory } from "../../lib/api/advisories.service";

export default function GovernmentAlerts() {
  const [alerts, setAlerts] = useState<Advisory[]>([]);
  const [severity, setSeverity] = useState<"All" | "Info" | "Warning" | "Critical">("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadAlerts() {
    setLoading(true);
    try {
      const data = await getAdvisories({ severity: severity === "All" ? undefined : (severity as any), search: search });
      setAlerts(data || []);
    } catch (err) {
      console.error("Failed to load advisories", err);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAlerts();
  }, [severity]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <input
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadAlerts()}
            className="w-full border border-slate-200 rounded-lg px-3 py-2"
          />
        </div>
        <div className="ml-4 flex gap-2">
          {(["All", "Info", "Warning", "Critical"] as const).map((s) => (
            <button key={s} onClick={() => setSeverity(s as any)} className={`px-3 py-1 rounded-lg ${severity===s? 'bg-slate-900 text-white':'bg-white border border-slate-200'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        {loading ? (
          <p className="text-sm text-gray-500">Loading alerts...</p>
        ) : alerts.length === 0 ? (
          <div className="bg-slate-50 p-6 rounded-lg text-center border border-slate-100">
            <h3 className="text-lg font-semibold">No government alerts</h3>
            <p className="text-sm text-gray-500 mt-2">You’re all caught up.</p>
            <div className="mt-4">
              <button onClick={loadAlerts} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Refresh alerts</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-3 border rounded-lg bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">{alert.title}</div>
                    <div className="text-xs text-gray-500">{new Date(alert.created_at).toLocaleString()}</div>
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 uppercase font-medium">{alert.severity}</div>
                </div>
                <p className="text-sm text-slate-700 mt-2">{alert.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
