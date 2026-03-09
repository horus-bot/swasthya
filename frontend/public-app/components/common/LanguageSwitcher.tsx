"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-gray-500" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as "en" | "ta" | "hi")}
        className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer border-none"
      >
        <option value="en">English</option>
        <option value="ta">தமிழ் (Tamil)</option>
        <option value="hi">हिंदी (Hindi)</option>
      </select>
    </div>
  );
}
