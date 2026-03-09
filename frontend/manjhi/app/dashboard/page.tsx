"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  Droplets,
  Eye,
  HeartPulse,
  MapPin,
  PlusCircle,
  Tent,
  Truck,
  Users,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import AlertCard from "@/components/AlertCard";
import { theme } from "@/lib/theme";
import { useGsapContext } from "@/hooks/useGsapContext";

const kpis = [
  { title: "Today's Visits", value: "124", icon: Users, trend: "+12%", trendUp: true },
  { title: "High-Risk Cases", value: "8", icon: Activity, alert: true },
  { title: "Active Camps", value: "3", icon: Tent, trend: "+1", trendUp: true },
  { title: "Offline Records", value: "15", icon: WifiOff, trend: "Sync due", trendUp: false },
];

const quickActions = [
  { href: "/patient/add", label: "Add patient record", icon: PlusCircle, primary: true },
  { href: "/health-check", label: "Open screenings", icon: ClipboardCheck, primary: false },
  { href: "/mobile-units", label: "Track mobile units", icon: Truck, primary: false },
];

const tools: Array<{
  title: string;
  subtitle: string;
  status: string;
  icon: LucideIcon;
  tone: string;
  statusBg: string;
  statusColor: string;
}> = [
  {
    title: "Retina Scan",
    subtitle: "Diabetic retinopathy detection",
    status: "Online",
    icon: Eye,
    tone: theme.colors.bgBlue,
    statusBg: theme.colors.bgGreen,
    statusColor: theme.colors.success,
  },
  {
    title: "Sugar Strip",
    subtitle: "Blood glucose intake",
    status: "Low stock",
    icon: Droplets,
    tone: theme.colors.bgAmber,
    statusBg: theme.colors.bgAmber,
    statusColor: theme.colors.warning,
  },
  {
    title: "BP Monitor",
    subtitle: "Hypertension tracking",
    status: "Connected",
    icon: HeartPulse,
    tone: theme.colors.bgRed,
    statusBg: theme.colors.bgBlue,
    statusColor: theme.colors.primary,
  },
];

const campSchedule = [
  {
    name: "Sector 14 Community Hall",
    type: "General screening",
    patients: 45,
    time: "09:00 - 14:00",
  },
  {
    name: "Govt School, Village B.",
    type: "Eye checkup",
    patients: 72,
    time: "10:00 - 16:00",
  },
];

