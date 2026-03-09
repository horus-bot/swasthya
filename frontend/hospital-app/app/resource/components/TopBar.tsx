"use client";

import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TopBar() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem('hospital_auth');
    localStorage.removeItem('user_email');
    localStorage.removeItem('login_time');
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-slate-200 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Hospital Info */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            City General Hospital
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Chennai • Government Facility
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-8">
          {/* Shift Status */}
          <div className="text-right bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 rounded-xl border border-emerald-200">
            <p className="text-sm font-semibold text-slate-900">
              Dr. Rashmi
            </p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              ✓ On Duty • Morning Shift
            </p>
          </div>

          {/* Notification Bell */}
          <button className="relative cursor-pointer p-2 rounded-lg hover:bg-red-50 transition-colors group">
            <Bell className="text-gray-600 group-hover:text-red-600" size={22} />
            <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
          </button>

          {/* Avatar */}
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            K
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}
