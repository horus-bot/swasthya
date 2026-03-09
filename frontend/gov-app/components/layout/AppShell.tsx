"use client";

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useUiStore } from '@/store/useUiStore';
import { cn } from '@/lib/cn';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { sidebarOpen } = useUiStore();

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Sidebar />
      <div 
        className={cn(
            "transition-all duration-300 ease-in-out flex flex-col min-h-screen",
            sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <Topbar />
        <main className="flex-1 p-6 overflow-x-hidden">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
}
