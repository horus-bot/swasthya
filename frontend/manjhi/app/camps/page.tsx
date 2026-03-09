"use client";

import PageHeader from "@/components/PageHeader";
import { MapPin, Users, Calendar, Clock, Navigation } from "lucide-react";
import { theme } from "@/lib/theme";

export default function CampsPage() {
  return (
    <div style={{ padding: '16px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader title="Healthcare Camps" subtitle="Manage daily screening camps and patient flow." />
      
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '24px' }}>
        <FilterBadge label="Today" active />
        <FilterBadge label="Upcoming" />
        <FilterBadge label="Completed" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <CampCard 
            name="Sector 14 Community Hall" 
            location="Sector 14, Block B, Near Market" 
            date="Today"
            time="09:00 AM - 02:00 PM" 
            type="General Health & Eye Checkup" 
            patients={45} 
            status="Active" 
            statusColor="#15803d"
            statusBg="#f0fdf4"
        />
        <CampCard 
            name="Govt. Primary School" 
            location="Village Badli, District 4" 
            date="Today" 
            time="10:00 AM - 04:00 PM" 
            type="Maternal Health Screening" 
            patients={72} 
            status="Closing Soon"
            statusColor="#b45309"
            statusBg="#fffbeb"
        />
        <CampCard 
            name="Railway Colony Center" 
            location="East Zone, Station Road" 
            date="Tomorrow" 
            time="09:00 AM" 
            type="Diabetes Awareness Camp" 
            patients={0} 
            status="Scheduled"
            statusColor="#1d4ed8"
            statusBg="#eff6ff"
        />
      </div>
    </div>
  )
}

function FilterBadge({ label, active }: { label: string, active?: boolean }) {
    return (
        <button style={{
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '14px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: active ? theme.colors.primary : '#f1f5f9',
            color: active ? 'white' : '#475569',
            transition: 'background-color 0.2s'
        }}>
            {label}
        </button>
    )
}

function CampCard({ name, location, date, time, type, patients, status, statusColor = "#15803d", statusBg = "#f0fdf4" }: any) {
    return (
        <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: theme.borderRadius.xl,
            boxShadow: theme.shadows.sm,
            border: `1px solid ${theme.colors.border}`,
            transition: 'border-color 0.2s',
            cursor: 'pointer'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                     <span style={{
                         backgroundColor: statusBg,
                         color: statusColor,
                         fontSize: '12px',
                         fontWeight: 700,
                         padding: '4px 8px',
                         borderRadius: theme.borderRadius.sm,
                         textTransform: 'uppercase',
                         letterSpacing: '0.025em'
                     }}>{status}</span>
                     <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.primaryDark, marginTop: '8px' }}>{name}</h3>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '14px', justifyContent: 'flex-end' }}>
                        <Calendar size={14} /> {date}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', color: '#475569', fontSize: '14px', marginBottom: '16px' }}>
                <MapPin size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                <span>{location}</span>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                borderTop: `1px solid ${theme.colors.border}`,
                paddingTop: '16px',
                marginTop: '8px'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Details</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#334155' }}>{type}</span>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><Clock size={12} /> {time}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Patients</span>
                    <span style={{ fontSize: '20px', fontWeight: 700, color: theme.colors.primary, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Users size={18} /> {patients}
                    </span>
                    <button style={{ 
                        fontSize: '12px', color: theme.colors.secondary, fontWeight: 600, marginTop: '4px', 
                        background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' 
                    }}>View List</button>
                </div>
            </div>
            
            <div style={{ marginTop: '16px', paddingTop: '12px', display: 'flex', gap: '12px' }}>
                <button style={{
                    flex: 1,
                    backgroundColor: theme.colors.primary,
                    color: 'white',
                    padding: '8px',
                    borderRadius: theme.borderRadius.lg,
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    Manage Camp
                </button>
                <button style={{
                    padding: '8px',
                    border: `1px solid ${theme.colors.border}`,
                    borderRadius: theme.borderRadius.lg,
                    color: '#475569',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} aria-label="Directions">
                    <Navigation size={20} />
                </button>
            </div>
        </div>
    )
}
