"use client";
import PageHeader from "@/components/PageHeader";
import { User, Settings, LogOut, Bell, Shield, Database, FileText } from "lucide-react";
import { theme } from "@/lib/theme";

export default function AdminPage() {
  const cardStyle = {
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.shadows.sm,
      border: `1px solid ${theme.colors.border}`,
      overflow: 'hidden'
  };

  const buttonStyle = {
      fontSize: '14px',
      fontWeight: 600,
      padding: '8px 16px',
      borderRadius: theme.borderRadius.lg,
      cursor: 'pointer',
      border: 'none'
  };

  return (
    <div style={{ padding: '16px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader title="Profile & Settings" subtitle="Manage your account preferences and app settings." />
      
      <div style={{ 
          ...cardStyle, 
          padding: '24px', 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '24px', 
          alignItems: 'center', 
          marginBottom: '24px' 
      }}>
         <div style={{ 
             width: '96px', height: '96px', backgroundColor: '#e2e8f0', borderRadius: '50%', 
             display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', 
             fontWeight: 700, color: '#64748b' 
         }}>
             PS
         </div>
         <div>
             <h2 style={{ fontSize: '20px', fontWeight: 700, color: theme.colors.primaryDark }}>Priya Sharma</h2>
             <p style={{ color: theme.colors.secondary, fontWeight: 500 }}>Sr. Field Coordinator - Delhi Zone</p>
             <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>ID: ASHA-4092 • Last Sync: 10 mins ago</p>
             <div style={{ marginTop: '16px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                 <button style={{ ...buttonStyle, backgroundColor: '#eff6ff', color: theme.colors.primary }}>Edit Profile</button>
                 <button style={{ ...buttonStyle, backgroundColor: '#f1f5f9', color: '#475569' }}>View ID Card</button>
             </div>
         </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          <div style={{ ...cardStyle, padding: 0 }}>
             <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderBottom: `1px solid ${theme.colors.border}` }}>
                 <h3 style={{ fontWeight: 700, color: theme.colors.primaryDark }}>General Settings</h3>
             </div>
             <div>
                 <SettingItem icon={Bell} label="Notifications" value="On" />
                 <SettingItem icon={Shield} label="Privacy & Security" />
                 <SettingItem icon={Database} label="Offline Data Storage" value="150 MB Used" />
                 <SettingItem icon={FileText} label="Reports & Logs" isLast />
             </div>
          </div>

          <div style={{ ...cardStyle, padding: 0, height: 'fit-content' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderBottom: `1px solid ${theme.colors.border}` }}>
                 <h3 style={{ fontWeight: 700, color: theme.colors.primaryDark }}>Support</h3>
             </div>
             <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                 <button style={{ ...buttonStyle, width: '100%', border: `1px solid ${theme.colors.border}`, backgroundColor: 'white', color: '#475569' }}>Help Center</button>
                 <button style={{ ...buttonStyle, width: '100%', border: `1px solid ${theme.colors.border}`, backgroundColor: 'white', color: '#475569' }}>Report an Issue</button>
                 <button style={{ 
                     ...buttonStyle, width: '100%', backgroundColor: '#fef2f2', color: '#dc2626', 
                     marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' 
                 }}>
                     <LogOut size={18} /> Log Out
                 </button>
             </div>
          </div>
      </div>
    </div>
  )
}

function SettingItem({ icon: Icon, label, value, isLast }: any) {
    return (
        <div style={{ 
            padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
            cursor: 'pointer', borderBottom: isLast ? 'none' : `1px solid ${theme.colors.border}` 
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#334155' }}>
                <Icon size={18} style={{ color: '#94a3b8' }} />
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{label}</span>
            </div>
            {value ? 
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', backgroundColor: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{value}</span> 
                : <div style={{ color: '#cbd5e1' }}>›</div>
            }
        </div>
    )
}
