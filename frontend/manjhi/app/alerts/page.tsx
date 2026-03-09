"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { AlertTriangle, Bell, CheckCircle2, Info, ShieldCheck, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import AlertCard from "@/components/AlertCard";
import { theme } from "@/lib/theme";
import { useGsapContext } from "@/hooks/useGsapContext";

type AlertTone = "critical" | "safe" | "info";
type AlertFilter = "all" | AlertTone;

interface AlertItem {
  id: string;
  type: AlertTone;
  title: string;
  message: string;
  time: string;
}

// Map notification_types to AlertTone
function mapTypeName(typeName: string | undefined): AlertTone {
  if (!typeName) return "info";
  const lower = typeName.toLowerCase();
  if (lower.includes("critical") || lower.includes("alert") || lower.includes("urgent")) return "critical";
  if (lower.includes("resolved") || lower.includes("success") || lower.includes("safe")) return "safe";
  return "info";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// Static fallback for when DB is empty
const fallbackAlerts: AlertItem[] = [
  { id: "high-bp", type: "critical", title: "High BP Alert", message: "Patient #4092 (Ramesh K.) detected with 180/110 mmHg. Immediate follow-up required.", time: "12m ago" },
  { id: "low-stock", type: "critical", title: "Low Inventory", message: "Glucometer strips running low at Camp Sector 14. Remaining: 12.", time: "45m ago" },
  { id: "sync-success", type: "safe", title: "Data Sync Successful", message: "All offline records from yesterday were uploaded to the central server.", time: "2h ago" },
  { id: "shift-assignment", type: "info", title: "Shift Assignment", message: "You have been assigned to Mobile Unit 02 for tomorrow's maternal health route.", time: "5h ago" },
  { id: "system-update", type: "info", title: "System Update", message: "App maintenance is scheduled for tonight at 02:00 AM.", time: "1d ago" },
];

const filters: Array<{ id: AlertFilter; label: string }> = [
  { id: "all", label: "All" },
  { id: "critical", label: "Critical" },
  { id: "safe", label: "Resolved" },
  { id: "info", label: "System" },
];

export default function AlertsPage() {
  const scopeRef = useRef<HTMLDivElement | null>(null);
  const [activeFilter, setActiveFilter] = useState<AlertFilter>("all");
  const [alertFeed, setAlertFeed] = useState<AlertItem[]>(fallbackAlerts);

  // Fetch notifications from API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAlertFeed(
            data.map((n: any) => ({
              id: n.id,
              type: mapTypeName(n.notification_types?.type_name),
              title: n.title || "Notification",
              message: n.message || "",
              time: timeAgo(n.created_at),
            }))
          );
        }
      } catch {
        // keep fallback data on failure
      }
    })();
  }, []);

  const filteredAlerts = useMemo(() => {
    if (activeFilter === "all") {
      return alertFeed;
    }

    return alertFeed.filter((alert) => alert.type === activeFilter);
  }, [activeFilter, alertFeed]);

  useGsapContext(
    scopeRef,
    () => {
      gsap.fromTo(
        "[data-alert-summary], .alert-feed-card",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" }
      );
    },
    [activeFilter]
  );

  const criticalCount = alertFeed.filter((alert) => alert.type === "critical").length;
  const resolvedCount = alertFeed.filter((alert) => alert.type === "safe").length;
  const infoCount = alertFeed.filter((alert) => alert.type === "info").length;

  return (
    <div ref={scopeRef} className="page-wrap page-stack">
      <PageHeader
        eyebrow="Action center"
        title="Alerts & Notifications"
        subtitle="Real-time updates on critical patient status, data sync, and operational events."
        badge={`${filteredAlerts.length} alerts in view`}
      />

      <section className="dashboard-grid">
        <SummaryCard icon={AlertTriangle} label="Requires action" value={String(criticalCount)} tone={theme.colors.bgRed} iconColor={theme.colors.danger} />
        <SummaryCard icon={CheckCircle2} label="Resolved today" value={String(resolvedCount)} tone={theme.colors.bgGreen} iconColor={theme.colors.success} />
        <SummaryCard icon={Info} label="System updates" value={String(infoCount)} tone={theme.colors.bgBlue} iconColor={theme.colors.primary} />
        <SummaryCard icon={ShieldCheck} label="Protected delivery" value="100%" tone={theme.colors.bgTeal} iconColor={theme.colors.secondary} />
      </section>

      <section className="panel-surface section-card">
        <div className="section-heading" data-alert-summary>
          <h2 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Bell size={18} />
            Live feed
          </h2>
          <div className="chip-row">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={`filter-chip${activeFilter === filter.id ? " is-active" : ""}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              type={alert.type}
              title={alert.title}
              message={alert.message}
              time={alert.time}
            />
          ))}
        </div>
      </section>

      <section className="panel-surface section-card" data-alert-summary>
        <div className="section-heading">
          <h2>What needs attention next</h2>
        </div>
        <div className="grid-auto grid-auto--three">
          <NextStepCard title="Escalate critical patients" copy="Route high-risk BP and glucose alerts to the next available coordinator within the next 30 minutes." />
          <NextStepCard title="Restock supplies" copy="Sector 14 requires a strip refill before the evening screening block begins." />
          <NextStepCard title="Review unit assignment" copy="Mobile Unit 02 is set for tomorrow's maternal health route and is ready for deployment." />
        </div>
      </section>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, tone, iconColor }: { icon: LucideIcon; label: string; value: string; tone: string; iconColor: string }) {
  return (
    <div className="panel-surface section-card motion-card" data-alert-summary style={{ padding: "18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "42px", height: "42px", borderRadius: "14px", backgroundColor: tone, color: iconColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={18} />
        </div>
        <div>
          <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", color: theme.colors.textSecondary, fontWeight: 700 }}>{label}</div>
          <div style={{ marginTop: "6px", fontSize: "30px", fontWeight: 800, letterSpacing: "-0.04em" }}>{value}</div>
        </div>
      </div>
    </div>
  );
}

function NextStepCard({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="panel-surface-strong motion-card" style={{ padding: "18px" }}>
      <h3 style={{ fontSize: "16px", fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</h3>
      <p style={{ marginTop: "10px", fontSize: "14px", lineHeight: 1.7, color: theme.colors.textSecondary }}>{copy}</p>
    </div>
  );
}
