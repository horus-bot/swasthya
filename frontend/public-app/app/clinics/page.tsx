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
    <div className="clinics-page">
      {/* Header Section */}
      <div className="clinics-header">
        <div className="header-content">
          <h1 className="page-title">Find Nearby Clinics</h1>
          <p className="page-subtitle">
            Discover quality healthcare facilities near you with real-time information
          </p>
        </div>
        <div className="header-stats">
          <div className="stat">
            <span className="stat-number">{clinics.length}</span>
            <span className="stat-label">Clinics Found</span>
          </div>
          <div className="stat">
            <span className="stat-number">{clinics.filter(c => c.isOpen).length}</span>
            <span className="stat-label">Currently Open</span>
          </div>
          <div className="stat">
            <span className="stat-number">{clinics.filter(c => c.emergencyService).length}</span>
            <span className="stat-label">Emergency Services</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="search-section">
        <div className="search-container">
          <div className="search-bar">
            <div className="search-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search clinics by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <button 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
            </svg>
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="filters-panel">
            <div className="filter-group">
              <label className="filter-label">Department</label>
              <select 
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="filter-select"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort By</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="distance">Distance</option>
                <option value="waitingTime">Waiting Time</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Clinics Grid */}
      <div className="clinics-container">
        <div className="clinics-grid">
          {filteredClinics.map((clinic) => (
            <div key={clinic.id} className={`clinic-card ${!clinic.isOpen ? 'closed' : ''}`}>
              <div className="clinic-header">
                <div className="clinic-image">
                  <div className="image-placeholder">🏥</div>
                  {clinic.emergencyService && (
                    <div className="emergency-badge">Emergency</div>
                  )}
                </div>
                <div className="clinic-status">
                  <span className={`status-badge ${clinic.isOpen ? 'open' : 'closed'}`}>
                    {clinic.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
              </div>

              <div className="clinic-info">
                <h3 className="clinic-name">{clinic.name}</h3>
                <p className="clinic-address">{clinic.address}</p>

                <div className="clinic-details">
                  <div className="detail-row">
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span className="detail-text">{clinic.distance}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">⭐</span>
                      <span className="detail-text">{clinic.rating}</span>
                    </div>
                  </div>

                  <div className="waiting-time">
                    <span className="waiting-label">Waiting Time:</span>
                    <span className={`waiting-value ${getWaitingTimeColor(clinic.waitingTime)}`}>
                      {clinic.waitingTime} mins
                    </span>
                  </div>

                  <div className="departments">
                    <span className="departments-label">Departments:</span>
                    <div className="department-tags">
                      {clinic.departments.slice(0, 3).map((dept, index) => (
                        <span key={index} className="department-tag">{dept}</span>
                      ))}
                      {clinic.departments.length > 3 && (
                        <span className="department-tag more">+{clinic.departments.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="clinic-actions">
                  <button className="btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
                    </svg>
                    View Details
                  </button>
                  <button className="btn-secondary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    Call
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredClinics.length === 0 && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3 className="no-results-title">No clinics found</h3>
            <p className="no-results-text">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
