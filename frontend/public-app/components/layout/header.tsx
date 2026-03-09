"use client";

import Link from "next/link";
import { Search, MapPin } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "../common/LanguageSwitcher";
import NotificationDropdown from "../common/NotificationDropdown";

export default function Header() {
  const { t } = useLanguage();

  return (
     <header className="px-3 py-4 sm:px-6 sm:pt-6 sm:pb-3 flex justify-between items-center fixed top-0 w-full left-0 right-0 bg-[#0E9488] z-50 shadow-md lg:rounded-none">
        <Link href="/home" className="animate-down flex items-center gap-2 sm:gap-3 shrink-0 group">
          <img src="/logo.svg" alt="Swasthya Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain group-hover:scale-105 transition-transform" />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1 sm:gap-1.5 text-teal-100 font-bold text-[9px] sm:text-[10px] tracking-[0.2em] uppercase mb-0.5 ml-0.5">
              <MapPin size={10} className="text-white" />
              <span className="truncate max-w-[80px] sm:max-w-none">Chennai, TN</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white tracking-tighter leading-none shadow-sm">Swasthya</h1>
          </div>
        </Link>
        <div className="flex gap-1.5 sm:gap-2 animate-down items-center shrink-0">
          <div className="hidden xs:block">
            <LanguageSwitcher />
          </div>
          <button className="hidden xs:block p-2 sm:p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-95 shadow-sm border border-white/10">
            <Search size={20} className="sm:w-[22px] sm:h-[22px]" />
          </button>
          <NotificationDropdown 
            triggerClass="relative p-2 sm:p-2.5 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-95 shadow-sm border border-white/10" 
            dotBorderColor="border-[#0E9488]" 
          />
             {/* Emergency SOS Button */}
             <Link 
               href="/instructions" 
               className="bg-rose-500 hover:bg-rose-600 text-white px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-black tracking-widest uppercase transition-all shadow-md border border-rose-400 active:scale-95 group shrink-0 flex items-center gap-1.5 sm:gap-2"
             >
               <span className="relative flex h-2 sm:h-2.5 w-2 sm:w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 sm:h-2.5 w-2 sm:w-2.5 bg-white"></span>
               </span>
               <span className="inline sm:hidden">SOS</span>
               <span className="hidden sm:inline">{t.common.emergency || "SOS"}</span>
             </Link>
        </div>
      </header>
  );
}
