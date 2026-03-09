"use client";
import PageHeader from "@/components/PageHeader";
import { Eye, Droplets, HeartPulse, Activity } from "lucide-react";
import { theme } from "@/lib/theme";

export default function HealthCheckPage() {
  const cardStyle = {
      backgroundColor: 'white',
      borderRadius: theme.borderRadius.xl,
      boxShadow: theme.shadows.sm,
      border: `1px solid ${theme.colors.border}`,
      padding: '24px'
  };

  const tableHeaderStyle = {
      fontSize: '12px',
      color: '#64748b',
      textTransform: 'uppercase' as const,
      backgroundColor: '#f8fafc',
      padding: '12px 16px',
      textAlign: 'left' as const,
      fontWeight: 600
  };

  const tableCellStyle = {
      padding: '12px 16px',
      borderBottom: `1px solid ${theme.colors.border}`,
      fontSize: '14px',
      color: '#334155'
  };

  return (
    <div style={{ padding: '16px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader title="AI Health Assessment" subtitle="Select a tool to begin patient screening." />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <ToolCardLarge 
            title="Retina Scan" 
            desc="Detect Diabetic Retinopathy signs early using mobile camera."
            icon={Eye}
            bg="#eff6ff"
            color="#1d4ed8"
          />
          <ToolCardLarge 
            title="Blood Glucose" 
            desc="Connect sugar strip analyzer via Bluetooth or manual entry."
            icon={Droplets}
            bg="#fffbeb"
            color="#b45309"
          />
           <ToolCardLarge 
            title="Blood Pressure" 
            desc="Standard BP monitoring and trend analysis."
            icon={HeartPulse}
            bg="#fef2f2"
            color="#b91c1c"
          />
      </div>

      <div style={cardStyle}>
          <h3 style={{ fontWeight: 700, fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: theme.colors.primaryDark }}>
              <Activity size={20} color={theme.colors.primary} />
              Recent Screenings
          </h3>
          <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr>
                          <th style={{ ...tableHeaderStyle, borderTopLeftRadius: '8px', borderBottomLeftRadius: '8px' }}>Patient</th>
                          <th style={tableHeaderStyle}>Test Type</th>
                          <th style={tableHeaderStyle}>Result</th>
                          <th style={tableHeaderStyle}>Date</th>
                          <th style={{ ...tableHeaderStyle, borderTopRightRadius: '8px', borderBottomRightRadius: '8px' }}>Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td style={{ ...tableCellStyle, fontWeight: 500 }}>Ramesh Kumar</td>
                          <td style={tableCellStyle}>Retina Scan</td>
                          <td style={tableCellStyle}>Mild NPDR detected</td>
                          <td style={{ ...tableCellStyle, color: '#64748b' }}>Today, 10:30 AM</td>
                          <td style={tableCellStyle}><span style={{ fontSize: '12px', backgroundColor: '#fef2f2', color: '#b91c1c', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Flagged</span></td>
                      </tr>
                      <tr>
                          <td style={{ ...tableCellStyle, fontWeight: 500 }}>Sita Devi</td>
                          <td style={tableCellStyle}>Blood Pressure</td>
                          <td style={tableCellStyle}>120/80 mmHg</td>
                          <td style={{ ...tableCellStyle, color: '#64748b' }}>Today, 09:15 AM</td>
                          <td style={tableCellStyle}><span style={{ fontSize: '12px', backgroundColor: '#f0fdf4', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>Normal</span></td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  )
}

function ToolCardLarge({ title, desc, icon: Icon, bg, color }: any) {
    return (
        <div style={{ 
            backgroundColor: 'white', padding: '24px', borderRadius: theme.borderRadius.xl, 
            boxShadow: theme.shadows.sm, border: `1px solid ${theme.colors.border}`, 
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', 
            textAlign: 'center', gap: '16px', transition: 'box-shadow 0.2s' 
        }}>
            <div style={{ 
                width: '64px', height: '64px', borderRadius: theme.borderRadius.lg, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                backgroundColor: bg, color: color 
            }}>
                <Icon size={32} />
            </div>
            <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: theme.colors.primaryDark }}>{title}</h3>
                <p style={{ fontSize: '14px', color: theme.colors.textSecondary, marginTop: '8px', lineHeight: 1.6 }}>{desc}</p>
            </div>
            <button style={{ 
                marginTop: '8px', width: '100%', padding: '10px', borderRadius: theme.borderRadius.lg, 
                border: `1px solid ${theme.colors.border}`, fontSize: '14px', fontWeight: 600, 
                backgroundColor: 'white', color: theme.colors.text, cursor: 'pointer' 
            }}>
                Start Screening
            </button>
        </div>
    )
}
