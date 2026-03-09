"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-2 sm:px-3 py-1.5 rounded-full border border-white/10 transition-colors shadow-sm backdrop-blur-md">
      <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "ta" | "hi")}
        className="bg-transparent text-xs sm:text-sm font-bold text-white outline-none cursor-pointer border-none appearance-none tracking-wide pr-1 [&>option]:text-slate-900"
        style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
      >
        <option value="en">EN</option>
        <option value="ta">தமிழ்</option>
        <option value="hi">हिंदी</option>
      </select>
    </div>
  );
}
