"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HospitalProfile = {
  name: string;
  address: string;
  contact: string;
  beds_total: number;
  beds_available: number;
  icu_total: number;
  icu_available: number;
};

export default function ProfilePage() {
  const defaultProfile: HospitalProfile = {
    name: "City General Hospital",
    address: "12 Health Ave, City, State",
    contact: "+91 98765 43210",
    beds_total: 120,
    beds_available: 18,
    icu_total: 12,
    icu_available: 2,
  };

  const [profile, setProfile] = useState<HospitalProfile>(defaultProfile);
  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState<HospitalProfile>(defaultProfile);
  const [copied, setCopied] = useState(false);
  const [animBeds, setAnimBeds] = useState(0);
  const [animICU, setAnimICU] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("hospital_profile");
      if (raw) setProfile(JSON.parse(raw));
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setTempProfile(profile);
  }, [profile]);

  useEffect(() => {
    // animate numbers quickly for visual polish
    let raf: number | null = null;
    const duration = 600;
    const start = performance.now();
    const fromBeds = 0;
    const toBeds = profile.beds_available;
    const fromICU = 0;
    const toICU = profile.icu_available;

    const step = (ts: number) => {
      const t = Math.min(1, (ts - start) / duration);
      setAnimBeds(Math.round(fromBeds + (toBeds - fromBeds) * t));
      setAnimICU(Math.round(fromICU + (toICU - fromICU) * t));
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [profile.beds_available, profile.icu_available]);

  const save = () => {
    localStorage.setItem("hospital_profile", JSON.stringify(tempProfile));
    setProfile(tempProfile);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 p-6" style={{ animation: 'fadeIn 0.6s ease-out' }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6" style={{ animation: 'slideInDown 0.6s ease-out' }}>
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Hospital Profile</h2>
              <p className="text-sm text-slate-600 mt-1">Manage hospital-level data, capacity and contacts.</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <Link href="/resources" className="px-4 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300 font-medium">Resources</Link>
            <button onClick={() => setEditing((s) => !s)} className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all duration-300 shadow font-medium">{editing ? 'Cancel' : 'Edit'}</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2" style={{ animation: 'slideInUp 0.6s ease-out 0.1s both' }}>
            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-slate-100 hover:border-blue-200">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Available Beds</div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-3xl font-bold text-blue-600">{animBeds}</div>
                <div className="text-xs text-slate-500">of {profile.beds_total}</div>
              </div>
              <div className="mt-4 w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700" style={{ width: `${Math.round((profile.beds_available/profile.beds_total)*100)}%` }} />
              </div>
              <div className="text-xs text-slate-400 mt-2">{Math.round((profile.beds_available/profile.beds_total)*100)}% utilized</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col border border-slate-100 hover:border-blue-200">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">ICU Available</div>
              <div className="flex items-center justify-between mt-3">
                <div className="text-3xl font-bold text-blue-600">{animICU}</div>
                <div className="text-xs text-slate-500">of {profile.icu_total}</div>
              </div>
              <div className="mt-4 w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700" style={{ width: `${Math.round((profile.icu_available/profile.icu_total)*100)}%` }} />
              </div>
              <div className="text-xs text-slate-400 mt-2">{Math.round((profile.icu_available/profile.icu_total)*100)}% utilized</div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between border border-slate-100 hover:border-blue-200">
              <div className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Hospital Contact</div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{profile.contact}</div>
                  <div className="text-xs text-slate-500 mt-1">Main line</div>
                </div>
                <button onClick={() => { navigator.clipboard?.writeText(profile.contact); setCopied(true); setTimeout(() => setCopied(false), 1600); }} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-xs font-medium text-slate-700">{copied ? '✓ Copied' : 'Copy'}</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-md border border-slate-100" style={{ animation: 'slideInUp 0.6s ease-out 0.2s both' }}>
            <div className="flex items-start gap-6">
              <div className="flex-1">
                <label className="block text-xs text-gray-500">Hospital Name</label>
                {editing ? (
                  <input value={tempProfile.name} onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
                ) : (
                  <p className="mt-1 text-gray-800 text-lg font-semibold">{profile.name}</p>
                )}

                <label className="block text-xs text-gray-500 mt-4">Address</label>
                {editing ? (
                  <input value={tempProfile.address} onChange={(e) => setTempProfile({ ...tempProfile, address: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
                ) : (
                  <p className="mt-1 text-gray-800">{profile.address}</p>
                )}

                <label className="block text-xs text-gray-500 mt-4">Contact</label>
                {editing ? (
                  <input value={tempProfile.contact} onChange={(e) => setTempProfile({ ...tempProfile, contact: e.target.value })} className="mt-1 w-full border rounded px-3 py-2" />
                ) : (
                  <p className="mt-1 text-gray-800">{profile.contact}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex gap-3">
                <button onClick={save} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow hover:shadow-lg transition-all duration-300 font-medium">Save Changes</button>
                <button onClick={() => { setTempProfile(profile); setEditing(false); }} className="px-6 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-all duration-300 font-medium">Cancel</button>
              </div>
            )}
          </div>

          <aside className="bg-white p-8 rounded-2xl shadow-md space-y-4 border border-slate-100" style={{ animation: 'slideInUp 0.6s ease-out 0.3s both' }}>
            <h3 className="text-sm font-medium text-gray-700">Capacity Overview</h3>

            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Beds Available</span>
                <span>{profile.beds_available} / {profile.beds_total}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-blue-500 transition-all" style={{ width: `${Math.round((profile.beds_available/profile.beds_total)*100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>ICU Available</span>
                <span>{profile.icu_available} / {profile.icu_total}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-blue-500 transition-all" style={{ width: `${Math.round((profile.icu_available/profile.icu_total)*100)}%` }} />
              </div>
            </div>

            <div className="pt-2">
              <p className="text-xs text-gray-500">Last updated: <span className="text-gray-700">{new Date().toLocaleString()}</span></p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
