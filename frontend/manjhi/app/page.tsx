"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import { theme } from "@/lib/theme";

export default function Home() {
  const containerRef = useRef(null);

  useEffect(() => {
     const ctx = gsap.context(() => {
        gsap.from(".entry-element", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });
     }, containerRef);
     return () => ctx.revert();
  }, []);

  const pageStyle = {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'white',
      padding: '24px',
      textAlign: 'center' as 'center'
  };

  const logoStyle = {
      width: '80px', height: '80px',
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius.xl,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontSize: '36px', fontWeight: 'bold',
      marginBottom: '24px', boxShadow: theme.shadows.lg
  }

  const btnStyle = {
      display: 'inline-flex', alignItems: 'center', gap: '8px',
      backgroundColor: theme.colors.primary,
      color: 'white',
      padding: '12px 32px',
      borderRadius: '999px',
      fontWeight: 600,
      fontSize: '18px',
      transition: 'all 0.3s',
      boxShadow: theme.shadows.lg,
      cursor: 'pointer'
  }

  return (
    <div ref={containerRef} style={pageStyle}>
      <div className="entry-element" style={{ ...logoStyle, padding: 8, overflow: 'hidden' }}>
        <img src="/logo.svg" alt="Manjhi logo" style={{ width: 100, height: 100, objectFit: 'contain' }} />
      </div>
      
      <h1 className="entry-element" style={{ 
      }}>
        MANJHI WORKER
      </h1>
      
      <p className="entry-element" style={{ fontSize: '18px', color: theme.colors.textSecondary, maxWidth: '450px', marginBottom: '48px', lineHeight: 1.6 }}>
        Empowering frontline health workers with digital tools for efficient care delivery.
      </p>

      <Link href="/login" className="entry-element" style={btnStyle}>
         Get Started 
         <ArrowRight size={20} />
      </Link>

      <div className="entry-element" style={{ position: 'absolute', bottom: '32px', fontSize: '12px', color: '#94a3b8' }}>
        © 2026 Manjhi Health Foundation
      </div>
    </div>
  );
}
