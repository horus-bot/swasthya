"use client";

import React, { useEffect, useState, useCallback, Suspense } from "react";
import { supabase } from '../lib/api/supabase';
import { getEquipmentRequests, EquipmentRequest } from '../lib/api/equipmentRequest.service';
import dynamic from 'next/dynamic';

const GovtAlertsClient = dynamic(() => import('./components/GovernmentAlerts'), { ssr: false });
type Alert = {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  source?: string; 
  time: string;
  read?: boolean;
  details?: string;
};

// Fallback sample (used only if DB fetch fails)
const sampleEquipment: Alert[] = [
];



// Transform equipment request to notification alert
const transformEquipmentRequestToAlert = (req: EquipmentRequest): Alert => {
  let severity: Alert['severity'] = 'info';
  if (req.priority === 'CRITICAL') severity = 'critical';
  else if (req.priority === 'HIGH') severity = 'warning';

  return {
    id: req.id,
    title: `Equipment Request: ${req.equipment_type}`,
    message: req.message || `Requested ${req.quantity} units of ${req.equipment_type} (${req.priority} priority)`,
    severity,
    source: 'equipment-system',
    time: req.requested_at,
    read: false,
    details: JSON.stringify({
      equipment_type: req.equipment_type,
      quantity: req.quantity,
      priority: req.priority,
      status: req.status,
      requested_at: req.requested_at,
      reviewed_at: req.reviewed_at
    }, null, 2)
  };
};

