"use client";
import { useState, useEffect } from 'react';
import './tracker.css';

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  icon: string;
  color: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface HealthRecord {
  id: string;
  date: string;
  type: string;
  value: number;
  notes?: string;
}

export default function TrackerPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
    {
      id: 'heart-rate',
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      target: 70,
      icon: '💗',
      color: '#ef4444',
      trend: 'stable',
      lastUpdated: '2 hours ago'
    },
    {
      id: 'blood-pressure',
      name: 'Blood Pressure',
      value: 120,
      unit: 'mmHg',
      target: 120,
      icon: '🫀',
      color: '#3b82f6',
      trend: 'up',
      lastUpdated: '1 day ago'
    },
    {
      id: 'weight',
      name: 'Weight',
      value: 70.5,
      unit: 'kg',
      target: 68,
      icon: '⚖️',
      color: '#10b981',
      trend: 'down',
      lastUpdated: '3 hours ago'
    },
    {
      id: 'steps',
      name: 'Daily Steps',
      value: 8420,
      unit: 'steps',
      target: 10000,
      icon: '👟',
      color: '#f59e0b',
      trend: 'up',
      lastUpdated: '30 min ago'
    },
    {
      id: 'sleep',
      name: 'Sleep',
      value: 7.5,
      unit: 'hours',
      target: 8,
      icon: '😴',
      color: '#8b5cf6',
      trend: 'stable',
      lastUpdated: 'Today'
    },
    {
      id: 'water',
      name: 'Water Intake',
      value: 2.1,
      unit: 'liters',
      target: 2.5,
      icon: '💧',
      color: '#06b6d4',
      trend: 'up',
      lastUpdated: '1 hour ago'
    }
  ]);

  const [healthRecords] = useState<HealthRecord[]>([
    { id: '1', date: '2026-02-04', type: 'Heart Rate', value: 72, notes: 'Normal range' },
    { id: '2', date: '2026-02-04', type: 'Weight', value: 70.5, notes: 'Morning measurement' },
    { id: '3', date: '2026-02-03', type: 'Blood Pressure', value: 118, notes: 'Slightly low' },
    { id: '4', date: '2026-02-03', type: 'Steps', value: 9850, notes: 'Good activity day' },
    { id: '5', date: '2026-02-02', type: 'Sleep', value: 8.2, notes: 'Excellent rest' }
  ]);

  const getProgressPercentage = (value: number, target: number) => {
    return Math.min((value / target) * 100, 100);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10b981';
      case 'down': return '#ef4444';
      default: return '#64748b';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 sm:px-6 lg:px-8 font-sans pb-28 md:pb-12">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-8 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 md:w-80 h-48 md:h-80 bg-indigo-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
          
          <div className="relative z-10 w-full md:w-1/2">
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-1.5 md:mb-2">Health Tracker</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-snug">
              Monitor your health metrics and track your wellness journey
            </p>
          </div>
          
          <div className="relative z-10 flex gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex-1 md:flex-none">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-emerald-50 flex items-center justify-center text-xl md:text-2xl">🎯</div>
              <div>
                <div className="text-lg md:text-xl font-black text-slate-800 leading-none mb-1">85%</div>
                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Goals Met</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-3 md:p-4 rounded-2xl border border-slate-100 shadow-sm flex-1 md:flex-none">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-indigo-50 flex items-center justify-center text-xl md:text-2xl">📊</div>
              <div>
                <div className="text-lg md:text-xl font-black text-slate-800 leading-none mb-1">6</div>
                <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Tracked</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 md:gap-4 p-1.5 bg-slate-200/50 rounded-2xl border border-slate-200/50 mask-fade-edges">
          {[
            { id: 'overview', icon: '📊', label: 'Overview' },
            { id: 'metrics', icon: '📈', label: 'Metrics' },
            { id: 'history', icon: '📋', label: 'History' },
            { id: 'goals', icon: '🎯', label: 'Goals' }
          ].map(tab => (
            <button 
              key={tab.id}
              className={`flex-shrink-0 flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold transition-all text-sm md:text-base ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm border border-slate-100 scale-105 z-10' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                {healthMetrics.map((metric) => (
                  <div key={metric.id} className="bg-white rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white/50" style={{background: `${metric.color}20`}}>
                        {metric.icon}
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border font-bold text-xs" style={{color: getTrendColor(metric.trend), backgroundColor: `${getTrendColor(metric.trend)}15`, borderColor: `${getTrendColor(metric.trend)}30`}}>
                        {getTrendIcon(metric.trend)}
                        <span className="capitalize">{metric.trend}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-bold text-slate-500 mb-1">{metric.name}</h3>
                      <div className="flex items-baseline gap-1.5 mb-4">
                        <span className="text-3xl font-black text-slate-800 tracking-tight">{metric.value}</span>
                        <span className="text-sm font-bold text-slate-400">{metric.unit}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-slate-700">Target: {metric.target} {metric.unit}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${getProgressPercentage(metric.value, metric.target)}%`, background: metric.color }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Updated {metric.lastUpdated}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none z-0"></div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-6 relative z-10">Today's Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-xl flex-shrink-0 shadow-sm border border-amber-200/50">🏃‍♀️</div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-sm mb-1">Activity Level</h4>
                      <p className="text-xs font-medium text-slate-500 mb-3">Moderate - You're doing great!</p>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{width: '75%'}}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-xl flex-shrink-0 shadow-sm border border-emerald-200/50">🥗</div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-sm mb-1">Nutrition</h4>
                      <p className="text-xs font-medium text-slate-500 mb-3">Good hydration, balanced</p>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl flex-shrink-0 shadow-sm border border-purple-200/50">😌</div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-sm mb-1">Wellness</h4>
                      <p className="text-xs font-medium text-slate-500 mb-3">Excellent sleep quality</p>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{width: '90%'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metrics Tab */}
          {activeTab === 'metrics' && (
            <div className="space-y-6 md:space-y-8">
              {healthMetrics.map((metric) => (
                <div key={metric.id} className="bg-white rounded-[2rem] p-5 md:p-8 border border-slate-100 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white/50" style={{background: `${metric.color}20`}}>
                        {metric.icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-black text-slate-800">{metric.name}</h3>
                    </div>
                    <div className="text-2xl md:text-3xl font-black tracking-tight" style={{color: metric.color}}>
                      {metric.value} <span className="text-sm font-bold text-slate-400">{metric.unit}</span>
                    </div>
                  </div>
                  
                  <div className="h-48 md:h-64 w-full bg-slate-50 rounded-2xl border border-slate-100 p-4 md:p-6 flex flex-col justify-end relative">
                    <div className="flex items-end justify-between h-full gap-2 md:gap-4 relative z-10 w-full pl-6 md:pl-8">
                      {/* Fake Chart Bars with Tailwind */}
                      {[40, 65, 45, 80, 55, 90, metric.value / metric.target * 100].map((h, i) => (
                        <div key={i} className="w-full flex justify-center group relative h-full items-end">
                           <div className="absolute opacity-0 group-hover:opacity-100 -top-8 bg-slate-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg transition-opacity whitespace-nowrap z-20">
                             {h.toFixed(0)} {metric.unit}
                           </div>
                           <div 
                              className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 hover:opacity-80 relative overflow-hidden"
                              style={{ height: `${Math.min(h, 100)}%`, background: i === 6 ? metric.color : `${metric.color}60` }}
                           >
                              <div className="absolute inset-x-0 bottom-0 bg-white/20 h-1/2"></div>
                           </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute top-4 left-2 bottom-8 flex flex-col justify-between text-[10px] font-bold text-slate-400">
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                    </div>

                    <div className="flex justify-between mt-3 pt-3 border-t border-slate-200 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest pl-6 md:pl-8">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span className="text-slate-800">Sun</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-900/20">
                      📝 Log Data
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all active:scale-95 border border-slate-200">
                      📊 View Trends
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-[2.5rem] p-5 md:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none z-0"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-100 relative z-10">
                <h2 className="text-xl md:text-2xl font-black text-slate-800">Health History</h2>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  {['All', 'This Week', 'This Month'].map(f => (
                    <button key={f} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${f === 'All' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="relative border-l-2 border-slate-100 ml-4 md:ml-6 space-y-8 pb-4 z-10">
                {healthRecords.map((record) => (
                  <div key={record.id} className="relative pl-6 md:pl-8">
                    <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_0_4px_white,0_0_0_6px_#e2e8f0]"></div>
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5 hover:shadow-md transition-all group">
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                          📅 {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric'})}
                       </div>
                       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <h4 className="font-black text-slate-800 text-base md:text-lg">{record.type}</h4>
                            {record.notes && <p className="text-xs font-medium text-slate-500 mt-1">{record.notes}</p>}
                          </div>
                          <div className="text-lg md:text-xl font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors self-start sm:self-auto">
                            {record.value} <span className="text-[10px] md:text-xs">
                                {healthMetrics.find(m => m.name === record.type)?.unit || ''}
                            </span>
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goals Tab */}
          {activeTab === 'goals' && (
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 relative z-10">Health Goals</h2>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-500/20 relative z-10 flex items-center justify-center gap-2 text-sm">
                  <span>+</span> Add Goal
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
                {healthMetrics.map((metric) => (
                  <div key={metric.id} className="bg-white rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm flex flex-col">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-50">
                      <span className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-xl border border-slate-100">{metric.icon}</span>
                      <h4 className="font-black text-slate-800 text-lg">{metric.name}</h4>
                    </div>
                    
                    <div className="flex-grow space-y-4 mb-6">
                      <div className="flex justify-between items-center text-xs md:text-sm font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-slate-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400"></span> Current: {metric.value} {metric.unit}</span>
                        <span className="text-indigo-600 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-indigo-500"></span> Target: {metric.target} {metric.unit}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-[2px]">
                          <div 
                            className="h-full rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: `${getProgressPercentage(metric.value, metric.target)}%`, background: metric.color }}
                          ></div>
                        </div>
                        <div className="text-right text-[10px] font-black uppercase tracking-widest" style={{color: metric.color}}>
                          {Math.round(getProgressPercentage(metric.value, metric.target))}% Complete
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-50 border-dashed">
                      <button className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold py-2.5 rounded-xl transition-all border border-slate-200 text-xs">
                        ✏️ Edit
                      </button>
                      <button className="flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition-all shadow-lg shadow-slate-900/10 text-xs">
                        📊 Track
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
