"use client";

import { useMemo, useRef, useState } from "react";
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

const campData = [
    {
        id: "sector-14",
        bucket: "today",
        name: "Sector 14 Community Hall",
        location: "Sector 14, Block B, Near Market",
        date: "Today",
        time: "09:00 AM - 02:00 PM",
        type: "General Health & Eye Checkup",
        patients: 45,
        status: "Active",
        statusColor: "#15803d",
        statusBg: "#f0fdf4",
        note: "Two field workers are on queue control and one retina screening station is available.",
    },
    {
        id: "badli-school",
        bucket: "today",
        name: "Govt. Primary School",
        location: "Village Badli, District 4",
        date: "Today",
        time: "10:00 AM - 04:00 PM",
        type: "Maternal Health Screening",
        patients: 72,
        status: "Closing Soon",
        statusColor: "#b45309",
        statusBg: "#fffbeb",
        note: "Final vaccination check is scheduled for the closing hour. Supplies remain stable.",
    },
    {
        id: "railway-colony",
        bucket: "upcoming",
        name: "Railway Colony Center",
        location: "East Zone, Station Road",
        date: "Tomorrow",
        time: "09:00 AM",
        type: "Diabetes Awareness Camp",
        patients: 0,
        status: "Scheduled",
        statusColor: "#1d4ed8",
        statusBg: "#eff6ff",
        note: "The local ASHA team will arrive before the mobile unit for setup and registration.",
    },
    {
        id: "ward-6",
        bucket: "completed",
        name: "Ward 6 Community Center",
        location: "West District, Ward 6",
        date: "Yesterday",
        time: "08:30 AM - 01:00 PM",
        type: "Hypertension Screening",
        patients: 58,
        status: "Completed",
        statusColor: "#0f9d8a",
        statusBg: "#e7fbf7",
        note: "Screening data synced successfully and all follow-up cases were assigned before wrap-up.",
    },
] as const;

export default function CampsPage() {
    const scopeRef = useRef<HTMLDivElement | null>(null);
    const [activeFilter, setActiveFilter] = useState<CampFilter>("today");

    const visibleCamps = useMemo(() => {
        if (activeFilter === "all") {
            return campData;
        }

        return campData.filter((camp) => camp.bucket === activeFilter);
    }, [activeFilter]);

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

    const liveCount = campData.filter((camp) => camp.bucket === "today").length;

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
                <SummaryCampCard label="Patients in queue" value="117" copy="Estimated waiting load across the active camp network." icon={Users} />
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
                    {visibleCamps.map((camp) => (
                        <CampCard key={camp.id} {...camp} />
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
