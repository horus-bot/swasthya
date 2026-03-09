export type Severity = 'Safe' | 'Watch' | 'Critical';
export type Disease = 'Dengue' | 'Malaria' | 'Covid-19' | 'Flu' | 'All';
export type TimeRange = 'Today' | '7 Days' | '30 Days' | 'Custom';

export interface KPI {
  id: string;
  label: string;
  value: string | number;
  trend: number; // percentage
  trendDir: 'up' | 'down' | 'neutral';
  status: Severity;
}

export interface Facility {
  id: string;
  name: string;
  type: 'Hospital' | 'Clinic' | 'Polyclinic';
  zone: string;
  opdLoad: number;
  bedOccupancy: number; // %
  icuOccupancy: number; // %
  staffAvailability: number; // %
  suppliesStatus: 'Good' | 'Low' | 'Critical';
  status: Severity;
}

export interface Alert {
  id: string;
  title: string;
  type: 'Outbreak' | 'Overload' | 'Shortage';
  severity: 'Low' | 'Medium' | 'High';
  location: string;
  time: string;
}

export interface Outbreak {
  id: string;
  disease: string;
  location: string;
  cases: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface MobileUnit {
  id: string;
  name: string;
  status: 'Active' | 'Inactive' | 'Maintenance';
  currentLocation: string;
  servedToday: number;
  route: string[];
}
