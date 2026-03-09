"use client";

import { Check, X, Clock, User, Phone } from "lucide-react";

type AppointmentRequestCardProps = {
  id: string; // Changed from number to string to match DB confirmed type
  patientName: string;
  reason: string;
  requestedTime: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  contactNumber: string;
  requestedDate: string;
  onApprove?: () => void;
  onDecline?: () => void;
};

export function AppointmentRequestCard({
  id,
  patientName,
  reason,
  requestedTime,
  priority,
  contactNumber,
  requestedDate,
  onApprove,
  onDecline,
}: AppointmentRequestCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-700 border-red-200";
      case "High": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Low": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:border-blue-200 transition-all group">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Patient Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <p className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              {patientName}
            </p>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(priority)}`}>
              {priority}
            </span>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <User size={14} />
              {reason}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Clock size={14} />
              {requestedDate} at {requestedTime}
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <Phone size={14} />
              {contactNumber}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onApprove}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
          >
            <Check size={16} />
            Approve
          </button>
          <button 
            onClick={onDecline}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
          >
            <X size={16} />
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}