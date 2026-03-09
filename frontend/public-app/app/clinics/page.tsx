"use client";
import { useState, useEffect } from 'react';
import './clinics.css';

interface Clinic {
  id: number;
  name: string;
  address: string;
  distance: string;
  waitingTime: number;
  rating: number;
  departments: string[];
  phone: string;
  isOpen: boolean;
  emergencyService: boolean;
  image: string;
}

export default function ClinicsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [sortBy, setSortBy] = useState('distance');
  const [showFilters, setShowFilters] = useState(false);

  const [clinics] = useState<Clinic[]>([
    {
      id: 1,
      name: "Central Government Hospital",
      address: "123 Main Street, Downtown",
      distance: "0.5 km",
      waitingTime: 15,
      rating: 4.8,
      departments: ["General Medicine", "Emergency", "Cardiology"],
      phone: "+1 (555) 123-4567",
      isOpen: true,
      emergencyService: true,
      image: "/hospital1.jpg"
    },
    {
      id: 2,
      name: "City Health Clinic",
      address: "456 Oak Avenue, Midtown",
      distance: "1.2 km",
      waitingTime: 25,
      rating: 4.6,
      departments: ["General Medicine", "Pediatrics", "Dermatology"],
      phone: "+1 (555) 234-5678",
      isOpen: true,
      emergencyService: false,
      image: "/hospital2.jpg"
    },
    {
      id: 3,
      name: "Community Medical Center",
      address: "789 Pine Road, Westside",
      distance: "2.1 km",
      waitingTime: 35,
      rating: 4.4,
      departments: ["General Medicine", "Orthopedics", "Neurology"],
      phone: "+1 (555) 345-6789",
      isOpen: false,
      emergencyService: true,
      image: "/hospital3.jpg"
    },
    {
      id: 4,
      name: "Regional Health Hub",
      address: "321 Cedar Lane, Northside",
      distance: "3.0 km",
      waitingTime: 10,
      rating: 4.9,
      departments: ["General Medicine", "Emergency", "Surgery", "ICU"],
      phone: "+1 (555) 456-7890",
      isOpen: true,
      emergencyService: true,
      image: "/hospital4.jpg"
    },
    {
      id: 5,
      name: "Family Care Clinic",
      address: "654 Elm Street, Southside",
      distance: "2.8 km",
      waitingTime: 20,
      rating: 4.3,
      departments: ["Family Medicine", "Pediatrics", "Women's Health"],
      phone: "+1 (555) 567-8901",
      isOpen: true,
      emergencyService: false,
      image: "/hospital5.jpg"
    },
    {
      id: 6,
      name: "Emergency Medical Center",
      address: "987 Maple Drive, Eastside",
      distance: "4.5 km",
      waitingTime: 5,
      rating: 4.7,
      departments: ["Emergency", "Trauma", "Critical Care"],
      phone: "+1 (555) 678-9012",
      isOpen: true,
      emergencyService: true,
      image: "/hospital6.jpg"
    }
  ]);

  const departments = ["All Departments", "General Medicine", "Emergency", "Cardiology", "Pediatrics", "Dermatology", "Orthopedics", "Neurology", "Surgery", "ICU", "Family Medicine", "Women's Health", "Trauma", "Critical Care"];

  const filteredClinics = clinics
    .filter(clinic => 
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(clinic => 
      selectedDepartment === '' || selectedDepartment === 'All Departments' || 
      clinic.departments.includes(selectedDepartment)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return parseFloat(a.distance) - parseFloat(b.distance);
        case 'waitingTime':
          return a.waitingTime - b.waitingTime;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const getWaitingTimeColor = (time: number) => {
    if (time <= 15) return 'low';
    if (time <= 30) return 'medium';
    return 'high';
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 sm:px-6 lg:px-8 font-sans pb-28 md:pb-12">
      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-8 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-80 h-48 md:h-80 bg-teal-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>

          <div className="relative z-10 w-full md:w-1/2">
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-1.5 md:mb-2">Find Nearby Clinics</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-snug">
              Discover quality healthcare facilities near you with real-time information
            </p>
          </div>

          <div className="relative z-10 flex flex-nowrap w-full overflow-x-auto no-scrollbar gap-3 md:w-auto mask-fade-edges pb-1">
            <div className="flex flex-col items-center justify-center p-3 md:p-4 px-5 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="text-xl md:text-2xl font-black text-teal-600 mb-0.5">{clinics.length}</span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Clinics Found</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 md:p-4 px-5 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <span className="text-xl md:text-2xl font-black text-blue-600 mb-0.5">{clinics.filter(c => c.isOpen).length}</span>
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Currently Open</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 md:p-4 px-5 bg-rose-50/50 border border-rose-100 rounded-2xl">
              <span className="text-xl md:text-2xl font-black text-rose-600 mb-0.5">{clinics.filter(c => c.emergencyService).length}</span>
              <span className="text-[10px] md:text-xs font-bold text-rose-400 uppercase tracking-widest text-center whitespace-nowrap">Emergency Services</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full flex-grow">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-slate-400">
                  <circle cx="11" cy="11" r="8" strokeWidth="2.5"/>
                  <path d="m21 21-4.35-4.35" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search clinics by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium text-sm md:text-base"
              />
            </div>

            <button 
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all active:scale-95 border ${showFilters ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200'}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" strokeWidth="2.5" strokeLinejoin="round"/>
              </svg>
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Department</label>
                <select 
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold appearance-none text-sm"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Sort By</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-bold appearance-none text-sm"
                >
                  <option value="distance">Close Distance</option>
                  <option value="waitingTime">Lowest Waiting Time</option>
                  <option value="rating">Highest Rating</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Clinics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {filteredClinics.map((clinic) => (
            <div key={clinic.id} className={`bg-white rounded-[2rem] border overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${!clinic.isOpen ? 'border-slate-200 opacity-80 backdrop-grayscale' : 'border-slate-100 shadow-sm'}`}>
              
              <div className="relative h-40 bg-slate-100 w-full flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-slate-800/10"></div>
                <div className="text-5xl drop-shadow-lg z-10">🏥</div>
                
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                   {clinic.emergencyService && (
                      <span className="bg-rose-500/90 backdrop-blur-md text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm">
                        Emergency
                      </span>
                   )}
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm backdrop-blur-md ${clinic.isOpen ? 'bg-emerald-500/90 text-white' : 'bg-slate-700/80 text-white'}`}>
                    {clinic.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight mb-1">{clinic.name}</h3>
                <p className="text-xs font-bold text-slate-500 mb-4 line-clamp-1">{clinic.address}</p>

                <div className="flex items-center gap-4 mb-5">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <span className="text-base">📍</span>
                    <span className="text-xs font-bold text-slate-700">{clinic.distance}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-100">
                    <span className="text-base">⭐</span>
                    <span className="text-xs font-black text-amber-700">{clinic.rating}</span>
                  </div>
                </div>

                <div className="space-y-4 flex-grow mb-6">
                  <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Wait Time</span>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        getWaitingTimeColor(clinic.waitingTime) === 'low' ? 'bg-emerald-100 text-emerald-700' :
                        getWaitingTimeColor(clinic.waitingTime) === 'medium' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                    }`}>
                      {clinic.waitingTime} mins
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Departments</span>
                    <div className="flex flex-wrap gap-1.5">
                      {clinic.departments.slice(0, 2).map((dept, index) => (
                        <span key={index} className="bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold px-2 py-1 rounded-md">{dept}</span>
                      ))}
                      {clinic.departments.length > 2 && (
                        <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-2 py-1 rounded-md">+{clinic.departments.length - 2}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-50 border-dashed">
                  <button className="flex items-center justify-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all active:scale-95 shadow-lg shadow-teal-500/20">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"/>
                    </svg>
                    Details
                  </button>
                  <button className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition-all active:scale-95">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    Call
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClinics.length === 0 && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-16 flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-slate-100 mb-4">🔍</div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-2">No clinics found</h3>
            <p className="text-sm text-slate-500 font-medium">
              Try adjusting your search criteria or filters to find what you need.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
