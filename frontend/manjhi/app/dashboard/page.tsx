"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import {
  Users,
  Activity,
  Tent,
  WifiOff,
  Eye,
  Droplets,
  HeartPulse,
  ClipboardCheck,
  Truck,
  AlertTriangle,
  PlusCircle,
} from "lucide-react";

import PageHeader from "@/components/PageHeader";
import StatCard from "@/components/StatCard";
import AlertCard from "@/components/AlertCard";
import { theme } from "@/lib/theme";

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".dashboard-section", {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        delay: 0.2,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <PageHeader
        title="Field Operations Dashboard"
        subtitle="Overview of camps, patients, and resources for today."
      />

      {/* KPI OVERVIEW */}
      <section
        className="dashboard-section"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px",
        }}
      >
        <StatCard title="Today's Visits" value="124" icon={Users} trend="+12%" trendUp />
        <StatCard title="High-Risk" value="8" icon={Activity} alert />
        <StatCard title="Active Camps" value="3" icon={Tent} />
        <StatCard title="Offline Records" value="15" icon={WifiOff} />
      </section>

      {/* AI TOOLS + ALERTS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        <section className="dashboard-section">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>AI Health Tools</h2>
            <span
              style={{
                fontSize: "12px",
                padding: "4px 8px",
                borderRadius: "999px",
                backgroundColor: theme.colors.bgBlue,
                color: theme.colors.primary,
              }}
            >
              All Systems Active
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
            }}
          >
            <ToolCard title="Retina Scan" subtitle="Diabetic Retinopathy" status="Online" icon={Eye} />
            <ToolCard
              title="Sugar Strip"
              subtitle="Blood Glucose"
              status="Low Stock"
              statusColor={theme.colors.warning}
              statusBg={theme.colors.bgAmber}
              icon={Droplets}
            />
            <ToolCard title="BP Monitor" subtitle="Hypertension" status="Connected" icon={HeartPulse} />
          </div>
        </section>

        <section className="dashboard-section">
          <h2
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              display: "flex",
              gap: "8px",
              marginBottom: "12px",
            }}
          >
            <AlertTriangle size={20} style={{ color: theme.colors.danger }} />
            Critical Alerts
          </h2>

          <AlertCard
            type="critical"
            title="High BP Alert"
            message="Patient #4092 (Ramesh K.) requires immediate attention."
            time="10m ago"
          />
          <AlertCard
            type="safe"
            title="Sync Complete"
            message="All 15 offline records uploaded successfully."
            time="1h ago"
          />
        </section>
      </div>

      {/* PRIMARY ACTION BUTTON */}
      <button
        className="dashboard-section"
        onClick={() => router.push("/patient/add")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 20px",
          borderRadius: theme.borderRadius.lg,
          backgroundColor: theme.colors.primary,
          color: "white",
          fontSize: "15px",
          fontWeight: 600,
          cursor: "pointer",
          boxShadow: theme.shadows.sm,
          width: "fit-content",
        }}
      >
        <PlusCircle size={20} />
        Add / Check Patient Health Record
      </button>

      {/* CAMPS + MOBILE UNITS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
        }}
      >
        <section className="dashboard-section">
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>
            Today's Camps
          </h2>
          <CampRow
            name="Sector 14 Community Hall"
            type="General Screening"
            patients={45}
            time="09:00 - 14:00"
          />
          <CampRow
            name="Govt School, Village B."
            type="Eye Checkup"
            patients={72}
            time="10:00 - 16:00"
          />
        </section>

        <section className="dashboard-section">
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "12px" }}>
            Mobile Health Units
          </h2>
          <UnitCard id="MHU-01" status="Active" location="En route to Camp B" />
          <UnitCard id="MHU-02" status="Standby" location="Base Station" />
        </section>
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

function ToolCard({ title, subtitle, status, statusColor, statusBg, icon: Icon }: any) {
  return (
    <div
      style={{
        backgroundColor: "white",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        padding: "16px",
        boxShadow: theme.shadows.sm,
        height: "128px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            padding: "8px",
            borderRadius: theme.borderRadius.md,
            backgroundColor: theme.colors.bgBlue,
            color: theme.colors.primary,
          }}
        >
          <Icon size={20} />
        </div>
        <span
          style={{
            fontSize: "10px",
            fontWeight: "bold",
            padding: "4px 8px",
            borderRadius: "999px",
            color: statusColor || theme.colors.success,
            backgroundColor: statusBg || theme.colors.bgGreen,
          }}
        >
          {status}
        </span>
      </div>

      <div>
        <h3 style={{ fontWeight: "bold", color: theme.colors.primaryDark }}>{title}</h3>
        <p style={{ fontSize: "12px", color: theme.colors.textSecondary }}>{subtitle}</p>
      </div>
    </div>
  );
}

function CampRow({ name, type, patients, time }: any) {
  return (
    <div
      style={{
        padding: "16px",
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <h4 style={{ fontWeight: 600 }}>{name}</h4>
        <span
          style={{
            fontSize: "12px",
            padding: "2px 8px",
            backgroundColor: theme.colors.bgBlue,
            borderRadius: "4px",
          }}
        >
          {patients} Patients
        </span>
      </div>
      <div style={{ fontSize: "12px", color: theme.colors.textSecondary }}>
        {type} • {time}
      </div>
    </div>
  );
}

function UnitCard({ id, status, location }: any) {
  const active = status === "Active";

  return (
    <div
      style={{
        padding: "12px",
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: "white",
        boxShadow: theme.shadows.sm,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <Truck size={18} />
        <div>
          <strong>{id}</strong>
          <div style={{ fontSize: "12px", color: theme.colors.textSecondary }}>{location}</div>
        </div>
      </div>
      <span
        style={{
          fontSize: "12px",
          padding: "4px 8px",
          borderRadius: "4px",
          backgroundColor: active ? theme.colors.bgGreen : theme.colors.bgBlue,
          color: active ? theme.colors.success : theme.colors.secondary,
        }}
      >
        {status}
      </span>
    </div>
  );
}
