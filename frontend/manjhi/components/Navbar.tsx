"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { LayoutDashboard, Tent, Bell, LogOut, Settings } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!navRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-nav-item]",
        { opacity: 0, y: -12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.54,
          stagger: 0.06,
          ease: "power3.out",
        }
      );
    }, navRef);

    return () => ctx.revert();
  }, [pathname]);

  if (pathname === "/" || pathname === "/login") return null;

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/camps", label: "Camps", icon: Tent },
    { href: "/alerts", label: "Alerts", icon: Bell },
  ];

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  return (
    <header ref={navRef} className="nav-shell">
      <div className="nav-brand" data-nav-item>
        <div className="nav-brand-mark">
          <img src="/logo.svg" alt="Manjhi logo" style={{ width: 70, height: 70, objectFit: "contain" }} />
        </div>
        <div className="nav-brand-copy">
          <strong>MANJHI WORKER</strong>
          <span>Frontline operations</span>
        </div>
      </div>

      <nav className="nav-links" aria-label="Primary navigation">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname?.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`nav-link${isActive ? " is-active" : ""}`}
              data-nav-item
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="nav-meta">
        <div className="nav-status" data-nav-item>
          <span className="nav-status-dot" />
          <span>Field network stable</span>
        </div>

        <div className="nav-user" data-nav-item>
          <div className="nav-user-copy">
            <strong>Priya Sharma</strong>
            <span>Sr. Field Coordinator</span>
          </div>
          <div className="nav-avatar">PS</div>
        </div>

        <button aria-label="Settings" className="icon-button" data-nav-item>
          <Settings size={18} />
        </button>

        <button
          type="button"
          aria-label="Logout"
          className="icon-button"
          onClick={handleLogout}
          data-nav-item
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
