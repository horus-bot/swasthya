"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { useUiStore } from '@/store/useUiStore';
import {
  LayoutDashboard,
  Map,
  Activity,
  TrendingUp,
  AlertTriangle,
  PlayCircle,
  Truck,
  FileText,
  Settings,
  Menu,
  X,
  Megaphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/heatmaps', label: 'Heatmaps', icon: Map },
  { href: '/capacity', label: 'Capacity', icon: Activity },
  { href: '/prediction', label: 'Prediction', icon: TrendingUp },
  { href: '/outbreaks', label: 'Outbreaks', icon: AlertTriangle },
  { href: '/simulator', label: 'Simulator', icon: PlayCircle },
  { href: '/mobile-units', label: 'Mobile Units', icon: Truck },
  { href: '/advisories', label: 'Advisories', icon: Megaphone },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export const Sidebar = () => {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUiStore();

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={toggleSidebar}
      />

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-slate-900 text-white transition-all duration-300 ease-in-out border-r border-slate-800",
          sidebarOpen ? "w-64" : "w-20 -translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
            <div className={cn("flex items-center gap-2 font-bold text-xl tracking-wider", !sidebarOpen && "hidden lg:flex lg:justify-center lg:w-full")}>
             {!sidebarOpen ? "GOV" : "GOV.ANALYTICS"}
            </div>
            <Button variant="ghost" size="icon" className="lg:hidden text-slate-400 hover:text-white" onClick={toggleSidebar}>
                <X className="h-5 w-5" />
            </Button>
        </div>

        <nav className="p-4 space-y-2">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link 
                        key={item.href} 
                        href={item.href}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                            isActive 
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                                : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                        title={!sidebarOpen ? item.label : undefined}
                    >
                        <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")} />
                        <span className={cn("font-medium", !sidebarOpen && "hidden")}>
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </nav>
      </aside>
    </>
  );
};
