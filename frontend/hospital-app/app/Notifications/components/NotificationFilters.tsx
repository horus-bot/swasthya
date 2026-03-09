"use client";

import { Search, Filter, Settings, RefreshCw } from "lucide-react";

export default function NotificationFilters() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search notifications, alerts..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3 items-center">
          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <option>All Types</option>
            <option>Emergency</option>
            <option>System</option>
            <option>Appointments</option>
            <option>Equipment</option>
            <option>Staff</option>
          </select>

          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <option>All Priority</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
            <option>All Status</option>
            <option>Unread</option>
            <option>Read</option>
            <option>Acknowledged</option>
            <option>Resolved</option>
          </select>

          <button className="flex items-center gap-2 bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium">
            <RefreshCw size={18} />
            Refresh
          </button>

          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium">
            <Settings size={18} />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}