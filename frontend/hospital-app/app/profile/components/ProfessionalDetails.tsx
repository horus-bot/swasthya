"use client";

import { Briefcase, Award, Calendar, MapPin } from "lucide-react";

type ProfessionalDetailsProps = {
  profileData: {
    role: string;
    experience: string;
    specialization: string;
    joinDate: string;
  };
  isEditing: boolean;
  onDataChange: (field: string, value: string) => void;
};

export default function ProfessionalDetails({ profileData, isEditing, onDataChange }: ProfessionalDetailsProps) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
      <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
        <Briefcase className="text-blue-600" size={24} />
        Professional Details
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <p className="text-slate-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">{profileData.role}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
          <p className="text-slate-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">{profileData.experience}</p>
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
          {isEditing ? (
            <textarea
              value={profileData.specialization}
              onChange={(e) => onDataChange('specialization', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          ) : (
            <p className="text-slate-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">{profileData.specialization}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Joining Date</label>
          <p className="text-slate-900 font-medium bg-gray-50 px-4 py-3 rounded-lg">{new Date(profileData.joinDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Achievements Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Award className="text-emerald-600" size={20} />
          Recent Achievements
        </h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span className="text-sm text-slate-900">Successfully handled 50+ emergency cases this month</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-slate-900">Completed Advanced Life Support certification</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-sm text-slate-900">Recognized for excellent patient care</span>
          </div>
        </div>
      </div>
    </div>
  );
}