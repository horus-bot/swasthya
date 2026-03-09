"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Calendar, Clock, MapPin, Navigation, Tent, Users, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { theme } from "@/lib/theme";
import { useGsapContext } from "@/hooks/useGsapContext";

type CampFilter = "all" | "today" | "upcoming" | "completed";

const filters: Array<{ id: CampFilter; label: string }> = [
    { id: "all", label: "All routes" },
    { id: "today", label: "Today" },
    { id: "upcoming", label: "Upcoming" },
    { id: "completed", label: "Completed" },
];

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#15803d", bg: "#f0fdf4" },
  closing_soon: { label: "Closing Soon", color: "#b45309", bg: "#fffbeb" },
  scheduled: { label: "Scheduled", color: "#1d4ed8", bg: "#eff6ff" },
  completed: { label: "Completed", color: "#0f9d8a", bg: "#e7fbf7" },
  cancelled: { label: "Cancelled", color: "#b91c1c", bg: "#fef2f2" },
};

function dateBucket(campDate: string): "today" | "upcoming" | "completed" {
  const today = new Date().toISOString().split("T")[0];
  if (campDate === today) return "today";
  if (campDate > today) return "upcoming";
  return "completed";
}

function formatDate(campDate: string): string {
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  if (campDate === today) return "Today";
  if (campDate === tomorrow) return "Tomorrow";
  if (campDate === yesterday) return "Yesterday";
  return new Date(campDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

// Fallback data for offline / no DB rows
const fallbackCamps = [
    { id: "sector-14", name: "Sector 14 Community Hall", location: "Sector 14, Block B, Near Market", camp_date: new Date().toISOString().split("T")[0], start_time: "09:00", end_time: "14:00", camp_type: "General Health & Eye Checkup", patient_count: 45, status: "active", notes: "Two field workers are on queue control and one retina screening station is available." },
    { id: "badli-school", name: "Govt. Primary School", location: "Village Badli, District 4", camp_date: new Date().toISOString().split("T")[0], start_time: "10:00", end_time: "16:00", camp_type: "Maternal Health Screening", patient_count: 72, status: "closing_soon", notes: "Final vaccination check is scheduled for the closing hour. Supplies remain stable." },
    { id: "railway-colony", name: "Railway Colony Center", location: "East Zone, Station Road", camp_date: new Date(Date.now() + 86400000).toISOString().split("T")[0], start_time: "09:00", end_time: null, camp_type: "Diabetes Awareness Camp", patient_count: 0, status: "scheduled", notes: "The local ASHA team will arrive before the mobile unit for setup and registration." },
    { id: "ward-6", name: "Ward 6 Community Center", location: "West District, Ward 6", camp_date: new Date(Date.now() - 86400000).toISOString().split("T")[0], start_time: "08:30", end_time: "13:00", camp_type: "Hypertension Screening", patient_count: 58, status: "completed", notes: "Screening data synced successfully and all follow-up cases were assigned before wrap-up." },
];

export default function CampsPage() {
    const scopeRef = useRef<HTMLDivElement | null>(null);
    const [activeFilter, setActiveFilter] = useState<CampFilter>("today");
    const [campData, setCampData] = useState<any[]>(fallbackCamps);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/camps");
                if (!res.ok) return;
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) setCampData(data);
            } catch { /* keep fallback */ }
        })();
    }, []);

    const visibleCamps = useMemo(() => {
        const mapped = campData.map((c) => ({
            ...c,
            bucket: c.bucket || dateBucket(c.camp_date),
            date: c.date || formatDate(c.camp_date),
            time: c.time || `${c.start_time?.slice(0, 5)} ${c.end_time ? "- " + c.end_time.slice(0, 5) : ""}`.trim(),
            type: c.type || c.camp_type,
            patients: c.patients ?? c.patient_count ?? 0,
            statusColor: (statusMap[c.status] || statusMap.scheduled).color,
            statusBg: (statusMap[c.status] || statusMap.scheduled).bg,
            statusLabel: (statusMap[c.status] || statusMap.scheduled).label,
            note: c.note || c.notes || "",
        }));
        if (activeFilter === "all") return mapped;
        return mapped.filter((camp) => camp.bucket === activeFilter);
    }, [activeFilter, campData]);

    useGsapContext(
        scopeRef,
        () => {
            gsap.fromTo(
                "[data-camp-summary], [data-camp-card]",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.54, stagger: 0.08, ease: "power3.out" }
            );
        },
        [activeFilter]
    );

    const liveCount = campData.filter((camp) => {
        const b = camp.bucket || dateBucket(camp.camp_date);
        return b === "today";
    }).length;
    const totalPatients = campData
        .filter((c) => ["active", "closing_soon"].includes(c.status))
        .reduce((sum, c) => sum + (c.patient_count ?? c.patients ?? 0), 0);

    return (
        <div ref={scopeRef} className="page-wrap page-stack">
            <PageHeader
                eyebrow="Deployment board"
                title="Healthcare Camps"
                subtitle="Manage daily screening camps, staffing, and patient flow from one view."
                badge={`${visibleCamps.length} camps visible`}
            />

            <section className="dashboard-grid">
                <SummaryCampCard label="Live today" value={String(liveCount)} copy="Routes that are actively screening patients right now." icon={Tent} />
                <SummaryCampCard label="Patients in queue" value={String(totalPatients)} copy="Estimated waiting load across the active camp network." icon={Users} />
                <SummaryCampCard label="Next setup" value="09:00 AM" copy="Railway Colony team briefing and deployment start time." icon={Calendar} />
            </section>

            <section className="panel-surface section-card">
                <div className="section-heading" data-camp-summary>
                    <h2>Camp queue</h2>
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

                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {visibleCamps.map((camp: any) => (
                        <CampCard key={camp.id} name={camp.name} location={camp.location} date={camp.date} time={camp.time} type={camp.type} patients={camp.patients} status={camp.statusLabel || camp.status} statusColor={camp.statusColor} statusBg={camp.statusBg} note={camp.note} />
                    ))}
                </div>
            </section>
        </div>
    );
}

