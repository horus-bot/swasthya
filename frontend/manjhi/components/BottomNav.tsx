"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { LayoutDashboard, PlusCircle, Bell, User, Tent } from "lucide-react";

export default function BottomNav() {
  const path = usePathname();
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!navRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-dock-item]",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.48,
          stagger: 0.05,
          ease: "power3.out",
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, [path]);

  if (path === "/" || path === "/login") return null;

  const isActive = (href: string) => path === href || path?.startsWith(href + "/");

  return (
    <nav ref={navRef} className="mobile-dock" aria-label="Mobile navigation">
      <NavItem href="/dashboard" icon={LayoutDashboard} label="Home" active={isActive("/dashboard")} />
      <NavItem href="/camps" icon={Tent} label="Camps" active={isActive("/camps")} />

      <div data-dock-item>
        <Link href="/patient/add" className="dock-fab" aria-label="Add patient">
          <PlusCircle size={28} />
        </Link>
      </div>

      <NavItem href="/alerts" icon={Bell} label="Alerts" active={isActive("/alerts")} />
      <NavItem href="/admin" icon={User} label="Profile" active={isActive("/admin")} />
    </nav>
  );
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link href={href} className={`dock-link${active ? " is-active" : ""}`} data-dock-item>
      <span className="dock-link-bubble">
        <Icon size={22} strokeWidth={active ? 2.6 : 2.1} />
      </span>
      <span>{label}</span>
    </Link>
  );
}
