"use client";

import React, { useEffect, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, TrendingUp, Calendar, Activity } from 'lucide-react';
import { ForecastRiskChart } from '@/components/charts/ForecastRiskChart';
import { DiseasePredictionChart, DiseaseStatsCard } from '@/components/charts/DiseasePredictionChart';

interface MonthlyPrediction {
  month: string;
  year: number;
  predicted_cases: number;
  baseline: number;
  risk_level: string;
  trend: string;
  confidence: string;
}

interface DiseasePrediction {
  disease: string;
  monthly_predictions: MonthlyPrediction[];
  total_predicted: number;
  average_monthly: number;
  peak_month: string;
  peak_cases: number;
}

interface DiseasePredictionData {
  area: string;
  timestamp: string;
  diseases: DiseasePrediction[];
}

export default function PredictionPage() {
  const [diseaseData, setDiseaseData] = useState<DiseasePredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  const [monthsAhead, setMonthsAhead] = useState(6);

  const risks = [
      { facility: 'General Hospital', risk: 'High', days: '2 days', reason: 'Rising Dengue Cases' },
      { facility: 'Velachery Emergency', risk: 'Critical', days: '5 hours', reason: 'Bed Occupancy 98%' },
      { facility: 'Anna Nagar Clinic', risk: 'Low', days: '-', reason: 'Stable' },
  ];

  // Mock data for disease predictions
  const mockDiseaseData: DiseasePredictionData = {
    area: "Chennai",
    timestamp: new Date().toISOString(),
    diseases: [
      {
        disease: "Dengue",
        monthly_predictions: [
          { month: "Feb", year: 2026, predicted_cases: 325, baseline: 300, risk_level: "critical", trend: "increasing", confidence: "high" },
          { month: "Mar", year: 2026, predicted_cases: 360, baseline: 325, risk_level: "critical", trend: "increasing", confidence: "high" },
          { month: "Apr", year: 2026, predicted_cases: 340, baseline: 325, risk_level: "high", trend: "stable", confidence: "medium" },
          { month: "May", year: 2026, predicted_cases: 275, baseline: 260, risk_level: "moderate", trend: "decreasing", confidence: "medium" },
          { month: "Jun", year: 2026, predicted_cases: 240, baseline: 225, risk_level: "moderate", trend: "decreasing", confidence: "low" },
          { month: "Jul", year: 2026, predicted_cases: 210, baseline: 200, risk_level: "low", trend: "stable", confidence: "low" }
        ],
        total_predicted: 1750,
        average_monthly: 292,
        peak_month: "Mar",
        peak_cases: 360
      },
      {
        disease: "Typhoid",
        monthly_predictions: [
          { month: "Feb", year: 2026, predicted_cases: 90, baseline: 90, risk_level: "moderate", trend: "stable", confidence: "high" },
          { month: "Mar", year: 2026, predicted_cases: 110, baseline: 100, risk_level: "high", trend: "increasing", confidence: "high" },
          { month: "Apr", year: 2026, predicted_cases: 120, baseline: 110, risk_level: "high", trend: "increasing", confidence: "medium" },
          { month: "May", year: 2026, predicted_cases: 100, baseline: 90, risk_level: "moderate", trend: "stable", confidence: "medium" },
          { month: "Jun", year: 2026, predicted_cases: 95, baseline: 85, risk_level: "moderate", trend: "stable", confidence: "low" },
          { month: "Jul", year: 2026, predicted_cases: 80, baseline: 75, risk_level: "low", trend: "decreasing", confidence: "low" }
        ],
        total_predicted: 595,
        average_monthly: 99,
        peak_month: "Apr",
        peak_cases: 120
      },
      {
        disease: "Diarrhea",
        monthly_predictions: [
          { month: "Feb", year: 2026, predicted_cases: 110, baseline: 110, risk_level: "moderate", trend: "stable", confidence: "high" },
          { month: "Mar", year: 2026, predicted_cases: 140, baseline: 120, risk_level: "high", trend: "increasing", confidence: "high" },
          { month: "Apr", year: 2026, predicted_cases: 160, baseline: 140, risk_level: "high", trend: "increasing", confidence: "medium" },
          { month: "May", year: 2026, predicted_cases: 175, baseline: 160, risk_level: "critical", trend: "increasing", confidence: "medium" },
          { month: "Jun", year: 2026, predicted_cases: 190, baseline: 175, risk_level: "critical", trend: "increasing", confidence: "low" },
          { month: "Jul", year: 2026, predicted_cases: 210, baseline: 190, risk_level: "critical", trend: "increasing", confidence: "low" }
        ],
        total_predicted: 985,
        average_monthly: 164,
        peak_month: "Jul",
        peak_cases: 210
      }
    ]
  };

  useEffect(() => {
    // Load mock data with 12-second loading timer
    setLoading(true);
    setTimeout(() => {
      setDiseaseData(mockDiseaseData);
      setLoading(false);
    }, 12000); // 12 seconds delay
  }, [monthsAhead]);

  // Calculate total predicted cases and high-risk diseases
  const totalPredicted = diseaseData?.diseases.reduce((sum, d) => sum + d.total_predicted, 0) || 0;
  const highRiskCount = diseaseData?.diseases.filter(d => 
    d.monthly_predictions[0]?.risk_level === 'high' || 
    d.monthly_predictions[0]?.risk_level === 'critical'
  ).length || 0;

  return (
    <div className="space-y-6">
       <PageHeader 
        title="Predictive Analytics" 
        subtitle="AI-driven forecasts for disease outbreaks and resource demand"
      />

      {/* Summary Alert Card */}
      <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100">
          <CardContent className="p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="w-6 h-6 text-indigo-600" />
                          <h2 className="text-2xl font-bold text-indigo-900">Disease Outbreak Forecast</h2>
                      </div>
                      <p className="text-indigo-700 mt-2 max-w-2xl">
                        Monthly predictions for Dengue, Typhoid, and Acute Diarrhoeal Disease across Chennai. 
                        Based on historical patterns, seasonal factors, and current transmission rates.
                      </p>
                      {diseaseData && (
                        <div className="flex gap-4 mt-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-600" />
                            <span className="text-sm text-indigo-700">
                              Next {monthsAhead} months predicted
                            </span>
                          </div>
                          {highRiskCount > 0 && (
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-700 font-semibold">
                                {highRiskCount} disease{highRiskCount > 1 ? 's' : ''} at high risk
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                  </div>
                  <div className="flex flex-col items-center bg-white rounded-lg p-6 shadow-sm min-w-[140px]">
                      <Activity className="w-8 h-8 text-indigo-600 mb-2" />
                      <span className="text-4xl font-extrabold text-indigo-600">
                        {loading ? '...' : totalPredicted.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest text-center">
                        Total Cases<br/>(6 months)
                      </span>
                  </div>
              </div>
          </CardContent>
      </Card>

      {/* Disease Stats Cards */}
      {!loading && diseaseData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {diseaseData.diseases.map((disease) => (
            <DiseaseStatsCard key={disease.disease} disease={disease} />
          ))}
        </div>
      )}

      {/* Monthly Predictions Chart */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">Monthly Disease Predictions</h3>
              <p className="text-sm text-gray-500 mt-1">
                Predicted cases per month for all three diseases
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select 
                value={monthsAhead}
                onChange={(e) => setMonthsAhead(Number(e.target.value))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    chartType === 'line' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                    chartType === 'bar' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Bar
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-gray-500">Loading predictions...</div>
            </div>
          ) : diseaseData ? (
            <DiseasePredictionChart data={diseaseData.diseases} chartType={chartType} />
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-gray-500">Failed to load predictions</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Existing Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
              <CardContent className="p-6">
                 <h3 className="font-semibold mb-6">Facility Occupancy Projection (Next 7 Days)</h3>
                 <div className="h-64">
                      <ForecastRiskChart />
                 </div>
              </CardContent>
          </Card>

          <Card>
              <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Facility Risk Ranking</h3>
                  <div className="space-y-4">
                      {risks.map((r, i) => (
                          <div key={i} className="flex items-center justify-between border-b last:border-0 border-slate-100 pb-3 last:pb-0">
                               <div>
                                   <div className="font-medium text-sm text-slate-900">{r.facility}</div>
                                   <div className="text-xs text-slate-500">{r.reason}</div>
                               </div>
                               <div className="text-right">
                                    <Badge variant={r.risk === 'Critical' ? 'destructive' : r.risk === 'High' ? 'secondary' : 'outline'} className={r.risk === 'High' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : ''}>
                                        {r.risk}
                                    </Badge>
                                    <div className="text-[10px] text-slate-400 mt-1">in {r.days}</div>
                               </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}
