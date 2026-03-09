import { KPI, Facility, Alert, Outbreak, MobileUnit } from '../types';

export const mockKPIs: KPI[] = [
  { id: '1', label: 'Facilities at Risk', value: 3, trend: 12, trendDir: 'up', status: 'Critical' },
  { id: '2', label: 'Avg Bed Occupancy', value: '78%', trend: 5, trendDir: 'up', status: 'Watch' },
  { id: '3', label: 'ICU Occupancy', value: '45%', trend: 2, trendDir: 'down', status: 'Safe' },
  { id: '4', label: 'OPD Load Today', value: 12450, trend: 8, trendDir: 'up', status: 'Watch' },
  { id: '5', label: 'Avg Travel Time', value: '24m', trend: 0, trendDir: 'neutral', status: 'Safe' },
  { id: '6', label: 'Care Desert Pop.', value: '12.5k', trend: 0, trendDir: 'neutral', status: 'Watch' },
  { id: '7', label: 'Active Outbreaks', value: 2, trend: 100, trendDir: 'up', status: 'Critical' },
  { id: '8', label: 'Mobile Units Active', value: 15, trend: 0, trendDir: 'neutral', status: 'Safe' },
];

export const mockFacilities: Facility[] = [
  { id: '1', name: 'General Hospital Chennai', type: 'Hospital', zone: 'North', opdLoad: 850, bedOccupancy: 92, icuOccupancy: 80, staffAvailability: 60, suppliesStatus: 'Low', status: 'Critical' },
  { id: '2', name: 'Anna Nagar Clinic', type: 'Clinic', zone: 'West', opdLoad: 120, bedOccupancy: 40, icuOccupancy: 0, staffAvailability: 90, suppliesStatus: 'Good', status: 'Safe' },
  { id: '3', name: 'Adyar City Hospital', type: 'Hospital', zone: 'South', opdLoad: 450, bedOccupancy: 75, icuOccupancy: 60, staffAvailability: 85, suppliesStatus: 'Good', status: 'Watch' },
  { id: '4', name: 'T. Nagar Polyclinic', type: 'Polyclinic', zone: 'Central', opdLoad: 300, bedOccupancy: 10, icuOccupancy: 0, staffAvailability: 95, suppliesStatus: 'Good', status: 'Safe' },
  { id: '5', name: 'Velachery Emergency Center', type: 'Hospital', zone: 'South', opdLoad: 200, bedOccupancy: 88, icuOccupancy: 75, staffAvailability: 50, suppliesStatus: 'Critical', status: 'Critical' },
];

export const mockAlerts: Alert[] = [
  { id: '1', title: 'Dengue Outbreak Risk', type: 'Outbreak', severity: 'High', location: 'Tondiarpet', time: '2 hrs ago' },
  { id: '2', title: 'ICU Overload Prediction', type: 'Overload', severity: 'High', location: 'General Hospital', time: '4 hrs ago' },
  { id: '3', title: 'Oxygen Supply Low', type: 'Shortage', severity: 'Medium', location: 'Velachery Emergency', time: '5 hrs ago' },
  { id: '4', title: 'Staff Shortage', type: 'Shortage', severity: 'Medium', location: 'North Zone', time: '1 day ago' },
];

export const mockOutbreaks: Outbreak[] = [
  { id: '1', disease: 'Dengue', location: 'Tondiarpet', cases: 45, riskLevel: 'High', trend: 'increasing' },
  { id: '2', disease: 'Malaria', location: 'Mylapore', cases: 12, riskLevel: 'Medium', trend: 'stable' },
  { id: '3', disease: 'Flu', location: 'Anna Nagar', cases: 89, riskLevel: 'Low', trend: 'decreasing' },
];

export const mockMobileUnits: MobileUnit[] = [
  { id: '1', name: 'Unit Alpha', status: 'Active', currentLocation: 'Marina Beach', servedToday: 120, route: ['Stop A', 'Stop B'] },
  { id: '2', name: 'Unit Beta', status: 'Maintenance', currentLocation: 'Depot', servedToday: 0, route: [] },
  { id: '3', name: 'Unit Gamma', status: 'Active', currentLocation: 'Guindy', servedToday: 85, route: ['Stop C', 'Stop D'] },
];
