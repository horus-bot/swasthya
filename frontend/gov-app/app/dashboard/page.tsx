"use client";

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Download,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Bed,
  Ambulance,
  Stethoscope,
  Microscope,
  AlertTriangle,
  Zap,
  Target,
  BarChart3,
  Clock,
  MapPin,
  Shield,
  Heart,
  Thermometer,
  Droplets,
  Syringe,
  Building2,
  Truck,
  Brain,
  Cpu,
  Wifi
} from 'lucide-react';
import { KpiGrid } from '@/components/dashboard/KpiGrid';
import { MapPreviewCard } from '@/components/dashboard/MapPreviewCard';
import { PriorityQueue } from '@/components/dashboard/PriorityQueue';
import { RecommendedActions } from '@/components/dashboard/RecommendedActions';
import { FeatureCardGrid } from '@/components/dashboard/FeatureCardGrid';

interface PredictionData {
  accessGap: {
    zones: Array<{
      zoneId: string;
      zoneName: string;
      population: number;
      hospitals: number;
      peoplePerHospital: number;
      status: 'Critical' | 'High' | 'Medium' | 'Low';
    }>;
    totalZones: number;
    criticalZones: number;
  };
  equipmentNeeds: {
    monthlyDemand: Array<{
      month: string;
      diagnosticEquipment: number;
      medicalSupplies: number;
      maintenanceBudget: number;
    }>;
  };
  emergencyDemand: {
    monthlyLoad: Array<{
      month: string;
      currentLoad: number;
      predictedLoad: number;
      increasePercentage: number;
    }>;
  };
  workforce: {
    monthlyProjection: Array<{
      month: string;
      doctors: { current: number; predicted: number; change: number };
      nurses: { current: number; predicted: number; change: number };
      paramedics: { current: number; predicted: number; change: number };
    }>;
  };
  bedOccupancy: {
    monthlyProjection: Array<{
      month: string;
      totalBeds: { current: number; predicted: number; change: number };
      icuBeds: { current: number; predicted: number; change: number };
      occupancyRate: number;
    }>;
  };
  diseases: {
    dengue: Array<{
      month: string;
      predictedCases: number;
      highRiskZones: number;
      severity: string;
    }>;
    diarrhea: Array<{
      month: string;
      predictedCases: number;
      outbreakRisk: string;
      affectedZones: number;
    }>;
    typhoid: Array<{
      month: string;
      predictedCases: number;
      vaccinationCoverage: number;
      hotspots: number;
    }>;
  };
  mobileUnits: {
    diseaseBreakouts: {
      dengue: {
        unitsNeeded: number;
        zones: string[];
        deploymentDuration: string;
      };
      typhoid: {
        unitsNeeded: number;
        zones: string[];
        deploymentDuration: string;
      };
      diarrhea: {
        unitsNeeded: number;
        zones: string[];
        deploymentDuration: string;
      };
    };
  };
}

