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
    <div className="reports-page">
      <div className="reports-container">
        {/* Header Section */}
        <div className="reports-header">
          <div className="header-content">
            <h1 className="page-title">Report / Request Services</h1>
            <p className="page-subtitle">Help us improve healthcare services by reporting issues or requesting new services</p>
          </div>
          <div className="reports-illustration">
            <div className="illustration-circle">
              <svg viewBox="0 0 100 100" className="reports-icon">
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
        </div>

        {/* Progress Indicator */}
        <div className="progress-container">
          <div className="progress-steps">
            <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <span className="step-label">Report Type</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <span className="step-label">Details</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span className="step-label">Contact Info</span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="reports-form">
          {currentStep === 1 && (
            <div className="form-section">
              <h2 className="section-title">What would you like to do?</h2>
              <p className="section-subtitle">Choose the type of report or request</p>
              
              <div className="report-types-grid">
                {reportTypes.map(type => (
                  <label key={type.value} className={`report-type-card ${formData.reportType === type.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="reportType"
                      value={type.value}
                      checked={formData.reportType === type.value}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div className="card-header">
                      <h3 className="card-title">{type.label}</h3>
                    </div>
                    <p className="card-description">{type.desc}</p>
                  </label>
                ))}
              </div>

              {formData.reportType && (
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="form-select"
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
            <div className="form-section">
              <h2 className="section-title">Provide Details</h2>
              <p className="section-subtitle">Help us understand the issue or request better</p>
              
              <div className="form-group">
                <label className="form-label">Title / Summary *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Brief summary of your report or request"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-textarea"
                  placeholder="Provide detailed information about your report or request..."
                  rows={6}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location *</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Facility name, address, or area"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Priority Level *</label>
                <div className="urgency-levels">
                  {urgencyLevels.map(level => (
                    <label key={level.value} className={`urgency-card ${formData.urgency === level.value ? 'selected' : ''}`}>
                      <input
                        type="radio"
                        name="urgency"
                        value={level.value}
                        checked={formData.urgency === level.value}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div className="urgency-header">
                        <span className={`urgency-indicator ${level.value}`}></span>
                        <span className="urgency-label">{level.label}</span>
                      </div>
                      <p className="urgency-desc">{level.desc}</p>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="form-section">
              <h2 className="section-title">Contact Information</h2>
              <p className="section-subtitle">How can we reach you for follow-up?</p>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Summary Section */}
              <div className="summary-section">
                <h3 className="summary-title">Review Your Report</h3>
                <div className="summary-content">
                  <div className="summary-item">
                    <span className="summary-label">Type:</span>
                    <span className="summary-value">{reportTypes.find(t => t.value === formData.reportType)?.label}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Category:</span>
                    <span className="summary-value">{formData.category}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Title:</span>
                    <span className="summary-value">{formData.title}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Location:</span>
                    <span className="summary-value">{formData.location}</span>
                  </div>
                  <div className="summary-item">
                    <span className="summary-label">Priority:</span>
                    <span className={`summary-value priority-${formData.urgency}`}>
                      {urgencyLevels.find(l => l.value === formData.urgency)?.label}
                    </span>
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
            
            {currentStep < 3 && (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
                disabled={
                  (currentStep === 1 && (!formData.reportType || !formData.category)) ||
                  (currentStep === 2 && (!formData.title || !formData.description || !formData.location))
                }
              >
                Next
              </button>
            )}

            {currentStep === 3 && (
              <button
                type="submit"
                className="btn-primary"
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
