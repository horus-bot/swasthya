"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart3, Activity, Calendar, User, MapPin } from "lucide-react";

function NavTab({ icon: Icon, label, href, active }: { icon: any, label: string, href: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center justify-center flex-1 py-3 px-1 transition-all duration-300 ease-in-out relative group"
    >
      <div className={`flex flex-col items-center justify-center w-full px-2 py-1.5 rounded-xl transition-colors ${active ? 'bg-teal-50 text-teal-700' : 'text-slate-400 group-hover:bg-slate-50 group-hover:text-teal-500'}`}>
        <Icon size={22} fill={active ? "currentColor" : "none"} strokeWidth={active ? 2.5 : 2} />
        <span className={`text-[10px] font-bold mt-1 tracking-wide ${active ? 'text-teal-700' : 'text-slate-400'}`}>{label}</span>
      </div>
    </Link>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === '/chatbox') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-between items-center px-1 pb-safe z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
      <NavTab icon={Home} label="Home" href="/home" active={pathname === '/home' || pathname === '/'} />
      <NavTab icon={BarChart3} label="Analytics" href="/reports" active={pathname.startsWith('/reports')} />
      <NavTab icon={Activity} label="Alerts" href="/tracker" active={pathname.startsWith('/tracker')} />
      <NavTab icon={Calendar} label="Appts" href="/appointments" active={pathname.startsWith('/appointments')} />
      <NavTab icon={User} label="Profile" href="/profile" active={pathname.startsWith('/profile')} />
    </nav>
  );
}