// Mock data simulating real Chennai healthcare scenarios with zone-based analysis
const mockPredictionData: PredictionData = {
  accessGap: {
    zones: [
      { zoneId: "002", zoneName: "Kathivakkam", population: 45000, hospitals: 1, peoplePerHospital: 45000, status: "Critical" },
      { zoneId: "004", zoneName: "Ernavoor", population: 38000, hospitals: 1, peoplePerHospital: 38000, status: "High" },
      { zoneId: "006", zoneName: "Kuppam", population: 32000, hospitals: 1, peoplePerHospital: 32000, status: "Medium" },
      { zoneId: "011", zoneName: "Thiruvottiyur", population: 67000, hospitals: 2, peoplePerHospital: 33500, status: "Medium" },
      { zoneId: "015", zoneName: "Manali New Town", population: 28000, hospitals: 1, peoplePerHospital: 28000, status: "Low" },
      { zoneId: "021", zoneName: "Manali", population: 58000, hospitals: 1, peoplePerHospital: 58000, status: "Critical" },
      { zoneId: "026", zoneName: "Madhavaram", population: 65000, hospitals: 1, peoplePerHospital: 65000, status: "Critical" },
      { zoneId: "031", zoneName: "Kannabiran", population: 42000, hospitals: 1, peoplePerHospital: 42000, status: "High" },
      { zoneId: "037", zoneName: "Vyasarpadi", population: 55000, hospitals: 2, peoplePerHospital: 27500, status: "Low" },
      { zoneId: "049", zoneName: "Sanjeevarayanpet", population: 38000, hospitals: 1, peoplePerHospital: 38000, status: "High" },
      { zoneId: "055", zoneName: "Seven Wells", population: 46000, hospitals: 1, peoplePerHospital: 46000, status: "High" },
      { zoneId: "073", zoneName: "Pulianthope", population: 72000, hospitals: 1, peoplePerHospital: 72000, status: "Critical" },
      { zoneId: "083", zoneName: "Korattur", population: 49000, hospitals: 1, peoplePerHospital: 49000, status: "High" },
      { zoneId: "095", zoneName: "Villiwakkam", population: 60000, hospitals: 1, peoplePerHospital: 60000, status: "Critical" },
      { zoneId: "111", zoneName: "Thousand Light", population: 52000, hospitals: 1, peoplePerHospital: 52000, status: "Critical" },
      { zoneId: "128", zoneName: "Virugambakkam", population: 44000, hospitals: 1, peoplePerHospital: 44000, status: "High" },
      { zoneId: "136", zoneName: "T.Nagar", population: 75000, hospitals: 2, peoplePerHospital: 37500, status: "Medium" },
      { zoneId: "144", zoneName: "Maduravoyal", population: 56000, hospitals: 1, peoplePerHospital: 56000, status: "Critical" },
      { zoneId: "154", zoneName: "Ramapuram", population: 48000, hospitals: 1, peoplePerHospital: 48000, status: "High" },
      { zoneId: "160", zoneName: "Alandur", population: 53000, hospitals: 1, peoplePerHospital: 53000, status: "Critical" }
    ],
    totalZones: 119,
    criticalZones: 45
  },
  equipmentNeeds: {
    monthlyDemand: [
      { month: "Mar 2026", diagnosticEquipment: 45, medicalSupplies: 120, maintenanceBudget: 280 },
      { month: "Apr 2026", diagnosticEquipment: 52, medicalSupplies: 145, maintenanceBudget: 320 },
      { month: "May 2026", diagnosticEquipment: 68, medicalSupplies: 160, maintenanceBudget: 350 },
      { month: "Jun 2026", diagnosticEquipment: 75, medicalSupplies: 185, maintenanceBudget: 380 },
      { month: "Jul 2026", diagnosticEquipment: 58, medicalSupplies: 152, maintenanceBudget: 340 },
      { month: "Aug 2026", diagnosticEquipment: 55, medicalSupplies: 148, maintenanceBudget: 330 }
    ]
  },
  emergencyDemand: {
    monthlyLoad: [
      { month: "Mar 2026", currentLoad: 1250, predictedLoad: 1380, increasePercentage: 10.4 },
      { month: "Apr 2026", currentLoad: 1320, predictedLoad: 1480, increasePercentage: 12.1 },
      { month: "May 2026", currentLoad: 1450, predictedLoad: 1750, increasePercentage: 20.7 },
      { month: "Jun 2026", currentLoad: 1600, predictedLoad: 1950, increasePercentage: 21.9 },
      { month: "Jul 2026", currentLoad: 1550, predictedLoad: 1800, increasePercentage: 16.1 },
      { month: "Aug 2026", currentLoad: 1480, predictedLoad: 1720, increasePercentage: 16.2 }
    ]
  },
  workforce: {
    monthlyProjection: [
      {
        month: "Mar 2026",
        doctors: { current: 285, predicted: 298, change: 13 },
        nurses: { current: 420, predicted: 445, change: 25 },
        paramedics: { current: 95, predicted: 102, change: 7 }
      },
      {
        month: "Apr 2026",
        doctors: { current: 285, predicted: 312, change: 27 },
        nurses: { current: 420, predicted: 452, change: 32 },
        paramedics: { current: 95, predicted: 108, change: 13 }
      },
      {
        month: "May 2026",
        doctors: { current: 285, predicted: 330, change: 45 },
        nurses: { current: 420, predicted: 480, change: 60 },
        paramedics: { current: 95, predicted: 115, change: 20 }
      },
      {
        month: "Jun 2026",
        doctors: { current: 285, predicted: 345, change: 60 },
        nurses: { current: 420, predicted: 500, change: 80 },
        paramedics: { current: 95, predicted: 125, change: 30 }
      },
      {
        month: "Jul 2026",
        doctors: { current: 285, predicted: 318, change: 33 },
        nurses: { current: 420, predicted: 462, change: 42 },
        paramedics: { current: 95, predicted: 112, change: 17 }
      },
      {
        month: "Aug 2026",
        doctors: { current: 285, predicted: 322, change: 37 },
        nurses: { current: 420, predicted: 465, change: 45 },
        paramedics: { current: 95, predicted: 118, change: 23 }
      }
    ]
  },
  bedOccupancy: {
    monthlyProjection: [
      {
        month: "Mar 2026",
        totalBeds: { current: 3200, predicted: 3350, change: 150 },
        icuBeds: { current: 180, predicted: 195, change: 15 },
        occupancyRate: 72
      },
      {
        month: "Apr 2026",
        totalBeds: { current: 3200, predicted: 3480, change: 280 },
        icuBeds: { current: 180, predicted: 202, change: 22 },
        occupancyRate: 75
      },
      {
        month: "May 2026",
        totalBeds: { current: 3200, predicted: 3600, change: 400 },
        icuBeds: { current: 180, predicted: 220, change: 40 },
        occupancyRate: 88
      },
      {
        month: "Jun 2026",
        totalBeds: { current: 3200, predicted: 3650, change: 450 },
        icuBeds: { current: 180, predicted: 235, change: 55 },
        occupancyRate: 92
      },
      {
        month: "Jul 2026",
        totalBeds: { current: 3200, predicted: 3580, change: 380 },
        icuBeds: { current: 180, predicted: 208, change: 28 },
        occupancyRate: 86
      },
      {
        month: "Aug 2026",
        totalBeds: { current: 3200, predicted: 3620, change: 420 },
        icuBeds: { current: 180, predicted: 212, change: 32 },
        occupancyRate: 87
      }
    ]
  },
  diseases: {
    dengue: [
      { month: "Mar 2026", predictedCases: 325, highRiskZones: 8, severity: "Moderate" },
      { month: "Apr 2026", predictedCases: 380, highRiskZones: 12, severity: "High" },
      { month: "May 2026", predictedCases: 420, highRiskZones: 15, severity: "High" },
      { month: "Jun 2026", predictedCases: 580, highRiskZones: 22, severity: "Critical" },
      { month: "Jul 2026", predictedCases: 650, highRiskZones: 28, severity: "Critical" },
      { month: "Aug 2026", predictedCases: 720, highRiskZones: 32, severity: "Critical" }
    ],
    diarrhea: [
      { month: "Mar 2026", predictedCases: 210, outbreakRisk: "Low", affectedZones: 5 },
      { month: "Apr 2026", predictedCases: 245, outbreakRisk: "Medium", affectedZones: 8 },
      { month: "May 2026", predictedCases: 280, outbreakRisk: "Medium", affectedZones: 10 },
      { month: "Jun 2026", predictedCases: 350, outbreakRisk: "High", affectedZones: 15 },
      { month: "Jul 2026", predictedCases: 420, outbreakRisk: "High", affectedZones: 18 },
      { month: "Aug 2026", predictedCases: 480, outbreakRisk: "Critical", affectedZones: 22 }
    ],
    typhoid: [
      { month: "Mar 2026", predictedCases: 120, vaccinationCoverage: 65, hotspots: 3 },
      { month: "Apr 2026", predictedCases: 145, vaccinationCoverage: 68, hotspots: 5 },
      { month: "May 2026", predictedCases: 168, vaccinationCoverage: 72, hotspots: 7 },
      { month: "Jun 2026", predictedCases: 195, vaccinationCoverage: 75, hotspots: 9 },
      { month: "Jul 2026", predictedCases: 225, vaccinationCoverage: 78, hotspots: 12 },
      { month: "Aug 2026", predictedCases: 250, vaccinationCoverage: 80, hotspots: 15 }
    ]
  },
  mobileUnits: {
    diseaseBreakouts: {
      dengue: {
        unitsNeeded: 35,
        zones: ["026-Madhavaram", "036-Sharma Nagar", "040-V.O.C Nagar", "073-Pulianthope", "095-Villiwakkam", "154-Ramapuram", "160-Alandur"],
        deploymentDuration: "May-Aug 2026"
      },
      typhoid: {
        unitsNeeded: 22,
        zones: ["004-Ernavoor", "011-Thiruvottiyur", "037-Vyasarpadi", "041-Korukkupet"],
        deploymentDuration: "Apr-July 2026"
      },
      diarrhea: {
        unitsNeeded: 28,
        zones: ["021-Manali", "006-Kuppam", "111-Thousand Light", "144-Maduravoyal"],
        deploymentDuration: "June-Aug 2026"
      }
    }
  }
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'weekly' | 'monthly'>('weekly');
  const [activeAnalysis, setActiveAnalysis] = useState<string | null>(null);
  const [completedAnalysis, setCompletedAnalysis] = useState<string[]>([]);
  
  // Initialize with the data immediately so we can render the structure, 
  // but use the loading states to mask it
  const [predictionData, setPredictionData] = useState<PredictionData>(mockPredictionData);

  useEffect(() => {
    // Simulate ML backend processing with progressive loading logic
    const runSimulation = async () => {
      // Reset states
      setCompletedAnalysis([]);
      setLoading(true);
      
      const sequence = [
        { id: 'accessGap', label: "Access Gap Analysis" },
        { id: 'equipmentNeeds', label: "Equipment & Diagnostics" },
        { id: 'emergencyDemand', label: "Emergency Demand" },
        { id: 'workforce', label: "Healthcare Workforce" },
        { id: 'bedOccupancy', label: "Bed & ICU Occupancy" },
        { id: 'mobileUnits', label: "Mobile Health Units" },
        { id: 'diseases', label: "Disease Predictions" }
      ];

      for (const step of sequence) {
        setActiveAnalysis(step.id);
        
        // Random delay between 4000ms and 7000ms as requested
        const delay = Math.floor(Math.random() * 3000) + 4000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        setCompletedAnalysis(prev => [...prev, step.id]);
      }
      
      setActiveAnalysis(null);
      setLoading(false);
    };

    runSimulation();
  }, [selectedTimeframe]);

  const refreshData = () => {
    // Re-trigger the simulation
    setSelectedTimeframe(prev => prev === 'weekly' ? 'monthly' : 'weekly');
    setTimeout(() => setSelectedTimeframe('weekly'), 100);
  };

  const isSectionReady = (sectionId: string) => completedAnalysis.includes(sectionId);
  const isSectionLoading = (sectionId: string) => activeAnalysis === sectionId;

  const LoadingOverlay = ({ label }: { label: string }) => (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center rounded-xl transition-all duration-500">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain className="h-6 w-6 text-indigo-600 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-indigo-900 animate-pulse">Analyzing {label}...</p>
      <p className="text-xs text-gray-500 mt-1">Processing local healthcare nodes</p>
    </div>
  );


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <PageHeader
          title="Healthcare Analytics Dashboard"
          subtitle="AI-powered predictions and real-time monitoring for Chennai healthcare system"
        >
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
              className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Predictions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/80 backdrop-blur-sm border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </PageHeader>

        {/* Core KPIs */}
        <KpiGrid />

        {/* Prediction Analytics Grid */}
        <div className="space-y-8">
            {/* Hero Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Total Predictions</p>
                      <p className="text-3xl font-bold">8 Models</p>
                    </div>
                    <div className="p-3 bg-blue-400/20 rounded-lg">
                      <BarChart3 className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Coverage</p>
                      <p className="text-3xl font-bold">85%</p>
                    </div>
                    <div className="p-3 bg-green-400/20 rounded-lg">
                      <Shield className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">High Risk Zones</p>
                      <p className="text-3xl font-bold">23</p>
                    </div>
                    <div className="p-3 bg-orange-400/20 rounded-lg">
                      <AlertTriangle className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Response Time</p>
                      <p className="text-3xl font-bold">8min</p>
                    </div>
                    <div className="p-3 bg-purple-400/20 rounded-lg">
                      <Clock className="h-8 w-8" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Access Gap Analysis - Zone by Zone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[400px]">
                {(isSectionLoading('accessGap') || !isSectionReady('accessGap')) && <LoadingOverlay label="Access Gap" />}
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Target className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                      Access Gap Analysis - Zone by Zone
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 transition-opacity duration-500 ${!isSectionReady('accessGap') ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-xl">
                      <div className="text-2xl font-bold text-blue-600 mb-1">
                        {predictionData.accessGap.totalZones}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">Total Zones</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <div className="text-2xl font-bold text-red-600 mb-1">
                        {predictionData.accessGap.criticalZones}
                      </div>
                      <div className="text-xs text-red-600 font-medium">Critical Zones</div>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-gray-700 text-sm">Zone-wise Hospital Ratio (1 Hospital : N People)</h4>
                    {predictionData.accessGap.zones.map((zone) => (
                      <div key={zone.zoneId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-500">Div {zone.zoneId}</span>
                          <span className="text-sm font-medium text-gray-900">{zone.zoneName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-blue-600">1 : {zone.peoplePerHospital.toLocaleString()}</span>
                          <Badge
                            variant={zone.status === 'Critical' ? 'destructive' :
                                   zone.status === 'High' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {zone.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[400px]">
                {(isSectionLoading('equipmentNeeds') || !isSectionReady('equipmentNeeds')) && <LoadingOverlay label="Equipment" />}
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Microscope className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      Equipment & Diagnostics - Monthly Demand
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 transition-opacity duration-500 ${!isSectionReady('equipmentNeeds') ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-gray-700 text-sm">Monthly Equipment Requirements</h4>
                    {predictionData.equipmentNeeds.monthlyDemand.map((month, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{month.month}</span>
                          <Badge variant="outline" className="text-xs">
                            {month.diagnosticEquipment} units
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-green-600">
                            <span className="font-medium">Supplies:</span> {month.medicalSupplies}
                          </div>
                          <div className="text-blue-600">
                            <span className="font-medium">Maintenance:</span> ₹{month.maintenanceBudget}K
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Demand & Healthcare Workforce */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[400px]">
                {(isSectionLoading('emergencyDemand') || !isSectionReady('emergencyDemand')) && <LoadingOverlay label="Emergency" />}
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <Ambulance className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                      Emergency Demand Forecast - Chennai Load
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 transition-opacity duration-500 ${!isSectionReady('emergencyDemand') ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-gray-700 text-sm">Monthly Load Increase Predictions</h4>
                    {predictionData.emergencyDemand.monthlyLoad.map((month, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{month.month}</span>
                          <Badge
                            variant={month.increasePercentage > 15 ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            +{month.increasePercentage}%
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-gray-600">
                            <span className="font-medium">Current:</span> {month.currentLoad}
                          </div>
                          <div className="text-red-600">
                            <span className="font-medium">Predicted:</span> {month.predictedLoad}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[400px]">
                {(isSectionLoading('workforce') || !isSectionReady('workforce')) && <LoadingOverlay label="Workforce" />}
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                      Healthcare Workforce - Monthly Projections
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 transition-opacity duration-500 ${!isSectionReady('workforce') ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-gray-700 text-sm">Monthly Staffing Requirements</h4>
                    {predictionData.workforce.monthlyProjection.map((month, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{month.month}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-purple-600 font-medium">Doctors</div>
                            <div className="text-gray-600">{month.doctors.current} → {month.doctors.predicted}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              +{month.doctors.change}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-600 font-medium">Nurses</div>
                            <div className="text-gray-600">{month.nurses.current} → {month.nurses.predicted}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              +{month.nurses.change}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-purple-600 font-medium">Paramedics</div>
                            <div className="text-gray-600">{month.paramedics.current} → {month.paramedics.predicted}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              +{month.paramedics.change}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bed Occupancy & Mobile Units */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[400px]">
                {(isSectionLoading('bedOccupancy') || !isSectionReady('bedOccupancy')) && <LoadingOverlay label="Bed Occupancy" />}
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Bed className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                      Bed & ICU Occupancy - Monthly Projections
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 transition-opacity duration-500 ${!isSectionReady('bedOccupancy') ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-gray-700 text-sm">Monthly Bed Requirements</h4>
                    {predictionData.bedOccupancy.monthlyProjection.map((month, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{month.month}</span>
                          <Badge
                            variant={month.occupancyRate > 85 ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {month.occupancyRate}% occupied
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-indigo-600 font-medium">General Beds</div>
                            <div className="text-gray-600">{month.totalBeds.current} → {month.totalBeds.predicted}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              +{month.totalBeds.change}
                            </Badge>
                          </div>
                          <div className="text-center">
                            <div className="text-indigo-600 font-medium">ICU Beds</div>
                            <div className="text-gray-600">{month.icuBeds.current} → {month.icuBeds.predicted}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              +{month.icuBeds.change}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[400px]">
                {(isSectionLoading('mobileUnits') || !isSectionReady('mobileUnits')) && <LoadingOverlay label="Mobile Units" />}
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-teal-100 rounded-lg">
                      <Truck className="h-5 w-5 text-teal-600" />
                    </div>
                    <span className="bg-gradient-to-r from-teal-600 to-teal-800 bg-clip-text text-transparent">
                      Mobile Health Units - Disease-Specific Deployments
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className={`space-y-4 transition-opacity duration-500 ${!isSectionReady('mobileUnits') ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    <h4 className="font-semibold text-gray-700 text-sm">Outbreak Response Requirements</h4>
                    {Object.entries(predictionData.mobileUnits.diseaseBreakouts).map(([diseaseName, disease], index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900 capitalize">{diseaseName}</span>
                          <Badge
                            variant={diseaseName === 'dengue' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            High Risk
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="text-teal-600">
                            <span className="font-medium">Units Required:</span> {disease.unitsNeeded}
                          </div>
                          <div className="text-gray-600">
                            <span className="font-medium">Duration:</span> {disease.deploymentDuration}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span className="font-medium">Zones:</span> {disease.zones.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Disease Predictions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden min-h-[400px]">
              {(isSectionLoading('diseases') || !isSectionReady('diseases')) && <LoadingOverlay label="Disease Predictions" />}
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    Disease Predictions - Monthly Breakdown
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className={`space-y-4 transition-opacity duration-500 ${!isSectionReady('diseases') ? 'opacity-20 blur-sm' : 'opacity-100'}`}>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  <h4 className="font-semibold text-gray-700 text-sm">Monthly Disease Forecasts</h4>
                  {predictionData.diseases.dengue.map((month, index) => {
                    const diarrheaData = predictionData.diseases.diarrhea[index];
                    const typhoidData = predictionData.diseases.typhoid[index];
                    return (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{month.month}</span>
                          <Badge
                            variant={month.severity === 'High' ? 'destructive' : month.severity === 'Medium' ? 'secondary' : 'outline'}
                            className="text-xs"
                          >
                            {month.severity} Risk
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <div className="text-red-600 font-medium">Dengue</div>
                            <div className="text-gray-600">{month.predictedCases} cases</div>
                            <div className="text-xs text-gray-500">{month.highRiskZones} hotspots</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-600 font-medium">Diarrhea</div>
                            <div className="text-gray-600">{diarrheaData.predictedCases} cases</div>
                            <div className="text-xs text-gray-500">{diarrheaData.affectedZones} hotspots</div>
                          </div>
                          <div className="text-center">
                            <div className="text-yellow-600 font-medium">Typhoid</div>
                            <div className="text-gray-600">{typhoidData.predictedCases} cases</div>
                            <div className="text-xs text-gray-500">{typhoidData.hotspots} hotspots</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>


          </div>

        {/* Original Dashboard Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2">
              <MapPreviewCard />
           </div>
           <div className="lg:col-span-1">
              <PriorityQueue />
           </div>
        </div>

        <RecommendedActions />

        <FeatureCardGrid />
      </div>
    </div>
  );
}
