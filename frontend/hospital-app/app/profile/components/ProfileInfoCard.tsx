"use client";

import { User, Mail, Phone, Building, Briefcase, Calendar } from "lucide-react";

type ProfileInfoCardProps = {
  profileData: {
    fullName: string;
    email: string;
    phone: string;
    department: string;
    role: string;
    employeeId: string;
    joinDate: string;
  };
  isEditing: boolean;
  onDataChange: (field: string, value: string) => void;
};

export default function ProfileInfoCard({ profileData, isEditing, onDataChange }: ProfileInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <Mail className="text-blue-600" size={24} />
        Contact Information
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.fullName}
              onChange={(e) => onDataChange('fullName', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">{profileData.fullName}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          {isEditing ? (
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => onDataChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">{profileData.email}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
          {isEditing ? (
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => onDataChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">{profileData.phone}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          {isEditing ? (
            <input
              type="text"
              value={profileData.department}
              onChange={(e) => onDataChange('department', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">{profileData.department}</p>
          )}
        </div>
      </div>
    </div>
  );
}