"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, Bell, User, Tent } from "lucide-react";
import { theme } from "@/lib/theme";

export default function BottomNav() {
  const path = usePathname();

  const isActive = (href: string) => path === href || path?.startsWith(href + "/");

  const navStyle = {
    backgroundColor: theme.colors.background,
    borderTop: `1px solid ${theme.colors.border}`,
    boxShadow: theme.shadows.sm,
    padding: '8px 16px 16px 16px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'flex-end'
  };

  const fabStyle = {
    position: 'relative' as 'relative',
    top: '-20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '56px',
    height: '56px',
    backgroundColor: theme.colors.primary,
    borderRadius: '50%',
    color: 'white',
    boxShadow: theme.shadows.lg,
  };

  return (
    <nav style={navStyle}>
        <NavItem href="/dashboard" icon={LayoutDashboard} label="Home" active={isActive("/dashboard")} />
        <NavItem href="/camps" icon={Tent} label="Camps" active={isActive("/camps")} />
        
        <div style={fabStyle}>
            <Link href="/patient/add" style={{ color: 'white' }}>
                <PlusCircle size={28} />
            </Link>
        </div>

        <NavItem href="/alerts" icon={Bell} label="Alerts" active={isActive("/alerts")} />
        <NavItem href="/admin" icon={User} label="Profile" active={isActive("/admin")} />
    </nav>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  const itemStyle = {
      display: 'flex',
      flexDirection: 'column' as 'column',
      alignItems: 'center',
      gap: '4px',
      color: active ? theme.colors.primary : '#94a3b8',
      textDecoration: 'none',
      padding: '8px'
  }
  return (
    <Link href={href} style={itemStyle}>
      <Icon size={24} strokeWidth={active ? 2.5 : 2} />
      <span style={{ fontSize: '10px', fontWeight: 500 }}>{label}</span>
    </Link>
  );
}
