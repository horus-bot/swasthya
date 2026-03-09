"use client";
import PageHeader from "@/components/PageHeader";
import AlertCard from "@/components/AlertCard";
import { theme } from "@/lib/theme";

export default function AlertsPage() {
  return (
    <div style={{ padding: '16px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <PageHeader title="Alerts & Notifications" subtitle="Real-time updates on critical patient status and system events." />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
            <h3 style={{ 
                fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', 
                letterSpacing: '0.05em', marginBottom: '12px' 
            }}>Critical (Requires Action)</h3>
             <AlertCard type="critical" title="High BP Alert" message="Patient #4092 (Ramesh K.) detected with 180/110 mmHg. Immediate follow-up required." time="12m ago" delay={0.1} />
             <AlertCard type="critical" title="Low Inventory" message="Glucometer strips running low at Camp Sector 14. Remaining: 12." time="45m ago" delay={0.2} />
        </div>

        <div>
            <h3 style={{ 
                fontSize: '14px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', 
                letterSpacing: '0.05em', marginBottom: '12px' 
            }}>Recent Activity</h3>
             <AlertCard type="safe" title="Data Sync Successful" message="All varied offline records from yesterday successfully uploaded to central server." time="2h ago" delay={0.3} />
             <AlertCard type="info" title="Shift Assignment" message="You have been assigned to 'Mobile Unit 02' for tomorrow (Feb 11)." time="5h ago" delay={0.4} />
             <AlertCard type="info" title="System Update" message="App scheduled for maintenance tonight at 02:00 AM." time="1d ago" delay={0.5} />
        </div>
      </div>
    </div>
  )
}
