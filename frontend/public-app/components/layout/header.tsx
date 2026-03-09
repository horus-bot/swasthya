"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "../logo";
import { Menu, X } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "../common/LanguageSwitcher";
import NotificationDropdown from "../common/NotificationDropdown";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link href="/home" className="flex items-center space-x-3 group">
            <Logo width={40} height={42} className="text-teal-600 group-hover:scale-105 transition-transform duration-200" />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-gray-900 leading-tight">Swasthya</h1>
              <span className="text-[10px] uppercase tracking-wider text-teal-600 font-semibold">Healthcare Platform</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            <NavItem href="/home">{t.nav.home}</NavItem>
            <NavItem href="/clinics">{t.nav.clinics}</NavItem>
            <NavItem href="/appointments">{t.nav.appointments}</NavItem>
            <NavItem href="/reports">{t.nav.reports}</NavItem>
            <NavItem href="/tracker">{t.nav.tracker}</NavItem>
            <NavItem href="/profile">{t.nav.profile}</NavItem>
          </nav>

          {/* Action Button & Mobile Menu Toggle */}
          <div className="flex items-center space-x-3 md:space-x-4">
             <LanguageSwitcher />
             <NotificationDropdown 
               triggerClass="relative p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-600 transition-all active:scale-95 shadow-sm border border-slate-100 hidden sm:block" 
               dotBorderColor="border-white" 
             />
             {/* Emergency Button - Visible on all screens */}
             <Link 
              href="/instructions" 
              className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border border-red-100 flex items-center gap-1.5 animate-pulse"
            >
              <span className="w-2 h-2 rounded-full bg-red-600"></span>
              {t.common.emergency}
            </Link>


            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-500 hover:text-teal-600 focus:outline-none p-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <MobileNavItem href="/home" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.home}</MobileNavItem>
            <MobileNavItem href="/clinics" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.clinics}</MobileNavItem>
            <MobileNavItem href="/appointments" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.appointments}</MobileNavItem>
            <MobileNavItem href="/reports" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.reports}</MobileNavItem>
            <MobileNavItem href="/tracker" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.tracker}</MobileNavItem>
            <MobileNavItem href="/profile" onClick={() => setIsMobileMenuOpen(false)}>{t.nav.profile}</MobileNavItem>
          </div>
        </div>
      )}
    </header>
  );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      className="text-gray-600 hover:text-teal-600 hover:bg-teal-50 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
    >
      {children}
    </Link>
  );
}

function MobileNavItem({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="block px-3 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
    >
      {children}
    </Link>
  );
}
