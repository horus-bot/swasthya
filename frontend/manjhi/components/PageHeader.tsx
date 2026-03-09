"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function PageHeader({
  title,
  subtitle,
  eyebrow,
  badge,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  badge?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-page-header-item]",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }
        );
      }, ref);

      return () => ctx.revert();
    }
  }, []);

  return (
    <div ref={ref} className="page-header">
      <div className="page-header-copy">
        {eyebrow ? (
          <span className="page-header-kicker" data-page-header-item>
            {eyebrow}
          </span>
        ) : null}
        <h1 className="page-header-title" data-page-header-item>
          {title}
        </h1>
        {subtitle ? (
          <p className="page-header-subtitle" data-page-header-item>
            {subtitle}
          </p>
        ) : null}
      </div>

      {badge ? (
        <div className="metric-pill" data-page-header-item>
          <span>{badge}</span>
        </div>
      ) : null}
    </div>
  );
}
