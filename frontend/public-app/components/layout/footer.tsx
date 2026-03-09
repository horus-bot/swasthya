import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Calendar, BarChart, Map, AlertTriangle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto pt-8 pb-24 md:pb-28 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Logo & Social Icons */}
        <div className="flex items-center gap-8">
          <div className="flex items-center text-lg font-bold text-white tracking-wide">
            <Image src="/logo.svg" alt="Swasthya Logo" width={28} height={28} className="mr-3 filter brightness-110 drop-shadow-sm" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-emerald-400">Swasthya</span>
          </div>
          <div className="hidden md:block h-6 w-px bg-slate-700"></div>
          <div className="flex space-x-5">
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="Twitter">
              <Twitter size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="Instagram">
              <Instagram size={18} />
            </a>
            <a href="#" className="text-slate-400 hover:text-teal-400 transition-colors" aria-label="YouTube">
              <Youtube size={18} />
            </a>
          </div>
        </div>

        {/* Center/Right Side: Links & Emergency */}
        <div className="flex flex-wrap justify-center md:justify-end items-center gap-x-8 gap-y-4 text-sm font-medium">
            <Link href="/clinics" className="hover:text-white transition-colors flex items-center group">
              <MapPin size={16} className="mr-2 text-slate-500 group-hover:text-teal-400 transition-colors" /> Clinics
            </Link>
            <Link href="/appointments" className="hover:text-white transition-colors flex items-center group">
              <Calendar size={16} className="mr-2 text-slate-500 group-hover:text-teal-400 transition-colors" /> Appointments
            </Link>
            <Link href="/reports" className="hover:text-white transition-colors flex items-center group">
              <BarChart size={16} className="mr-2 text-slate-500 group-hover:text-teal-400 transition-colors" /> Reports
            </Link>
            <Link href="/tracker" className="hover:text-white transition-colors flex items-center group">
              <Map size={16} className="mr-2 text-slate-500 group-hover:text-teal-400 transition-colors" /> Tracker
            </Link>
            <div className="hidden md:block h-4 w-px bg-slate-700 mx-2"></div>
            <div className="flex items-center text-rose-400 font-bold bg-white/5 px-4 py-1.5 rounded-full border border-rose-500/20 shadow-sm backdrop-blur-sm">
               <Phone size={14} className="mr-2" /> 102 / 108
            </div>
            <Link href="/instructions" className="text-rose-400/80 hover:text-rose-400 transition-colors ml-2 hidden sm:flex items-center text-xs group">
              <AlertTriangle size={14} className="mr-1.5 text-rose-500/50 group-hover:text-rose-400 transition-colors" /> Guidelines
            </Link>
        </div>

      </div>
    </footer>
  );
}
