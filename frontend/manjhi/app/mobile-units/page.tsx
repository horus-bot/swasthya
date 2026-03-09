"use client";
import { useEffect, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Truck, MapPin, Signal } from "lucide-react";
import { theme } from "@/lib/theme";

const fallbackUnits = [
  { unit_code: "MHU-01", driver_name: "Rajesh Kumar", location: "En route to Sector 14", eta: "15 mins", status: "en_route", gps_status: "online", fuel_percentage: 75 },
  { unit_code: "MHU-02", driver_name: "Sunita Devi", location: "Base Station (Main Hospital)", eta: null, status: "standby", gps_status: "online", fuel_percentage: 75 },
  { unit_code: "MHU-03", driver_name: "Vikram Singh", location: "Village Badli", eta: null, status: "active", gps_status: "online", fuel_percentage: 75 },
];

const statusLabels: Record<string, string> = {
  active: "Active",
  en_route: "En Route",
  standby: "Standby",
  maintenance: "Maintenance",
};

export default function MobileUnitsPage() {
  const [units, setUnits] = useState<any[]>(fallbackUnits);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/mobile-units");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setUnits(data);
      } catch { /* keep fallback */ }
    })();
  }, []);

  return (
    <div style={{ padding: '16px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader title="Mobile Health Units" subtitle="Track deployment and status of mobile clinics." />
      
      {/* Map Placeholder */}
      <div style={{ 
          width: '100%', height: '192px', backgroundColor: '#f1f5f9', borderRadius: theme.borderRadius.xl, 
          border: `1px solid ${theme.colors.border}`, display: 'flex', alignItems: 'center', 
          justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '24px' 
      }}>
         <div style={{ position: 'absolute', inset: 0, backgroundColor: '#e2e8f0', opacity: 0.5 }}></div>
         <p style={{ position: 'relative', zIndex: 10, color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin /> Map Integration Placeholder
         </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
         {units.map((u: any) => (
           <UnitStatusCard
             key={u.id || u.unit_code}
             id={u.unit_code}
             driver={u.driver_name}
             location={u.location || "Unknown"}
             eta={u.eta || undefined}
             status={statusLabels[u.status] || u.status}
             gpsStatus={u.gps_status || "online"}
             fuel={u.fuel_percentage ?? 75}
           />
         ))}
      </div>
    </div>
  )
}

function UnitStatusCard({ id, driver, location, eta, status, gpsStatus, fuel }: any) {
  const isMoving = status === "En Route";
  
  let statusBg = "#f1f5f9";
  let statusColor = "#475569";

  if (status === "Active") {
      statusBg = "#f0fdf4";
      statusColor = "#15803d";
  } else if (status === "En Route") {
      statusBg = "#eff6ff";
      statusColor = "#1d4ed8";
  }
  
  return (
    <div style={{ 
        backgroundColor: 'white', padding: '16px', borderRadius: theme.borderRadius.xl, 
        boxShadow: theme.shadows.sm, border: `1px solid ${theme.colors.border}`, display: 'flex', flexDirection: 'column', gap: '12px' 
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: '#f1f5f9', padding: '10px', borderRadius: '9999px', color: '#334155' }}>
                    <Truck size={20} />
                </div>
                <div>
                    <h3 style={{ fontWeight: 700, color: theme.colors.primaryDark }}>{id}</h3>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>Driver: {driver}</p>
                </div>
            </div>
            <span style={{ 
                fontSize: '12px', fontWeight: 600, padding: '4px 8px', borderRadius: theme.borderRadius.sm, 
                display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: statusBg, color: statusColor 
            }}>
               {isMoving && <span style={{ width: '8px', height: '8px', backgroundColor: 'currentColor', borderRadius: '9999px' }} />}
               {status}
            </span>
        </div>
        
        <div style={{ 
            backgroundColor: '#f8fafc', borderRadius: theme.borderRadius.lg, padding: '12px', fontSize: '14px', 
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid #f1f5f9' 
        }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
                <MapPin size={16} />
                <span>{location}</span>
             </div>
             {eta && <span style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '4px' }}>ETA: {eta}</span>}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Signal size={12} /> GPS {gpsStatus === "online" ? "Online" : "Offline"}</span>
            <span>Fuel: {fuel}%</span>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button style={{ 
                flex: 1, padding: '8px', fontSize: '14px', fontWeight: 500, border: `1px solid ${theme.colors.border}`, 
                borderRadius: theme.borderRadius.lg, backgroundColor: 'white', color: theme.colors.textSecondary, cursor: 'pointer' 
            }}>View Manifest</button>
            <button style={{ 
                flex: 1, padding: '8px', fontSize: '14px', fontWeight: 500, backgroundColor: theme.colors.primary, 
                color: 'white', borderRadius: theme.borderRadius.lg, border: 'none', cursor: 'pointer' 
            }}>Deploy</button>
        </div>
    </div>
  )
}
