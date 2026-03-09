"use client";

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface DiseasePredictionChartProps {
  data: DiseasePrediction[];
  chartType?: 'line' | 'bar';
}

export const DiseasePredictionChart: React.FC<DiseasePredictionChartProps> = ({ 
  data, 
  chartType = 'line' 
}) => {
  if (!data || data.length === 0) {
    return <div className="text-gray-500 text-center py-8">No prediction data available</div>;
  }

  // Transform data for chart
  const chartData = data[0].monthly_predictions.map((pred, index) => {
    const dataPoint: any = {
      month: pred.month,
      year: pred.year,
    };

    data.forEach((disease) => {
      if (disease.monthly_predictions[index]) {
        dataPoint[disease.disease] = disease.monthly_predictions[index].predicted_cases;
      }
    });

    return dataPoint;
  });

  const colors = {
    Dengue: '#ef4444',    // red
    Typhoid: '#f59e0b',   // amber
    Diarrhea: '#3b82f6',  // blue
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-gray-700">{entry.name}:</span>
              <span className="font-semibold text-gray-900">{entry.value} cases</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'line' ? (
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Predicted Cases', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="circle"
            />
            {data.map((disease) => (
              <Line
                key={disease.disease}
                type="monotone"
                dataKey={disease.disease}
                stroke={colors[disease.disease as keyof typeof colors] || '#6b7280'}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{ value: 'Predicted Cases', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            {data.map((disease) => (
              <Bar
                key={disease.disease}
                dataKey={disease.disease}
                fill={colors[disease.disease as keyof typeof colors] || '#6b7280'}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

interface DiseaseStatsCardProps {
  disease: DiseasePrediction;
}

export const DiseaseStatsCard: React.FC<DiseaseStatsCardProps> = ({ disease }) => {
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getDiseaseIcon = (diseaseName: string) => {
    switch (diseaseName.toLowerCase()) {
      case 'dengue':
        return '🦟';
      case 'typhoid':
        return '🦠';
      case 'diarrhea':
        return '💧';
      default:
        return '🏥';
    }
  };

  // Get current month prediction (first in the list)
  const currentPrediction = disease.monthly_predictions[0];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{getDiseaseIcon(disease.disease)}</span>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{disease.disease}</h3>
            <p className="text-sm text-gray-500">{currentPrediction.month} {currentPrediction.year}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${getRiskColor(currentPrediction.risk_level)}`}>
          {currentPrediction.risk_level.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Current Month</p>
          <p className="text-2xl font-bold text-gray-900">{currentPrediction.predicted_cases}</p>
          <p className="text-xs text-gray-500">predicted cases</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Peak Month</p>
          <p className="text-2xl font-bold text-gray-900">{disease.peak_cases}</p>
          <p className="text-xs text-gray-500">in {disease.peak_month}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Avg Monthly</p>
          <p className="font-semibold text-gray-900">{disease.average_monthly} cases</p>
        </div>
        <div>
          <p className="text-gray-600">Trend</p>
          <p className="font-semibold text-gray-900 capitalize flex items-center gap-1">
            {currentPrediction.trend === 'increasing' && <span className="text-red-500">↑</span>}
            {currentPrediction.trend === 'decreasing' && <span className="text-green-500">↓</span>}
            {currentPrediction.trend === 'stable' && <span className="text-gray-500">→</span>}
            {currentPrediction.trend}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Total 6-month prediction: <span className="font-semibold text-gray-700">{disease.total_predicted} cases</span>
        </p>
      </div>
    </div>
  );
};
