"use client";

import React from 'react';
import { useUiStore } from '@/store/useUiStore';
import { Bell, Search, Menu, User, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/cn';

export const Topbar = () => {
  const { toggleSidebar, sidebarOpen, selectedCity, setSelectedCity } = useUiStore();

  return (
    <div className={cn(
        "sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-white px-6 shadow-sm transition-all duration-300",
        sidebarOpen ? "lg:pl-6" : ""
    )}>
      <Button variant="ghost" size="icon" className="lg:hidden -ml-2" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
      
      {/* Filters Bar */}
      <div className="hidden md:flex items-center gap-3 flex-1">
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-md border">
            <span className="text-xs font-semibold text-muted-foreground px-2">LOCATION</span>
            <select 
                className="bg-transparent text-sm font-medium focus:outline-hidden"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
            >
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
            </select>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-md border">
             <span className="text-xs font-semibold text-muted-foreground px-2">DISTRICT</span>
             <select className="bg-transparent text-sm font-medium focus:outline-hidden">
                <option value="All">All Districts</option>
                <option value="North">North</option>
                <option value="Central">Central</option>
                <option value="South">South</option>
             </select>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-md border">
             <span className="text-xs font-semibold text-muted-foreground px-2">TIME</span>
             <select className="bg-transparent text-sm font-medium focus:outline-hidden">
                <option value="Today">Today</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
             </select>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-md border">
             <span className="text-xs font-semibold text-muted-foreground px-2">DISEASE</span>
             <select className="bg-transparent text-sm font-medium focus:outline-hidden">
                <option value="All">All Diseases</option>
                <option value="Dengue">Dengue</option>
                <option value="Malaria">Malaria</option>
                <option value="Covid">Covid-19</option>
             </select>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="relative hidden sm:block w-64">
           <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
           <Input placeholder="Search facilities, alerts..." className="pl-9 h-9 bg-slate-50" />
        </div>
        
        <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600 border-2 border-white" />
        </Button>

        <div className="flex items-center gap-2 border-l pl-4">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                AD
            </div>
            <div className="hidden sm:block">
                <p className="text-sm font-medium leading-none">Admin User</p>
                <p className="text-xs text-muted-foreground">Health Dept.</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
        </div>
      </div>
    </div>
  );
};
