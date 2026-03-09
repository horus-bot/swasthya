"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import gsap from "gsap";
import { theme } from "@/lib/theme";

type AlertType = "critical" | "safe" | "info";

interface AlertCardProps {
  type: AlertType;
  title: string;
  message: string;
  time?: string;
  delay?: number;
}

export default function AlertCard({ type, title, message, time, delay = 0 }: AlertCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const node = ref.current;

    const enter = () => {
      gsap.to(node, {
        y: -4,
        duration: 0.24,
        ease: "power2.out",
        boxShadow: theme.shadows.card,
      });
    };

    const leave = () => {
      gsap.to(node, {
        y: 0,
        duration: 0.24,
        ease: "power2.out",
        boxShadow: theme.shadows.sm,
      });
    };

    node.addEventListener("mouseenter", enter);
    node.addEventListener("mouseleave", leave);

    return () => {
      node.removeEventListener("mouseenter", enter);
      node.removeEventListener("mouseleave", leave);
    };
  }, [delay]);

  const getStyles = (type: AlertType) => {
      switch(type) {
          case 'critical': return { 
              bg: theme.colors.bgRed, 
              border: theme.colors.danger, 
              text: '#7f1d1d', // red-900 like
              iconColor: theme.colors.danger
           };
          case 'safe': return { 
              bg: theme.colors.bgGreen, 
              border: theme.colors.success, 
              text: '#14532d', // green-900 like
              iconColor: theme.colors.success
          };
          default: return { 
              bg: theme.colors.bgBlue, 
              border: theme.colors.secondary, 
              text: '#1e3a8a', // blue-900 like
              iconColor: theme.colors.secondary
          };
      }
  }

  const { bg, border, text, iconColor } = getStyles(type);
  const Icon = type === 'critical' ? AlertCircle : type === 'safe' ? CheckCircle2 : Info;

  const cardStyle = {
      padding: '18px',
      borderRadius: '20px',
      boxShadow: theme.shadows.sm,
      marginBottom: '12px',
      display: 'flex',
      gap: '12px',
      backgroundColor: bg,
      borderLeft: `4px solid ${border}`,
      color: text,
      border: `1px solid ${theme.colors.border}`,
  };

  return (
    <div ref={ref} style={cardStyle} className="motion-card reveal-item alert-feed-card">
      <Icon style={{ flexShrink: 0, marginTop: '2px', color: iconColor }} size={20} />
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h4 style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>{title}</h4>
            {time && <span style={{ fontSize: '12px', opacity: 0.7 }}>{time}</span>}
        </div>
        <p style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9, lineHeight: 1.5 }}>{message}</p>
      </div>
    </div>
  );
}
