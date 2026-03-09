"use client";
import { useState } from 'react';
import './page.css';

interface ReportFormData {
  reportType: string;
  category: string;
  title: string;
  description: string;
  location: string;
  urgency: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  attachments?: File[];
}

export default function ReportsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ReportFormData>({
    reportType: '',
    category: '',
    title: '',
    description: '',
    location: '',
    urgency: 'medium',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    attachments: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Report submitted:', formData);
    // Handle form submission
    alert('Report submitted successfully! We will review it and get back to you.');
    // Reset form
    setFormData({
      reportType: '',
      category: '',
      title: '',
      description: '',
      location: '',
      urgency: 'medium',
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      attachments: []
    });
    setCurrentStep(1);
  };

  const reportTypes = [
    { value: 'issue', label: 'Report an Issue', desc: 'Report problems with healthcare services or facilities' },
    { value: 'request', label: 'Request Services', desc: 'Request new healthcare services or improvements' },
    { value: 'feedback', label: 'Provide Feedback', desc: 'Share your experience or suggestions' },
    { value: 'emergency', label: 'Emergency Report', desc: 'Report urgent health emergencies or outbreaks' }
  ];

  const categories = {
    issue: [
      'Facility Issues',
      'Staff Behavior',
      'Equipment Problems',
      'Cleanliness/Hygiene',
      'Appointment Issues',
      'Billing Problems',
      'Medical Emergency',
      'Other'
    ],
    request: [
      'New Healthcare Facility',
      'Mobile Health Unit',
      'Specialist Services',
      'Emergency Services',
      'Ambulance Services',
      'Medical Equipment',
      'Vaccination Services',
      'Health Awareness Programs'
    ],
    feedback: [
      'Service Quality',
      'Staff Performance',
      'Facility Condition',
      'Waiting Times',
      'Treatment Outcome',
      'General Suggestions',
      'Appreciation',
      'Other'
    ],
    emergency: [
      'Disease Outbreak',
      'Medical Emergency',
      'Facility Emergency',
      'Public Health Threat',
      'Environmental Health Issue',
      'Water/Food Contamination',
      'Other Emergency'
    ]
  };

  const urgencyLevels = [
    { value: 'low', label: 'Low', desc: 'General feedback or non-urgent requests' },
    { value: 'medium', label: 'Medium', desc: 'Important issues that need attention' },
    { value: 'high', label: 'High', desc: 'Urgent issues affecting health services' },
    { value: 'critical', label: 'Critical', desc: 'Immediate attention required - emergency' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 sm:px-6 lg:px-8 font-sans pb-28 md:pb-12">
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-emerald-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
          
          <div className="relative z-10 w-full">
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-1.5 md:mb-2">Report / Request Services</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-snug">
              Help us improve healthcare services by reporting issues or requesting new services
            </p>
          </div>
          
          <div className="relative z-10 hidden sm:flex w-14 md:w-16 h-14 md:h-16 rounded-full bg-emerald-50 items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm flex-shrink-0">
             <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
                <circle cx="50" cy="50" r="45" fill="#059669" opacity="0.1"/>
                <circle cx="50" cy="50" r="35" fill="#059669" opacity="0.2"/>
                <rect x="30" y="25" width="40" height="50" fill="none" stroke="#065f46" strokeWidth="2" rx="2"/>
                <line x1="38" y1="35" x2="62" y2="35" stroke="#059669" strokeWidth="2"/>
                <line x1="38" y1="45" x2="58" y2="45" stroke="#059669" strokeWidth="1.5"/>
                <line x1="38" y1="55" x2="62" y2="55" stroke="#059669" strokeWidth="1.5"/>
                <line x1="38" y1="65" x2="55" y2="65" stroke="#059669" strokeWidth="1.5"/>
              </svg>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center relative z-10">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-emerald-500 transition-all duration-500"
                   style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                ></div>
            </div>

            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center gap-1.5 md:gap-2">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {step}
                </div>
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:block ${
                  currentStep >= step ? 'text-emerald-700' : 'text-slate-400'
                }`}>
                  {step === 1 ? 'Report Type' : step === 2 ? 'Details' : 'Contact Info'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-1">What would you like to do?</h2>
              <p className="text-sm text-slate-500 mb-6">Choose the type of report or request</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6">
                {reportTypes.map(type => (
                  <label key={type.value} className={`relative flex flex-col p-4 md:p-5 rounded-2xl border-2 transition-all cursor-pointer hover:bg-slate-50 ${
                    formData.reportType === type.value 
                      ? 'border-emerald-500 bg-emerald-50/30 shadow-sm' 
                      : 'border-slate-100'
                  }`}>
                    <input
                      type="radio"
                      name="reportType"
                      value={type.value}
                      checked={formData.reportType === type.value}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className="font-bold text-slate-800 text-sm md:text-base mb-1">{type.label}</span>
                    <span className="text-xs text-slate-500 leading-relaxed">{type.desc}</span>
                    
                    {/* Selected Checkmark */}
                    <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                       formData.reportType === type.value ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                    }`}>
                       {formData.reportType === type.value && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                    </div>
                  </label>
                ))}
              </div>

              {formData.reportType && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium appearance-none"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories[formData.reportType as keyof typeof categories]?.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <div>
                 <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-1">Provide Details</h2>
                 <p className="text-sm text-slate-500">Help us understand the issue or request better</p>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Title / Summary *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="Brief summary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium resize-none"
                  placeholder="Provide detailed information..."
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                  placeholder="Facility name, address, or area"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Priority Level *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {urgencyLevels.map(level => {
                     // Colors based on urgency
                     let colorProfile = "border-slate-100 bg-white";
                     let dotColor = "bg-slate-300";
                     
                     if (formData.urgency === level.value) {
                         if (level.value === 'low') { colorProfile = "border-blue-500 bg-blue-50/50"; dotColor = "bg-blue-500"; }
                         if (level.value === 'medium') { colorProfile = "border-amber-500 bg-amber-50/50"; dotColor = "bg-amber-500"; }
                         if (level.value === 'high') { colorProfile = "border-orange-500 bg-orange-50/50"; dotColor = "bg-orange-500"; }
                         if (level.value === 'critical') { colorProfile = "border-rose-500 bg-rose-50/50"; dotColor = "bg-rose-500"; }
                     } else {
                         if (level.value === 'low') dotColor = "bg-blue-400";
                         if (level.value === 'medium') dotColor = "bg-amber-400";
                         if (level.value === 'high') dotColor = "bg-orange-400";
                         if (level.value === 'critical') dotColor = "bg-rose-400";
                     }

                     return (
                      <label key={level.value} className={`relative p-3 md:p-4 rounded-xl border-2 transition-all cursor-pointer hover:bg-slate-50 ${colorProfile}`}>
                        <input
                          type="radio"
                          name="urgency"
                          value={level.value}
                          checked={formData.urgency === level.value}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`}></span>
                          <span className="font-bold text-slate-800 text-sm">{level.label}</span>
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-500 leading-tight block">{level.desc}</p>
                      </label>
                     );
                  })}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <div>
                <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-1">Contact Information</h2>
                <p className="text-sm text-slate-500">How can we reach you for follow-up?</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                    placeholder="name@email.com"
                    required
                  />
                </div>
              </div>

              {/* Summary Section */}
              <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100 mt-6">
                <h3 className="font-bold text-slate-800 text-sm mb-3 uppercase tracking-wider">Review Your Report</h3>
                <div className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center bg-white p-2.5 px-3 md:px-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type</span>
                    <span className="text-sm font-bold text-slate-800">{reportTypes.find(t => t.value === formData.reportType)?.label}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white p-2.5 px-3 md:px-4 rounded-xl border border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Priority</span>
                    <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                      {urgencyLevels.find(l => l.value === formData.urgency)?.label}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between mt-8 pt-6 border-t border-slate-100">
            {currentStep > 1 ? (
              <button 
                type="button" 
                onClick={prevStep} 
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl md:rounded-full transition-all active:scale-95 border border-slate-200"
              >
                Previous
              </button>
            ) : <div className="hidden sm:block"></div>}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-emerald-600 text-white font-bold rounded-xl md:rounded-full transition-all active:scale-95 shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:active:scale-100"
                disabled={
                  (currentStep === 1 && (!formData.reportType || !formData.category)) ||
                  (currentStep === 2 && (!formData.title || !formData.description || !formData.location))
                }
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl md:rounded-full transition-all active:scale-95 shadow-lg shadow-emerald-500/30 disabled:opacity-50"
                disabled={!formData.contactName || !formData.contactPhone || !formData.contactEmail}
              >
                Submit Report
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
