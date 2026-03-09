"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";
import { theme } from "@/lib/theme";
import { useGsapContext } from "@/hooks/useGsapContext";

export default function LoginPage() {
    const router = useRouter();
    const pageRef = useRef<HTMLDivElement | null>(null);

    useGsapContext(
        pageRef,
        () => {
            const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

            timeline
                .fromTo(
                    "[data-login-copy]",
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.62, stagger: 0.08 }
                )
                .fromTo(
                    "[data-login-card]",
                    { opacity: 0, y: 28, scale: 0.98 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.74 },
                    "-=0.28"
                );

            gsap.to("[data-login-glow]", {
                y: -12,
                duration: 2.8,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });
        },
        []
    );

    useEffect(() => {
        if (localStorage.getItem("auth_token")) {
            router.replace("/dashboard");
        }
    }, [router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        localStorage.setItem("auth_token", `manjhi-session-${Date.now()}`);
        router.push("/dashboard");
    };

    const inputStyle = {
        width: "100%",
        padding: "14px 16px",
        borderRadius: theme.borderRadius.lg,
        border: `1px solid ${theme.colors.border}`,
        outline: "none",
        transition: "all 0.2s",
        fontSize: "15px",
        backgroundColor: "rgba(255, 255, 255, 0.86)",
    };

    return (
        <div ref={pageRef} className="page-wrap page-wrap--narrow" style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
            <div className="hero-grid" style={{ alignItems: "stretch", width: "100%" }}>
                <div className="panel-surface hero-copy" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                    <Link href="/" className="button-ghost" style={{ width: "fit-content" }} data-login-copy>
                        <ArrowLeft size={16} />
                        Back to home
                    </Link>

                    <div className="hero-eyebrow" data-login-copy>
                        <ShieldCheck size={16} />
                        Secure health worker access
                    </div>

                    <h1 className="hero-title" style={{ fontSize: "clamp(34px, 5vw, 56px)" }} data-login-copy>
                        Start your next field shift with a quieter, smarter workflow.
                    </h1>

                    <p className="hero-subtitle" data-login-copy>
                        Manjhi keeps screening, camp coordination, and patient follow-up in one focused interface built for outreach teams and mobile health units.
                    </p>

                    <div className="grid-auto grid-auto--two">
                        <div className="insight-card" data-login-copy>
                            <div className="insight-card-title">Ready for the field</div>
                            <div className="insight-card-value">2 min</div>
                            <p className="insight-card-copy">Average time to log in, sync, and open your dashboard for the day.</p>
                        </div>
                        <div className="insight-card" data-login-copy data-login-glow>
                            <div className="insight-card-title">Protected sessions</div>
                            <div className="insight-card-value">Encrypted</div>
                            <p className="insight-card-copy">Designed for sensitive health data, remote camps, and fast handoffs between teams.</p>
                        </div>
                    </div>
                </div>

                <div className="panel-surface-strong" data-login-card style={{ padding: "30px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ textAlign: "center", marginBottom: "28px" }}>
                        <div
                            style={{
                                width: "58px",
                                height: "58px",
                                margin: "0 auto 16px",
                                borderRadius: "18px",
                                background: "linear-gradient(135deg, #114c7a, #2563eb)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                boxShadow: theme.shadows.glow,
                            }}
                        >
                            <Lock size={24} />
                        </div>
                        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.04em", color: theme.colors.primaryDark }}>Welcome back</h1>
                        <p style={{ color: theme.colors.textSecondary, marginTop: "8px", lineHeight: 1.6 }}>Sign in to access live field tools, triage workflows, and mobile unit tracking.</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "8px", letterSpacing: "0.12em" }}>Worker ID</label>
                            <input type="text" placeholder="e.g. ASHA-4092" style={inputStyle} required />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: "#64748b", marginBottom: "8px", letterSpacing: "0.12em" }}>Passcode</label>
                            <input type="password" placeholder="Enter your secure passcode" style={inputStyle} required />
                        </div>

                        <button type="submit" className="button-primary" style={{ width: "100%", marginTop: "6px" }}>
                            Secure login
                            <Lock size={18} />
                        </button>
                    </form>

                    <p style={{ textAlign: "center", fontSize: "12px", color: "#7b8ba2", marginTop: "22px" }}>
                        Authorized personnel only • Encrypted session • Offline mode supported
                    </p>
                </div>
            </div>
        </div>
    );
}

