"use client";

import { Settings, Bell, Mail, Phone, Palette, Shield } from "lucide-react";

type PreferencesSettingsProps = {
  preferences: {
    notifications: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
    theme: string;
  };
  onPreferenceChange: (field: string, value: boolean | string) => void;
};

export default function PreferencesSettings({ preferences, onPreferenceChange }: PreferencesSettingsProps) {
  return (
    <div className="space-y-6">
      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Palette className="text-blue-600" size={24} />
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="text-gray-600" size={20} />
              <div>
                <span className="text-slate-900 font-medium">Push Notifications</span>
                <p className="text-sm text-gray-500">Receive real-time alerts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => onPreferenceChange('notifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="text-gray-600" size={20} />
              <div>
                <span className="text-slate-900 font-medium">Email Alerts</span>
                <p className="text-sm text-gray-500">Get notified via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.emailAlerts}
                onChange={(e) => onPreferenceChange('emailAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone className="text-gray-600" size={20} />
              <div>
                <span className="text-slate-900 font-medium">SMS Alerts</span>
                <p className="text-sm text-gray-500">Emergency notifications via SMS</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.smsAlerts}
                onChange={(e) => onPreferenceChange('smsAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
          <Shield className="text-blue-600" size={24} />
          Security Settings
        </h3>
        
        <div className="space-y-4">
          <button className="w-full text-left bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Change Password</h4>
                <p className="text-sm text-gray-600">Update your account password</p>
              </div>
              <div className="text-blue-600">→</div>
            </div>
          </button>
          
          <button className="w-full text-left bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </div>
              <div className="text-blue-600">→</div>
            </div>
          </button>

          <button className="w-full text-left bg-gray-50 hover:bg-gray-100 p-4 rounded-lg transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-900">Login History</h4>
                <p className="text-sm text-gray-600">View recent login activity</p>
              </div>
              <div className="text-blue-600">→</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}