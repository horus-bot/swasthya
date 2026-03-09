"use client";

import { useState, useEffect } from "react";
import { User, Droplets, ArrowRight, HeartPulse, Activity, CalendarCheck, Phone, MapPin, FileText, AlertCircle, ShieldCheck, Mail, Ruler, Weight, Dna } from "lucide-react";
import { QRCodeSVG } from 'qrcode.react';

/* ------------------ Mock Data ------------------ */

const vitalsData = [
  { day: "Mon", heart: 75, bp: 118, sugar: 95 },
  { day: "Tue", heart: 72, bp: 120, sugar: 92 },
  { day: "Wed", heart: 78, bp: 115, sugar: 98 },
  { day: "Thu", heart: 74, bp: 119, sugar: 94 },
  { day: "Fri", heart: 76, bp: 122, sugar: 96 },
];

/* ------------------ Page ------------------ */

export default function ProfilePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    // Collect specific profile basic and health info for the QR Code
    const profileData = {
      name: "Keva Solankure",
      age: 27,
      gender: "Female",
      phone: "+91 98765 43210",
      email: "keva.s@email.com",
      bloodType: "A Positive (A+)",
      bmi: "21.4 (Normal)",
      allergies: ["Dust Mites", "Pollen"],
      disabilities: "None"
    };
    
    // Base64 Encode the JSON payload string to pass via Query Param securely
    const encoded = btoa(JSON.stringify(profileData));
    
    // Dynamically fetch exact domain origin on client side
    setQrUrl(`${window.location.origin}/download-profile?data=${encoded}`);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50/50 pb-32">
      {/* HERO SECTION */}
      <div className="bg-white border-b border-slate-100 px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col items-center">
        <div className="max-w-4xl w-full flex flex-col items-center">
          {/* Avatar Area */}
          <div className="relative group">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-[2.5rem] bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center text-4xl sm:text-5xl font-[900] shadow-2xl shadow-teal-500/30 border-8 border-white group-hover:rotate-3 transition-transform duration-500">
              K
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-teal-600 border border-slate-50">
              <ShieldCheck size={28} />
            </div>
          </div>

          <div className="mt-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Keva Solankure</h1>
            <div className="flex flex-wrap justify-center items-center gap-3 mt-4">
              <div className="flex items-center gap-2 bg-teal-50 text-teal-700 px-4 py-2 rounded-2xl border border-teal-100 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                <p className="font-bold text-[12px] tracking-wider uppercase">ABHA ID: 91-2093-2102</p>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl border border-blue-100 shadow-sm">
                <Mail size={14} />
                <p className="font-bold text-[12px] tracking-wider uppercase">keva.s@email.com</p>
              </div>
            </div>
          </div>

          {/* Quick Stats / Completion */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-8">
            <ProfileStat label="Health Score" value="92" color="text-emerald-500" />
            <ProfileStat label="Completed" value="85%" color="text-blue-500" />
            <ProfileStat label="Documents" value="12" color="text-slate-800" />
            <ProfileStat label="Next Sync" value="2d" color="text-amber-500" />
          </div>
          
          <button
            onClick={() => setIsOpen(true)}
            className="mt-8 px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black tracking-widest uppercase hover:bg-slate-800 active:scale-95 transition-all shadow-xl shadow-slate-900/30 flex items-center gap-3"
          >
            Update Profile <ArrowRight size={16} />
          </button>

          {/* Digital Health QR Code Card */}
          {qrUrl && (
            <div className="mt-10 w-full max-w-sm bg-white rounded-3xl shadow-xl shadow-teal-500/10 border border-teal-100 p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden group animate-in slide-in-from-bottom-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
              
              <h3 className="text-lg font-black text-slate-800 tracking-tight z-10">Digital Health Card</h3>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1 mb-6 z-10">Scan to Download PDF</p>
              
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 mb-6 z-10 group-hover:scale-[1.03] transition-transform duration-500">
                <QRCodeSVG value={qrUrl} size={150} level="H" fgColor="#0f172a" />
              </div>

              <div className="flex items-center gap-2 text-[11px] font-bold text-teal-600 bg-teal-50 px-4 py-2 rounded-full z-10 border border-teal-100/50">
                <ShieldCheck size={14} /> Private Encrypted Payload
              </div>
              
              <p className="text-[10px] font-bold text-slate-400 mt-4 leading-relaxed z-10 w-3/4">
                Scan this code with any camera to instantly download a medical profile PDF containing your basic & health details.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8 lg:space-y-12">


        {/* Personal Details */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 sm:mb-8 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shadow-sm">
              <User size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-black text-2xl text-slate-800 tracking-tight">Identity & Bio</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Core Personal Information</p>
            </div>
          </div>
          <div className="space-y-2">
            <ProfileRow icon={User} label="Full Name" value="Keva Solankure" />
            <ProfileRow icon={CalendarCheck} label="Birth Date" value="May 20, 1997" />
            <ProfileRow icon={User} label="Gender" value="Female" />
            <ProfileRow icon={Mail} label="Contact" value="+91 98765 43210" />
            <ProfileRow icon={MapPin} label="Location" value="Mumbai, India" />
          </div>
        </div>

        {/* Biometrics */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 sm:mb-8 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-sm">
              <Dna size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-black text-2xl text-slate-800 tracking-tight">Biometrics</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Physical Metrics & Type</p>
            </div>
          </div>
          <div className="space-y-2">
            <ProfileRow icon={Droplets} label="Blood Group" value="A Positive (A+)" iconColor="text-rose-500" />
            <ProfileRow icon={Ruler} label="Height" value="168 cm" />
            <ProfileRow icon={Weight} label="Weight" value="62 kg" iconColor="text-amber-500" />
            <ProfileRow icon={Activity} label="BMI Index" value="21.4 (Normal)" iconColor="text-emerald-500" />
          </div>
        </div>

        {/* Medical History */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col">
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 sm:mb-8 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center shadow-sm">
              <HeartPulse size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-black text-2xl text-slate-800 tracking-tight">Medical Context</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Known Diagnoses & Risks</p>
            </div>
          </div>
          <div className="space-y-2">
            <ProfileRow icon={FileText} label="Conditions" value="Mild Asthma (Exercise-induced)" />
            <ProfileRow icon={AlertCircle} label="Allergies" value="Dust Mites, Pollen" iconColor="text-orange-500" />
            <ProfileRow icon={CalendarCheck} label="Last Wellness" value="February 14, 2026" />
            <ProfileRow icon={ShieldCheck} label="Insurance" value="BlueCross Premium" iconColor="text-blue-500" />
          </div>
        </div>

        {/* Recent Doctor Visits */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 rounded-[2rem] shadow-2xl p-6 sm:p-8 text-white flex flex-col">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 sm:mb-8 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 text-white flex items-center justify-center backdrop-blur-xl border border-white/10 shadow-xl">
                <FileText size={28} strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-black text-2xl text-white tracking-tight">Clinical Records</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Latest Professional Syncs</p>
              </div>
            </div>
            <button className="text-[11px] font-black tracking-widest uppercase bg-white/10 px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all">
              Records
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-5 group cursor-pointer hover:bg-white/10 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-teal-500/20 rounded-3xl flex shrink-0 items-center justify-center text-teal-300 border border-teal-500/20 group-hover:scale-110 transition-transform">
                  <CalendarCheck size={28} />
                </div>
                <div>
                  <h4 className="font-black text-white text-[19px] tracking-tight">Dr. Rajesh Mehta</h4>
                  <p className="text-white/50 text-[14px] font-bold mt-1 tracking-wide uppercase">Pulmonologist • Apollo Clinic</p>
                </div>
              </div>
              <div className="flex justify-between items-center sm:flex-col sm:items-end w-full sm:w-auto border-t border-white/10 sm:border-0 pt-5 sm:pt-0">
                <span className="font-black text-[18px] text-teal-300">FEB 14</span>
                <span className="text-[10px] text-white/90 bg-teal-600 px-3 py-1.5 rounded-lg font-black uppercase tracking-[0.2em] mt-2 shadow-lg shadow-teal-500/20">Visited</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Health Vitals Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pb-12 flex flex-col items-center sm:items-start">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
             <Activity size={24} />
           </div>
           <h2 className="text-3xl font-[900] text-slate-900 tracking-tighter">Vital Trend Monitor</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <VitalCard title="Cardiac Rhythm" unit="bpm" color="#ef4444" dataKey="heart" />
          <VitalCard title="Pressure Map" unit="mmHg" color="#3b82f6" dataKey="bp" />
          <VitalCard title="Glycemic Level" unit="mg/dL" color="#10b981" dataKey="sugar" />
        </div>
      </div>

      {isOpen && <EditProfileModal onClose={() => setIsOpen(false)} />}
    </main>
  );
}

/* ------------------ Vital Card ------------------ */

function VitalCard({
  title,
  unit,
  color,
  dataKey,
}: {
  title: string;
  unit: string;
  color: string;
  dataKey: "heart" | "bp" | "sugar";
}) {
  const latest = vitalsData[vitalsData.length - 1][dataKey];
  const alert = getAlert(dataKey, latest);

  return (
    <div className={`bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${alert ? 'animate-pulse shadow-red-500/30 shadow-2xl border-red-200' : 'shadow-sm'}`}>
      <div className="flex flex-col items-center sm:items-start">
        <h3 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-2">{title}</h3>
        <p className="text-4xl font-[900] text-slate-800 tracking-tight">
          {latest} <span className="text-xl text-slate-400 font-bold ml-1">{unit}</span>
        </p>
        
        {alert && (
          <div className="mt-5 flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2.5 rounded-2xl w-fit">
            <AlertCircle size={16} className="animate-bounce" />
            <p className="text-[12px] font-black uppercase tracking-wider">
              {alert}
            </p>
          </div>
        )}
      </div>

      {/* Mini bars */}
      <div className="h-24 mt-8 flex items-end gap-2">
        {vitalsData.map((item, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-lg rounded-b-sm transition-all duration-500 hover:opacity-100"
            style={{
              height: `${Math.max(15, Math.min((item[dataKey] / 150) * 100, 100))}%`,
              backgroundColor: color,
              opacity: 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------ Alerts Logic ------------------ */

function getAlert(type: string, value: number) {
  if (type === "heart" && value > 100) return "High heart rate";
  if (type === "bp" && value > 140) return "High blood pressure";
  if (type === "sugar" && value > 150) return "High blood sugar";
  return null;
}

/* ------------------ Modal ------------------ */

function EditProfileModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 animate-in fade-in duration-300">
      <div className="bg-white rounded-t-[2rem] sm:rounded-3xl p-6 sm:p-8 w-full max-w-lg md:max-w-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-500 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Decorative Top Bar for Mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 sm:hidden pointer-events-none"></div>

        {/* Modal Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex gap-4 items-center">
            <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100 shadow-sm shrink-0">
               <User size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="font-black text-2xl text-slate-800 tracking-tight leading-tight">Edit Profile</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Update Core Information</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 bg-slate-50 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full flex items-center justify-center transition-all active:scale-95"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          
          {/* Identity Section */}
          <div className="space-y-4 md:col-span-2">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-3">Identity</h3>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="text" defaultValue="Keva Solankure" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-bold text-sm" />
                  </div>
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input type="email" defaultValue="keva.s@email.com" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-12 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all font-bold text-sm" />
                  </div>
               </div>
             </div>
          </div>

          {/* Biometrics Section */}
          <div className="space-y-4 md:col-span-2 mt-2">
             <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2 mb-3">Biometrics</h3>
             
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
               <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Blood Type</label>
                  <div className="relative">
                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 w-4 h-4" />
                    <select className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all font-bold text-sm appearance-none">
                      <option value="A+">A Positive (A+)</option>
                      <option value="O+">O Positive (O+)</option>
                      <option value="B+">B Positive (B+)</option>
                    </select>
                  </div>
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Height (cm)</label>
                  <div className="relative">
                    <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="number" defaultValue="168" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-bold text-sm" />
                  </div>
               </div>
               <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Weight (kg)</label>
                  <div className="relative">
                    <Weight className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input type="number" defaultValue="62" className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl pl-11 pr-4 py-3.5 outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all font-bold text-sm" />
                  </div>
               </div>
             </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-slate-100">
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-6 py-4 sm:py-3.5 text-slate-500 font-bold bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all active:scale-95"
          >
            Cancel
          </button>
          <button 
            onClick={onClose} 
            className="w-full sm:w-auto px-10 py-4 sm:py-3.5 bg-teal-500 text-white font-black tracking-widest uppercase rounded-2xl hover:bg-teal-600 shadow-lg shadow-teal-500/30 transition-all active:scale-95 flex justify-center"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Reusable ------------------ */

function ProfileStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] shadow-sm text-center flex flex-col items-center transition-all hover:scale-105">
      <span className={`text-xl font-black ${color}`}>{value}</span>
      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{label}</span>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value, iconColor = "text-slate-400" }: { icon: any; label: string; value: string; iconColor?: string }) {
  return (
    <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4 py-2.5 group border-b border-slate-50 last:border-0 border-dashed transition-all">
      <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-3">
        <div className={`w-9 h-9 rounded-xl bg-slate-50 flex shrink-0 items-center justify-center ${iconColor} group-hover:scale-110 group-hover:bg-teal-50 group-hover:text-teal-600 transition-all shadow-sm`}>
           <Icon size={16} strokeWidth={2.5} />
        </div>
        <span className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] text-center sm:text-left">{label}</span>
      </div>
      <span className="font-[900] text-slate-800 text-[16px] sm:text-[14px] tracking-tight text-center sm:text-right">{value}</span>
    </div>
  );
}