const units = [
  { id: "MHU-01", status: "Active", location: "En route to Camp B" },
  { id: "MHU-02", status: "Standby", location: "Base Station" },
];

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useGsapContext(
    containerRef,
    () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          "[data-dashboard-hero]",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.72 }
        )
        .fromTo(
          "[data-dashboard-item]",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.58, stagger: 0.08 },
          "-=0.38"
        );

      gsap.to("[data-pulse-indicator]", {
        scale: 1.08,
        opacity: 0.7,
        duration: 1.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    []
  );

  return (
    <div ref={containerRef} className="page-wrap page-stack">
      <PageHeader
        eyebrow="Live operations"
        title="Field Operations Dashboard"
        subtitle="Overview of camps, patients, and resources for today."
        badge="Synced 2 minutes ago"
      />

      <section
        className="panel-surface hero-copy"
        data-dashboard-hero
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
          gap: "22px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="hero-eyebrow" style={{ width: "fit-content" }}>
            <AlertTriangle size={16} />
            8 urgent follow-ups are waiting for review
          </div>

          <div>
            <h2 style={{ fontSize: "clamp(28px, 3vw, 44px)", lineHeight: 1.02, letterSpacing: "-0.05em" }}>
              Keep camp operations moving without losing sight of the highest-risk patients.
            </h2>
            <p style={{ marginTop: "14px", color: theme.colors.textSecondary, lineHeight: 1.8, maxWidth: "640px" }}>
              Triage flags, unit status, and offline records are consolidated into one daily view so field workers can act quickly instead of switching between disconnected screens.
            </p>
          </div>

          <div className="hero-actions">
            {quickActions.map(({ href, label, icon: Icon, primary }) => (
              <Link
                key={href}
                href={href}
                className={primary ? "button-primary" : "button-secondary"}
              >
                <Icon size={18} />
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="panel-surface-strong" style={{ padding: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="section-heading" style={{ marginBottom: 0 }}>
            <h2>Today at a glance</h2>
            <div className="metric-pill">
              <span data-pulse-indicator style={{ display: "inline-flex", width: "10px", height: "10px", borderRadius: "999px", backgroundColor: theme.colors.secondary }} />
              <span>Field network healthy</span>
            </div>
          </div>

          <div className="grid-auto" style={{ gap: "14px" }}>
            <MiniInsight label="Camp coverage" value="74%" copy="Average zone completion across all active routes." />
            <MiniInsight label="Pending sync" value="15 records" copy="Captured offline and waiting for stable connectivity." />
            <MiniInsight label="Next deployment" value="MHU-03" copy="Leaving base in 18 minutes for Village Badli." />
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        {kpis.map((kpi) => (
          <StatCard key={kpi.title} {...kpi} />
        ))}
      </section>

      <div className="section-grid">
        <section className="panel-surface section-card reveal-item" data-dashboard-item>
          <div className="section-heading">
            <h2>AI health tools</h2>
            <div className="metric-pill">All systems active</div>
          </div>

          <div className="grid-auto grid-auto--three">
            {tools.map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </section>

        <section className="panel-surface section-card reveal-item" data-dashboard-item>
          <div className="section-heading">
            <h2 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <AlertTriangle size={18} style={{ color: theme.colors.danger }} />
              Critical alerts
            </h2>
            <Link href="/alerts" className="button-ghost" style={{ minHeight: "40px" }}>
              Open alert center
              <ArrowRight size={16} />
            </Link>
          </div>

          <AlertCard
            type="critical"
            title="High BP alert"
            message="Patient #4092 (Ramesh K.) requires immediate attention after a 180/110 reading."
            time="10m ago"
          />
          <AlertCard
            type="safe"
            title="Sync complete"
            message="All 15 offline records uploaded successfully after the network stabilized."
            time="1h ago"
          />
        </section>
      </div>

      <div className="section-grid">
        <section className="panel-surface section-card reveal-item" data-dashboard-item>
          <div className="section-heading">
            <h2>Today's camps</h2>
            <Link href="/camps" className="button-ghost" style={{ minHeight: "40px" }}>
              View all camps
            </Link>
          </div>

          <div className="grid-auto">
            {campSchedule.map((camp) => (
              <CampRow key={camp.name} {...camp} />
            ))}
          </div>
        </section>

        <section className="panel-surface section-card reveal-item" data-dashboard-item>
          <div className="section-heading">
            <h2>Mobile health units</h2>
            <Link href="/mobile-units" className="button-ghost" style={{ minHeight: "40px" }}>
              Track routes
            </Link>
          </div>

          <div className="grid-auto">
            {units.map((unit) => (
              <UnitCard key={unit.id} {...unit} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ToolCard({ title, subtitle, status, statusColor, statusBg, icon: Icon, tone }: {
  title: string;
  subtitle: string;
  status: string;
  statusColor: string;
  statusBg: string;
  icon: LucideIcon;
  tone: string;
}) {
  return (
    <div
      className="panel-surface-strong motion-card"
      style={{
        padding: "18px",
        minHeight: "148px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            width: "44px",
            height: "44px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tone,
            color: theme.colors.primary,
          }}
        >
          <Icon size={20} />
        </div>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            padding: "6px 10px",
            borderRadius: "999px",
            color: statusColor,
            backgroundColor: statusBg,
          }}
        >
          {status}
        </span>
      </div>

      <div>
        <h3 style={{ fontWeight: 800, color: theme.colors.primaryDark, letterSpacing: "-0.02em" }}>{title}</h3>
        <p style={{ fontSize: "13px", lineHeight: 1.6, color: theme.colors.textSecondary, marginTop: "6px" }}>{subtitle}</p>
      </div>
    </div>
  );
}

function MiniInsight({ label, value, copy }: { label: string; value: string; copy: string }) {
  return (
    <div className="panel-surface" style={{ padding: "16px" }}>
      <div style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: theme.colors.textSecondary }}>{label}</div>
      <div style={{ marginTop: "8px", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em" }}>{value}</div>
      <p style={{ marginTop: "8px", fontSize: "13px", lineHeight: 1.6, color: theme.colors.textSecondary }}>{copy}</p>
    </div>
  );
}

function CampRow({ name, type, patients, time }: { name: string; type: string; patients: number; time: string }) {
  return (
    <div className="panel-surface-strong motion-card" style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", gap: "12px" }}>
        <h4 style={{ fontWeight: 700 }}>{name}</h4>
        <span
          style={{
            fontSize: "12px",
            padding: "4px 10px",
            backgroundColor: theme.colors.bgBlue,
            borderRadius: "999px",
            color: theme.colors.primary,
            fontWeight: 700,
          }}
        >
          {patients} patients
        </span>
      </div>
      <div style={{ fontSize: "13px", color: theme.colors.textSecondary, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
        <span>{type}</span>
        <span>•</span>
        <span>{time}</span>
        <span>•</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: theme.colors.primary }}>
          <MapPin size={14} />
          Route ready
        </span>
      </div>
    </div>
  );
}

function UnitCard({ id, status, location }: { id: string; status: string; location: string }) {
  const active = status === "Active";

  return (
    <div className="panel-surface-strong motion-card" style={{ padding: "14px", display: "flex", justifyContent: "space-between", gap: "14px" }}>
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "14px", backgroundColor: theme.colors.bgBlue, display: "flex", alignItems: "center", justifyContent: "center", color: theme.colors.primary }}>
          <Truck size={18} />
        </div>
        <div>
          <strong>{id}</strong>
          <div style={{ fontSize: "12px", color: theme.colors.textSecondary }}>{location}</div>
        </div>
      </div>
      <span
        style={{
          fontSize: "12px",
          padding: "4px 8px",
          borderRadius: "999px",
          backgroundColor: active ? theme.colors.bgGreen : theme.colors.bgBlue,
          color: active ? theme.colors.success : theme.colors.secondary,
          height: "fit-content",
          fontWeight: 700,
        }}
      >
        {status}
      </span>
    </div>
  );
}