function SummaryCampCard({ label, value, copy, icon: Icon }: { label: string; value: string; copy: string; icon: LucideIcon }) {
    return (
        <div className="panel-surface section-card motion-card" data-camp-summary style={{ padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "42px", height: "42px", borderRadius: "14px", backgroundColor: theme.colors.bgBlue, color: theme.colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={18} />
                </div>
                <div>
                    <div style={{ fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase", color: theme.colors.textSecondary, fontWeight: 700 }}>{label}</div>
                    <div style={{ marginTop: "6px", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em" }}>{value}</div>
                </div>
            </div>
            <p style={{ marginTop: "12px", fontSize: "13px", lineHeight: 1.65, color: theme.colors.textSecondary }}>{copy}</p>
        </div>
    );
}

function CampCard({ name, location, date, time, type, patients, status, statusColor = "#15803d", statusBg = "#f0fdf4", note }: {
    name: string;
    location: string;
    date: string;
    time: string;
    type: string;
    patients: number;
    status: string;
    statusColor?: string;
    statusBg?: string;
    note: string;
}) {
    return (
        <div className="panel-surface-strong motion-card" data-camp-card style={{ padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "12px" }}>
                <div>
                    <span style={{ backgroundColor: statusBg, color: statusColor, fontSize: "12px", fontWeight: 700, padding: "4px 8px", borderRadius: theme.borderRadius.sm, textTransform: "uppercase", letterSpacing: "0.025em" }}>
                        {status}
                    </span>
                    <h3 style={{ fontSize: "18px", fontWeight: 700, color: theme.colors.primaryDark, marginTop: "8px" }}>{name}</h3>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#64748b", fontSize: "14px", justifyContent: "flex-end" }}>
                        <Calendar size={14} /> {date}
                    </div>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#475569", fontSize: "14px", marginBottom: "16px" }}>
                <MapPin size={16} style={{ marginTop: "2px", flexShrink: 0 }} />
                <span>{location}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: `1px solid ${theme.colors.border}`, paddingTop: "16px", marginTop: "8px" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Details</span>
                    <span style={{ fontSize: "14px", fontWeight: 500, color: "#334155" }}>{type}</span>
                    <span style={{ fontSize: "12px", color: "#64748b", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                        <Clock size={12} /> {time}
                    </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                    <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Patients</span>
                    <span style={{ fontSize: "20px", fontWeight: 700, color: theme.colors.primary, display: "flex", alignItems: "center", gap: "8px" }}>
                        <Users size={18} /> {patients}
                    </span>
                    <span style={{ fontSize: "12px", color: theme.colors.textSecondary, marginTop: "6px" }}>Queue visible in live dashboard</span>
                </div>
            </div>

            <div style={{ marginTop: "14px", padding: "14px", borderRadius: "18px", backgroundColor: theme.colors.bgLight, border: `1px solid ${theme.colors.border}`, fontSize: "13px", lineHeight: 1.7, color: theme.colors.textSecondary }}>
                {note}
            </div>

            <div style={{ marginTop: "16px", paddingTop: "12px", display: "flex", gap: "12px" }}>
                <button className="button-primary" style={{ flex: 1, minHeight: "44px" }}>
                    Manage Camp
                </button>
                <button className="button-secondary" style={{ minHeight: "44px", minWidth: "44px", padding: "0 14px" }} aria-label="Directions">
                    <Navigation size={20} />
                </button>
            </div>
        </div>
    );
}
