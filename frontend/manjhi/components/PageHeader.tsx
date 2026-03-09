"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { theme } from "@/lib/theme";

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check auth AFTER client mounts
  useEffect(() => {
    const token = localStorage.getItem("auth_token"); 
    // 👆 use the SAME key you set on login

    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // ❌ Not authenticated → render NOTHING
  if (!isAuthenticated) return null;

  // ✅ Animate ONLY after auth
  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div ref={ref} style={{ marginBottom: "24px" }}>
      <h1
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          letterSpacing: "-0.5px",
          color: theme.colors.primaryDark,
          marginBottom: "4px",
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            fontSize: "14px",
            fontWeight: 500,
            color: theme.colors.textSecondary,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
