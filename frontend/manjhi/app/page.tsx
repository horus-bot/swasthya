"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import {
  Activity,
  ArrowRight,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Tent,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { theme } from "@/lib/theme";
import { useGsapContext } from "@/hooks/useGsapContext";

const heroStats = [
  { label: "Villages connected", value: "128" },
  { label: "Patients screened", value: "3.4k" },
  { label: "Offline sync success", value: "99.2%" },
];

const workflowCards: Array<{ title: string; copy: string; icon: LucideIcon; tone: string }> = [
  {
    title: "Rapid triage",
    copy: "Capture symptoms, vitals, and risk flags in one field-ready flow.",
    icon: Activity,
    tone: theme.colors.bgBlue,
  },
  {
    title: "Camp coordination",
    copy: "Track deployments, manage queues, and move units with live status updates.",
    icon: Tent,
    tone: theme.colors.bgAmber,
  },
  {
    title: "Secure follow-up",
    copy: "Keep health records synced and audit-ready even when connectivity drops.",
    icon: ShieldCheck,
    tone: theme.colors.bgGreen,
  },
];

const insightCards = [
  {
    title: "Today",
    value: "14 camps",
    copy: "Frontline teams are spread across Delhi, Badli, and three mobile routes.",
  },
  {
    title: "Critical follow-ups",
    value: "8 cases",
    copy: "Hypertension and diabetes flags are queued for rapid intervention.",
  },
  {
    title: "Offline buffer",
    value: "2h safe",
    copy: "Teams can continue intake locally and sync later without losing records.",
  },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const primaryButtonRef = useRef<HTMLAnchorElement | null>(null);

  useGsapContext(
    containerRef,
    () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(
          "[data-hero-copy]",
          { y: 28, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }
        )
        .fromTo(
          "[data-hero-card]",
          { y: 34, opacity: 0, rotate: 1.8 },
          { y: 0, opacity: 1, rotate: 0, duration: 0.8, stagger: 0.1 },
          "-=0.4"
        );

      gsap.to("[data-float-card]", {
        y: -10,
        duration: 2.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.18,
      });
    },
    []
  );

  useEffect(() => {
    const button = primaryButtonRef.current;

    if (!button) {
      return;
    }

    const handleMove = (event: MouseEvent) => {
      const bounds = button.getBoundingClientRect();
      const offsetX = event.clientX - (bounds.left + bounds.width / 2);
      const offsetY = event.clientY - (bounds.top + bounds.height / 2);

      gsap.to(button, {
        x: offsetX * 0.14,
        y: offsetY * 0.18,
        duration: 0.22,
        ease: "power2.out",
      });
    };

    const reset = () => {
      gsap.to(button, { x: 0, y: 0, duration: 0.28, ease: "power2.out" });
    };

    button.addEventListener("mousemove", handleMove);
    button.addEventListener("mouseleave", reset);

    return () => {
      button.removeEventListener("mousemove", handleMove);
      button.removeEventListener("mouseleave", reset);
    };
  }, []);

  return (
    <div ref={containerRef} className="page-wrap page-stack" style={{ paddingTop: "32px" }}>
      <section className="hero-grid">
        <div className="panel-surface hero-copy" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="hero-eyebrow" data-hero-copy>
            <Sparkles size={16} />
            Built for frontline health teams
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }} data-hero-copy>
            <div
              style={{
                width: "74px",
                height: "74px",
                borderRadius: theme.borderRadius.xl,
                background: "linear-gradient(135deg, rgba(17, 76, 122, 0.12), rgba(15, 157, 138, 0.14))",
                border: `1px solid ${theme.colors.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <img src="/logo.svg" alt="Manjhi logo" style={{ width: 96, height: 96, objectFit: "contain" }} />
            </div>
            <div>
              <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.16em", color: theme.colors.textSecondary, fontWeight: 700 }}>
                Manjhi Worker
              </p>
              <p style={{ fontSize: "14px", color: theme.colors.textSecondary }}>Digital field command for outreach, screening, and follow-up care.</p>
            </div>
          </div>

          <h1 className="hero-title" data-hero-copy>
            Field operations that feel calm even when the day is chaotic.
          </h1>

          <p className="hero-subtitle" data-hero-copy>
            Coordinate camps, capture vitals, flag critical patients, and keep records safe in low-connectivity environments with one focused workspace for health workers.
          </p>

          <div className="hero-actions" data-hero-copy>
            <Link href="/login" ref={primaryButtonRef} className="button-primary">
              Start field session
              <ArrowRight size={18} />
            </Link>
            <Link href="/dashboard" className="button-secondary">
              Preview live dashboard
            </Link>
          </div>

          <div className="stat-strip" data-hero-copy>
            {heroStats.map((stat) => (
              <div key={stat.label} className="stat-strip-card">
                <div className="stat-strip-label">{stat.label}</div>
                <div className="stat-strip-value">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-surface insight-stack">
          <div className="floating-chip" data-hero-card>
            <Wifi size={14} />
            Offline resilient sync
          </div>

          {insightCards.map((card, index) => (
            <div key={card.title} className="insight-card" data-hero-card data-float-card>
              <div className="insight-card-title">{card.title}</div>
              <div className="insight-card-value">{card.value}</div>
              <p className="insight-card-copy">{card.copy}</p>
              {index === 1 ? (
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "12px", color: theme.colors.danger, fontWeight: 700, fontSize: "13px" }}>
                  <HeartPulse size={16} />
                  Escalation lane active
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="panel-surface section-card">
        <div className="section-heading" data-hero-copy>
          <h2>Why teams rely on Manjhi</h2>
          <div className="metric-pill">
            <span>One interface for outreach, care, and sync</span>
          </div>
        </div>

        <div className="grid-auto grid-auto--three">
          {workflowCards.map(({ title, copy, icon: Icon, tone }) => (
            <div
              key={title}
              className="panel-surface-strong motion-card"
              data-hero-card
              style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div
                style={{
                  width: "54px",
                  height: "54px",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: tone,
                  color: theme.colors.primaryDark,
                }}
              >
                <Icon size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, letterSpacing: "-0.02em" }}>{title}</h3>
                <p style={{ marginTop: "8px", fontSize: "14px", lineHeight: 1.7, color: theme.colors.textSecondary }}>{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ textAlign: "center", fontSize: "12px", color: "#7b8ba2", paddingBottom: "16px" }}>
        © 2026 Manjhi Health Foundation
      </div>
    </div>
  );
}
