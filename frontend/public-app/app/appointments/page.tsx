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
    <div className="appointments-page">
      <div className="appointments-container">
        {/* Header Section */}
        <div className="appointments-header">
          <div className="header-content">
            <h1 className="page-title">Book Your Appointment</h1>
            <p className="page-subtitle">Schedule a consultation with our expert healthcare professionals</p>
          </div>
          <div className="appointment-illustration">
            <div className="illustration-circle">
              <svg viewBox="0 0 100 100" className="medical-icon">
                <circle cx="50" cy="50" r="45" fill="#3b82f6" opacity="0.1"/>
                <circle cx="50" cy="50" r="35" fill="#3b82f6" opacity="0.2"/>
                <path d="M30 50h40M50 30v40" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round"/>
                <circle cx="50" cy="50" r="25" fill="none" stroke="#3b82f6" strokeWidth="2"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="progress-indicator">
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${(currentStep / 3) * 100}%`}}></div>
          </div>
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Personal Info</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Appointment</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Confirmation</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <h2 className="step-title">Personal Information</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="form-input"
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Emergency Contact</label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Emergency contact number"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Appointment Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <h2 className="step-title">Appointment Details</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Doctor *</label>
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Doctor</option>
                    {formData.department && doctors[formData.department as keyof typeof doctors]?.map(doctor => (
                      <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Appointment Date *</label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Time *</label>
                  <div className="time-slots">
                    {timeSlots.map(time => (
                      <button
                        key={time}
                        type="button"
                        className={`time-slot ${formData.appointmentTime === time ? 'selected' : ''}`}
                        onClick={() => setFormData(prev => ({ ...prev, appointmentTime: time }))}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group full-width">
                  <label className="form-label">Symptoms / Reason for Visit</label>
                  <textarea
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Please describe your symptoms or reason for the appointment"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="form-step">
              <h2 className="step-title">Confirm Your Appointment</h2>
              <div className="confirmation-card">
                <div className="confirmation-header">
                  <div className="confirm-icon">✓</div>
                  <h3>Appointment Summary</h3>
                </div>
                <div className="confirmation-details">
                  <div className="detail-row">
                    <span className="detail-label">Patient Name:</span>
                    <span className="detail-value">{formData.patientName}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Department:</span>
                    <span className="detail-value">{formData.department}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Doctor:</span>
                    <span className="detail-value">{formData.doctor}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Date & Time:</span>
                    <span className="detail-value">{formData.appointmentDate} at {formData.appointmentTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Contact:</span>
                    <span className="detail-value">{formData.email} | {formData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                Previous
              </button>
            )}
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="btn-primary">
                Next Step
              </button>
            ) : (
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Booking…' : 'Book Appointment'}
                </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
