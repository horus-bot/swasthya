"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ArrowRight, Lock } from "lucide-react";
import { theme } from "@/lib/theme";

export default function LoginPage() {
  const router = useRouter();
  const formRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(formRef.current, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
    );
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const inputStyle = {
      width: '100%',
      padding: '12px 16px',
      borderRadius: theme.borderRadius.md,
      border: `1px solid ${theme.colors.border}`,
      outline: 'none',
      transition: 'all 0.2s',
      fontSize: '16px'
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background, padding: '16px' }}>
      <div ref={formRef} style={{ 
          width: '100%', maxWidth: '400px', backgroundColor: 'white', padding: '32px', 
          borderRadius: theme.borderRadius.xl, boxShadow: theme.shadows.floating, border: `1px solid ${theme.colors.border}` 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ 
                width: '48px', height: '48px', backgroundColor: theme.colors.primary, 
                borderRadius: theme.borderRadius.md, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                color: 'white', fontWeight: 'bold', fontSize: '20px', margin: '0 auto 16px auto' 
            }}>M</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: theme.colors.primaryDark }}>Welcome Back</h1>
            <p style={{ color: theme.colors.textSecondary, marginTop: '4px' }}>Sign in to access field tools</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Worker ID</label>
                <input 
                    type="text" 
                    placeholder="e.g. ASHA-4092" 
                    style={inputStyle}
                    required
                />
            </div>
            
            <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>Passcode</label>
                <input 
                    type="password" 
                    placeholder="••••••" 
                    style={inputStyle}
                    required
                />
            </div>

            <button type="submit" style={{ 
                width: '100%', backgroundColor: theme.colors.primary, color: 'white', fontWeight: 'bold', 
                padding: '14px', borderRadius: theme.borderRadius.lg, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                gap: '8px', marginTop: '8px', cursor: 'pointer', boxShadow: theme.shadows.sm 
            }}>
                Secure Login <Lock size={18} />
                

            </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '24px' }}>
            Authorized Personnel Only • Encrypted Connection
        </p>
      </div>
    </div>
  );
}

