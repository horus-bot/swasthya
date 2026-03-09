"use client";
import { useState } from 'react';
import { bookAppointment } from '../lib/api/appointments.service';
import './page.css';

interface FormData {
  patientName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  appointmentDate: string;
  appointmentTime: string;
  department: string;
  doctor: string;
  symptoms: string;
  emergencyContact: string;
}

export default function AppointmentsPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    patientName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    appointmentDate: '',
    appointmentTime: '',
    department: '',
    doctor: '',
    symptoms: '',
    emergencyContact: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    // Handle form submission: create appointment in DB
    (async () => {
      try {
        setIsSubmitting(true);
        await bookAppointment({
          hospital_id: '', // set hospital id if available
          name: formData.patientName,
          email: formData.email,
          phone: formData.phone,
          d_o_birth: formData.dateOfBirth,
          emergency_contact: formData.emergencyContact,
          depart: formData.department,
          preferred_doc: formData.doctor,
          appointment_date: formData.appointmentDate,
          preferred_time: formData.appointmentTime
        });
        // advance to confirmation step
        setCurrentStep(3);
      } catch (err: any) {
        // Log full error for debugging
        console.error('Failed to book appointment:', err);
        const message = err?.message || (typeof err === 'object' ? JSON.stringify(err) : String(err));
        alert(`Failed to book appointment: ${message}`);
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const departments = [
    'General Medicine', 'Cardiology', 'Dermatology', 
    'Orthopedics', 'Pediatrics', 'Gynecology', 
    'Neurology', 'Emergency', 'Dentistry'
  ];

  const doctors = {
    'General Medicine': ['Dr. Sarah Johnson', 'Dr. Michael Brown', 'Dr. Lisa Chen'],
    'Cardiology': ['Dr. Robert Wilson', 'Dr. Emily Davis', 'Dr. James Miller'],
    'Dermatology': ['Dr. Anna Garcia', 'Dr. David Lee', 'Dr. Maria Rodriguez'],
    'Orthopedics': ['Dr. Thomas Anderson', 'Dr. Jennifer White', 'Dr. Kevin Taylor'],
    'Pediatrics': ['Dr. Susan Moore', 'Dr. Christopher Jones', 'Dr. Amanda Clark'],
    'Gynecology': ['Dr. Rachel Green', 'Dr. Nicole Adams', 'Dr. Stephanie Hall'],
    'Neurology': ['Dr. Mark Thompson', 'Dr. Laura Martinez', 'Dr. Daniel Lewis'],
    'Emergency': ['Dr. Emergency Team'],
    'Dentistry': ['Dr. Paul Walker', 'Dr. Helen Scott', 'Dr. Ryan King']
  };

  return (
    <div className="min-h-screen bg-slate-50 py-6 md:py-10 px-3 sm:px-6 lg:px-8 font-sans pb-28 md:pb-12">
      <div className="max-w-3xl mx-auto space-y-6 md:space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-blue-50 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>
          
          <div className="relative z-10 w-full">
            <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight mb-1.5 md:mb-2">Book Your Appointment</h1>
            <p className="text-sm md:text-base text-slate-500 font-medium leading-snug">
              Schedule a consultation with our expert healthcare professionals
            </p>
          </div>
          
          <div className="relative z-10 hidden sm:flex w-14 md:w-16 h-14 md:h-16 rounded-full bg-blue-50 items-center justify-center text-blue-600 border border-blue-100 shadow-sm flex-shrink-0">
             <svg viewBox="0 0 100 100" className="w-8 h-8 md:w-10 md:h-10">
                <circle cx="50" cy="50" r="45" fill="#3b82f6" opacity="0.1"/>
                <circle cx="50" cy="50" r="35" fill="#3b82f6" opacity="0.2"/>
                <path d="M30 50h40M50 30v40" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="#3b82f6" strokeWidth="2"/>
              </svg>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center relative z-10">
            {/* Background line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-blue-500 transition-all duration-500"
                   style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                ></div>
            </div>

            {[1, 2, 3].map((step) => (
              <div key={step} className="flex flex-col items-center gap-1.5 md:gap-2">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-bold border-2 transition-all duration-300 ${
                  currentStep >= step 
                    ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/20' 
                    : 'bg-white border-slate-200 text-slate-400'
                }`}>
                  {step}
                </div>
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider hidden sm:block ${
                  currentStep >= step ? 'text-blue-700' : 'text-slate-400'
                }`}>
                  {step === 1 ? 'Personal Info' : step === 2 ? 'Appointment' : 'Confirmation'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-100">
          
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Appointment Details */}
          {currentStep === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-5">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-4">Appointment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Doctor *</label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium appearance-none disabled:opacity-50"
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Doctor</option>
                    {formData.department && doctors[formData.department as keyof typeof doctors]?.map(doctor => (
                      <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Appointment Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Preferred Time *</label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-95 ${
                            formData.appointmentTime === time 
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, appointmentTime: time }))}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Symptoms / Reason for Visit</label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                    placeholder="Please describe your symptoms or reason for the appointment"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl md:text-2xl font-black text-slate-800 mb-4">Confirm Your Appointment</h2>
              
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-3xl -mx-10 -my-10 pointer-events-none"></div>

                <div className="flex items-center gap-3 mb-5 border-b border-slate-200 pb-4 relative z-10">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl shadow-sm border border-emerald-200">
                    ✓
                  </div>
                  <h3 className="font-bold text-slate-800">Appointment Summary</h3>
                </div>

                <div className="space-y-3 relative z-10">
                  <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-100 dashed last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Patient Name</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 sm:mt-0">{formData.patientName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-100 dashed last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Department</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 sm:mt-0">{formData.department}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-100 dashed last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Doctor</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 sm:mt-0">{formData.doctor}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-slate-100 dashed last:border-0">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date & Time</span>
                    <span className="text-sm font-black text-blue-600 mt-1 sm:mt-0 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 shadow-sm">{formData.appointmentDate} at {formData.appointmentTime}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between py-1">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Contact</span>
                    <span className="text-sm font-bold text-slate-800 mt-1 sm:mt-0">{formData.email} • {formData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between mt-8 pt-6 border-t border-slate-100">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="w-full sm:w-auto px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl md:rounded-full transition-all active:scale-95 border border-slate-200"
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-blue-600 text-white font-bold rounded-xl md:rounded-full transition-all active:scale-95 shadow-lg shadow-slate-900/20 disabled:opacity-50"
              >
                Next Step
              </button>
            ) : (
                <button 
                  type="submit" 
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl md:rounded-full transition-all active:scale-95 shadow-lg shadow-blue-500/30 disabled:opacity-50" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking…' : 'Book Appointment'}
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
