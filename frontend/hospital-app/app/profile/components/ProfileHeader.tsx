"use client";

import { User, Building, Award, TrendingUp } from "lucide-react";

type ProfileHeaderProps = {
  profileData: {
    fullName: string;
    role: string;
    department: string;
    employeeId: string;
  };
};

export default function ProfileHeader({ profileData }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
          <User size={48} className="text-blue-600" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          {profileData.fullName}
        </h2>
        <p className="text-gray-600 mb-1">{profileData.role}</p>
        <p className="text-sm text-gray-500 mb-4">{profileData.department}</p>
        
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
          <Building size={16} />
          <span>Employee ID: {profileData.employeeId}</span>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="text-blue-600" size={16} />
              <span className="text-lg font-bold text-slate-900">4.8</span>
            </div>
            <p className="text-xs text-gray-500">Performance Rating</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <TrendingUp className="text-blue-600" size={16} />
              <span className="text-lg font-bold text-slate-900">156</span>
            </div>
            <p className="text-xs text-gray-500">Patients Served</p>
          </div>
        </div>
      </div>
    </div>
  );
}