export default function NotificationsPage() {
  const [equipmentNotifications, setEquipmentNotifications] = useState<Alert[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showOnlyUnread, setShowOnlyUnread] = useState(false);
  const [infoBanner, setInfoBanner] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<'all' | Alert['severity']>('all');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [govtError, setGovtError] = useState<string | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  const toggleDetails = (id: string) => {
    setExpandedDetails(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getPriorityBadgeClass = (p?: string) => {
    if (!p) return 'bg-slate-100 text-slate-700';
    const up = String(p).toUpperCase();
    if (up === 'CRITICAL') return 'bg-red-100 text-red-700';
    if (up === 'HIGH') return 'bg-amber-100 text-amber-700';
    if (up === 'MEDIUM') return 'bg-emerald-100 text-emerald-700';
    return 'bg-slate-100 text-slate-700';
  };

  const fetchEquipmentNotificationsFromDb = useCallback(async () => {
    try {
      const requests = await getEquipmentRequests();
      if (!Array.isArray(requests)) throw new Error('No requests');
      const notifications = requests.map(transformEquipmentRequestToAlert);
      setEquipmentNotifications(notifications);
      try { localStorage.setItem('equipment_notifications', JSON.stringify(notifications)); } catch (e) { /* ignore */ }
    } catch (err) {
      const rawEquipment = localStorage.getItem('equipment_notifications');
      if (rawEquipment) {
        try { setEquipmentNotifications(JSON.parse(rawEquipment)); return; } catch (e) { /* fall through */ }
      }
      setEquipmentNotifications(sampleEquipment);
    }
  }, [setEquipmentNotifications]);

  const getErrorMessage = (err: unknown) => {
    if (err instanceof Error) return err.message;
    if (typeof err === "string") return err;
    return "Failed to load government alerts.";
  };

  const fetchGovAlerts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('govt.govt_complaints')
        .select('id, payload, severity, category, message, created_at')
        .is('hospital_id', null) // Only public/general complaints
        .order('created_at', { ascending: false });

      if (error) {
        setGovtError(error.message || "Failed to load government alerts.");
        setAlerts([]);
        return;
      }

      const mappedAlerts: Alert[] = (data || []).map((item: any) => {
        const payload = item.payload ?? null;
        const payloadText = payload ? JSON.stringify(payload, null, 2) : undefined;
        let severity: Alert['severity'] = 'info';
        const dbSev = item.severity?.toUpperCase();
        if (dbSev === 'CRITICAL') severity = 'critical';
        else if (dbSev === 'HIGH' || dbSev === 'MEDIUM') severity = 'warning';

        return {
          id: item.id,
          title: item.payload?.title || item.category || 'Government Alert',
          message: item.payload?.description || item.payload?.message || item.message || 'No description provided',
          severity: severity,
          source: 'gov-app',
          time: item.created_at,
          read: false,
          details: payloadText
        };
      });

      setAlerts(mappedAlerts);
      setGovtError(null);
    } catch (err) {
      setGovtError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load equipment notifications from DB (with fallback) and government alerts
    fetchEquipmentNotificationsFromDb();
    fetchGovAlerts();
  }, [fetchEquipmentNotificationsFromDb, fetchGovAlerts]);

  useEffect(() => {
    localStorage.setItem("equipment_notifications", JSON.stringify(equipmentNotifications));
  }, [equipmentNotifications]);

  // Note: We don't cache gov alerts in localstorage anymore to ensure freshness, 
  // or you could add a similar useEffect here if you want offline caching.

  const markAllRead = () => setAlerts((s) => s.map(a => ({ ...a, read: true })));
  const clearAll = () => setAlerts([]);
  const refreshGovAlerts = () => fetchGovAlerts();

  const markAllReadEquipment = () => setEquipmentNotifications((s) => s.map(a => ({ ...a, read: true })));
  const clearEquipment = () => setEquipmentNotifications([]);
  const resetEquipment = () => setEquipmentNotifications(sampleEquipment.map(a => ({ ...a, time: new Date().toISOString(), read: false })));

  const markRead = (id: string) => setAlerts((s) => s.map(a => a.id === id ? { ...a, read: true } : a));
  const markUnread = (id: string) => setAlerts((s) => s.map(a => a.id === id ? { ...a, read: false } : a));
  const dismiss = (id: string) => setAlerts((s) => s.filter(a => a.id !== id));

  const markReadEquipment = (id: string) => setEquipmentNotifications((s) => s.map(a => a.id === id ? { ...a, read: true } : a));
  const markUnreadEquipment = (id: string) => setEquipmentNotifications((s) => s.map(a => a.id === id ? { ...a, read: false } : a));
  const dismissEquipment = (id: string) => setEquipmentNotifications((s) => s.filter(a => a.id !== id));

  const renderDetails = (details?: string | undefined, id?: string) => {
    if (!details) return null;
    try {
      const parsed = JSON.parse(details);
      if (parsed && typeof parsed === 'object') {
        const entries = Object.entries(parsed);
        const isExpanded = id ? expandedDetails.has(String(id)) : true;
        return (
          <div className="mt-3 bg-white border border-slate-100 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {entries.map(([k, v]) => (
                <div key={k} className="flex items-start gap-2">
                  <div className="text-xs font-semibold text-slate-700 w-28">{k}</div>
                  <div className="text-sm text-slate-600 break-words">{String(v)}</div>
                </div>
              ))}
            </div>
            {id && (
              <div className="mt-3 flex justify-end">
                <button onClick={() => toggleDetails(String(id))} className="text-xs text-blue-600 hover:text-blue-800">{isExpanded ? 'Hide details' : 'Show details'}</button>
              </div>
            )}
          </div>
        );
      }
    } catch (e) {
      // not JSON, fall through to plain rendering
    }
    return (
      <div className="mt-3">
        <div className="text-sm text-slate-700 bg-white border border-slate-100 rounded-lg p-3">
          {String(details)}
        </div>
      </div>
    );
  };

  const equipmentList = showOnlyUnread ? equipmentNotifications.filter(a => !a.read) : equipmentNotifications;

  const govtList = (showOnlyUnread ? alerts.filter(a => !a.read) : alerts)
    .filter(a => (filterSeverity === 'all' ? true : a.severity === filterSeverity))
    .filter(a => a.title.toLowerCase().includes(query.toLowerCase()) || a.message.toLowerCase().includes(query.toLowerCase()) || (a.details ?? '').toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            Notifications Center
          </h1>
          <p className="text-gray-500 mt-2">Manage equipment requests and government alerts</p>
        </div>

        <div className="flex items-center gap-3">
          <label className="inline-flex items-center text-sm cursor-pointer text-gray-600">
            <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked={showOnlyUnread} onChange={(e) => setShowOnlyUnread(e.target.checked)} />
            Show unread only
          </label>
        </div>
      </div>

      {infoBanner && (equipmentNotifications.filter(a=>!a.read).length > 0 || alerts.filter(a=>!a.read).length > 0) && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            You have <strong className="text-blue-600 font-semibold">{equipmentNotifications.filter(a=>!a.read).length + alerts.filter(a=>!a.read).length}</strong> unread notification(s).
          </div>
          <div className="flex gap-2">
            <button onClick={() => { markAllRead(); markAllReadEquipment(); setInfoBanner(false); }} className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Mark all read</button>
            <button onClick={() => setInfoBanner(false)} className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors">Dismiss</button>
          </div>
        </div>
      )}

      {/* Equipment Notifications Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <svg className="text-emerald-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
              </svg>
              Equipment Notifications
            </h3>
            <p className="text-sm text-gray-500 mt-1">Equipment requests and status reports forwarded to authorities</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={markAllReadEquipment} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">Mark all read</button>
            <button onClick={clearEquipment} className="px-4 py-2 border border-red-300 rounded-lg text-sm text-red-600 font-medium hover:bg-red-50 transition-colors">Clear</button>
          </div>
        </div>

        <div className="space-y-3">

        {equipmentList.length === 0 && (
          <div className="bg-slate-50 p-8 rounded-xl text-center border border-slate-200">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="text-emerald-600" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">No equipment notifications</h3>
            <p className="text-sm text-gray-500 mt-2">You're all caught up. Click below to load sample data.</p>
            <div className="mt-4">
              <button onClick={resetEquipment} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">Load sample equipment</button>
            </div>
          </div>
        )}

        {equipmentList.map((alert, idx) => {
          const detailsObj = (() => {
            try { return alert.details ? JSON.parse(alert.details) : null; } catch { return null; }
          })();
          return (
          <div key={alert.id} className={`relative overflow-hidden rounded-xl border p-4 transition-all hover:shadow-md ${alert.read ? 'border-slate-200 bg-white' : 'border-emerald-200 bg-emerald-50'}`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${alert.severity === 'critical' ? 'bg-red-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
            <div className="pl-3 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${alert.severity === 'critical' ? 'bg-red-100' : alert.severity === 'warning' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                      {alert.severity === 'critical' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      ) : alert.severity === 'warning' ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{alert.title}</div>
                      <div className="text-xs text-gray-500">{new Date(alert.time).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {detailsObj?.priority && (
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPriorityBadgeClass(detailsObj.priority)}`}>
                        {String(detailsObj.priority)}
                      </span>
                    )}
                    {detailsObj?.status && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-50 text-slate-700">{String(detailsObj.status)}</span>
                    )}
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${alert.severity === 'critical' ? 'bg-red-100 text-red-700' : alert.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-sm text-gray-700">{alert.message}</p>
                {renderDetails(alert.details, alert.id)}
                <p className="mt-2 text-xs text-gray-400">Source: {alert.source ?? 'internal'}</p>
              </div>

              <div className="flex flex-col items-end gap-2">
                {!alert.read ? (
                  <button onClick={() => markReadEquipment(alert.id)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Mark read</button>
                ) : (
                  <button onClick={() => markUnreadEquipment(alert.id)} className="text-sm text-gray-600 hover:text-gray-700 font-medium">Mark unread</button>
                )}
                <button onClick={() => dismissEquipment(alert.id)} className="text-sm text-red-500 hover:text-red-600 font-medium">Dismiss</button>
              </div>
            </div>
          </div>
          );
        })}
        </div>
      </div>

      {/* Government Alerts Section (component) */}
      <div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
          <Suspense fallback={<div className="py-6 text-center text-gray-500">Loading government alerts...</div>}>
            <GovtAlertsClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
