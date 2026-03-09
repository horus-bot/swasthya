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
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!cardRef.current) {
      return;
    }

    const card = cardRef.current;
    const icon = card.querySelector("[data-stat-icon]");

    gsap.set(card, { clearProps: "transform" });
    gsap.set(icon, { clearProps: "transform" });

    const enter = () => {
      gsap.to(card, {
        y: -6,
        duration: 0.24,
        ease: "power2.out",
        boxShadow: theme.shadows.card,
      });
      gsap.to(icon, { rotate: -8, scale: 1.08, duration: 0.24, ease: "power2.out" });
    };

    const leave = () => {
      gsap.to(card, { y: 0, duration: 0.24, ease: "power2.out", boxShadow: theme.shadows.sm });
      gsap.to(icon, { rotate: 0, scale: 1, duration: 0.24, ease: "power2.out" });
    };

    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);

    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, [alert, delay]);

  return (
    <div
      ref={cardRef}
      className="panel-surface motion-card reveal-item"
      data-dashboard-item
      style={{
        padding: "18px",
        borderLeft: alert ? `4px solid ${theme.colors.danger}` : `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <p style={{ fontSize: "13px", fontWeight: 700, color: theme.colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</p>
        {Icon ? (
          <div
            data-stat-icon
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: alert ? theme.colors.bgRed : theme.colors.bgBlue,
              color: alert ? theme.colors.danger : theme.colors.primary,
            }}
          >
            <Icon size={18} />
          </div>
        ) : null}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <h3 style={{ 
            fontSize: '30px', 
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: alert ? theme.colors.danger : theme.colors.primaryDark 
        }}>
          {value}
        </h3>
        
        {trend && (
            <span style={{ 
                fontSize: '12px', 
              fontWeight: 700,
              padding: '6px 10px', 
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
