"use client";

import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("hospital_auth");
    localStorage.removeItem("user_email");
    localStorage.removeItem("login_time");

    // Redirect to login
    router.push("/login");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-white to-[#f0f9ff] rounded-2xl p-6 mb-8 shadow-sm border border-slate-200 hover:shadow-md transition-all group">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#3b82f6] to-[#1e3a8a] opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

      <div className="relative z-10 flex items-center justify-between">
        {/* Left: Logo and Hospital Info */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="w-12 h-12 rounded-lg bg-white border-2 border-slate-200 p-1 shadow-md hover:shadow-lg transition-all hover:scale-105 transform">
            <img
              src="/logo.svg"
              alt="Swasthya"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="group/info">
            <h1 className="text-2xl font-bold text-slate-900 group-hover/info:text-[#1e3a8a] transition-colors">
              City General Hospital
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Chennai • Government Facility
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-8">
          {/* Shift Status */}
          <div className="text-right bg-gradient-to-r from-[#dbeafe] to-[#e0f2fe] px-4 py-3 rounded-xl border border-[#3b82f6]/20 hover:border-[#3b82f6]/50 transition-all hover:shadow-md group/status">
            <p className="text-sm font-semibold text-[#1e3a8a] group-hover/status:text-[#0c4a6e] transition-colors">
              Dr. Rashmi
            </p>
            <p className="text-xs text-[#3b82f6] font-medium mt-1">
              ✓ On Duty • Morning Shift
            </p>
          </div>

          {/* Notification Bell */}
          <button className="relative cursor-pointer p-2 rounded-lg hover:bg-blue-50 transition-colors group/bell">
            <Bell
              className="text-gray-600 group-hover/bell:text-[#3b82f6] transition-colors"
              size={22}
            />
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* Avatar */}
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            K
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-[#3b82f6] hover:bg-blue-50 rounded-lg transition-all duration-200 border border-blue-200 hover:border-[#3b82f6] hover:shadow-md hover:scale-105 transform font-medium"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="text-sm">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
