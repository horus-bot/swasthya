"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { theme } from "@/lib/theme";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: any;
  trend?: string;
  trendUp?: boolean;
  alert?: boolean;
  delay?: number;
}

export default function StatCard({ title, value, icon: Icon, trend, trendUp, alert, delay = 0 }: StatCardProps) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(cardRef.current, 
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: delay, ease: "power2.out" }
    );
  }, [delay]);

  const style = {
      backgroundColor: theme.colors.background,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.lg,
      padding: '16px',
      boxShadow: theme.shadows.sm,
      borderLeftWidth: alert ? '4px' : '1px',
      borderLeftColor: alert ? theme.colors.danger : theme.colors.border
  }

  return (
    <div ref={cardRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>{title}</p>
        {Icon && <Icon size={18} style={{ color: '#94a3b8' }} />}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <h3 style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: alert ? theme.colors.danger : theme.colors.primaryDark 
        }}>
          {value}
        </h3>
        
        {trend && (
            <span style={{ 
                fontSize: '12px', 
                fontWeight: 500, 
                padding: '2px 8px', 
                borderRadius: '999px',
                backgroundColor: trendUp ? theme.colors.bgGreen : theme.colors.bgRed,
                color: trendUp ? theme.colors.success : theme.colors.danger
            }}>
                {trend}
            </span>
        )}
      </div>
    </div>
  );
}
