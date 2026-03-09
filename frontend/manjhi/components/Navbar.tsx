"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tent, Bell, LogOut, Settings } from "lucide-react";
import { theme } from "@/lib/theme";

export default function Navbar() {
  const pathname = usePathname();

  // ❌ Hide navbar on auth pages
  if (pathname === "/login") return null;

  const containerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: "0 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
  };

  const headerStyle = {
    width: "100%",
    height: "64px",
    backgroundColor: theme.colors.background,
    borderBottom: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
  };

  const navLinkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#475569",
    textDecoration: "none",
    transition: "color 0.2s",
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: theme.borderRadius.md,
              overflow: "hidden",
            }}
          >
            <img src="/logo.svg" alt="Manjhi logo" style={{ width: 60, height: 60, objectFit: "contain" }} />
          </div>
          <h1
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              letterSpacing: "-0.5px",
              color: theme.colors.primaryDark,
            }}
          >
            MANJHI WORKER
          </h1>
        </div>

        {/* Navigation */}
        <nav style={{ display: "flex", gap: "32px" }}>
          <Link href="/dashboard" style={navLinkStyle}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/camps" style={navLinkStyle}>
            <Tent size={18} /> Camps
          </Link>
          <Link href="/alerts" style={navLinkStyle}>
            <Bell size={18} /> Alerts
          </Link>
        </nav>

        {/* User Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: theme.colors.primaryDark,
                margin: 0,
              }}
            >
              Priya Sharma
            </p>
            <p
              style={{
                fontSize: "12px",
                color: theme.colors.textSecondary,
                margin: 0,
              }}
            >
              Sr. Field Coordinator
            </p>
          </div>

          <div
            style={{
              height: "32px",
              width: "1px",
              backgroundColor: "#e2e8f0",
            }}
          />

          <button
            aria-label="Settings"
            style={{ padding: "8px", color: theme.colors.textSecondary }}
          >
            <Settings size={20} />
          </button>

          <Link
            href="/login"
            aria-label="Logout"
            style={{ padding: "8px", color: theme.colors.textSecondary }}
          >
            <LogOut size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
