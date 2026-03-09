"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, BarChart3, AlertTriangle, Calendar, User } from "lucide-react";

function NavTab({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group px-2">
      <div className={`transition-all duration-300 p-1 ${active ? 'text-teal-600' : 'text-slate-400 group-hover:text-teal-400'}`}>
        <Icon size={24} fill={active ? "currentColor" : "none"} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={`text-[10px] font-bold ${active ? 'text-teal-600' : 'text-slate-400'}`}>{label}</span>
      {active && <div className="w-1 h-1 bg-teal-600 rounded-full mt-0.5"></div>}
    </button>
  );
}

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide bottom nav on specific pages if needed, for example chatbox
  if (pathname === '/chatbox') return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex justify-around items-center py-4 px-2 z-50">
      <NavTab icon={Home} label="Home" active={pathname === '/home' || pathname === '/'} onClick={() => router.push('/home')} />
      <NavTab icon={BarChart3} label="Analytics" active={pathname === '/reports'} onClick={() => router.push('/reports')} />
      <NavTab icon={AlertTriangle} label="Alerts" active={pathname === '/tracker'} onClick={() => router.push('/tracker')} />
      <NavTab icon={Calendar} label="Appts" active={pathname === '/appointments'} onClick={() => router.push('/appointments')} />
      <NavTab icon={User} label="Profile" active={pathname === '/profile'} onClick={() => router.push('/profile')} />
    </nav>
  );
}
