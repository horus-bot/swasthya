"use client";

import { Activity, TrendingUp, AlertCircle } from "lucide-react";

export default function AlertsPanel() {
  const recentActivity = [
    {
      id: 1,
      action: "Bed ICU-02 became available",
      user: "System",
      time: "Just now",
      type: "success"
    },
    {
      id: 2,
      action: "Dr. Sarah Johnson acknowledged critical alert",
      user: "Dr. Sarah Johnson",
      time: "3 minutes ago",
      type: "info"
    },
    {
      id: 3,
      action: "Equipment VEN-002 maintenance started",
      user: "Maintenance Team",
      time: "5 minutes ago",
      type: "warning"
    },
    {
      id: 4,
      action: "New patient admitted to Emergency",
      user: "Reception",
      time: "8 minutes ago",
      type: "info"
    },
    {
      id: 5,
      action: "Staff shift change completed",
      user: "System",
      time: "15 minutes ago",
      type: "success"
    }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case "success": return "bg-green-100 text-green-800";
      case "warning": return "bg-yellow-100 text-yellow-800";
      case "error": return "bg-red-100 text-red-800";
      case "info": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "success": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "error": return "bg-red-500";
      case "info": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <Activity className="text-blue-600" size={24} />
          Recent Activity
        </h3>
        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
          Activity Log →
        </button>
      </div>

      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className={`w-3 h-3 rounded-full mt-2 ${getActivityIcon(activity.type)}`}></div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{activity.action}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-600">by {activity.user}</span>
                <span className="text-xs text-gray-500">• {activity.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="text-green-600" size={16} />
              <span className="text-lg font-bold text-green-600">24</span>
            </div>
            <p className="text-xs text-gray-500">Actions Today</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <AlertCircle className="text-orange-600" size={16} />
              <span className="text-lg font-bold text-orange-600">3</span>
            </div>
            <p className="text-xs text-gray-500">Pending Actions</p>
          </div>
        </div>
      </div>
    </div>
  );
}