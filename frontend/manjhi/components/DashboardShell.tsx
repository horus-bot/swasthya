"use client";

import React, { useEffect, useState } from "react";
import { theme } from "@/lib/theme";

export default function DashboardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 🔐 MUST match what you set after login success
    const token = localStorage.getItem("auth_token");

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // 🚫 Prevent hydration mismatch / flicker
  if (!mounted) return null;

  // 🚫 NOT logged in → NO DASHBOARD HEADER
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  // ✅ Logged in → full dashboard shell
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: theme.colors.background,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <header>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: theme.colors.primaryDark,
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              fontSize: "14px",
              color: theme.colors.textSecondary,
            }}
          >
            {subtitle}
          </p>
        )}
      </header>

      {children}
    </main>
  );
}
