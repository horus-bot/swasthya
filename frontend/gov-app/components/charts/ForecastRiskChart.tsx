"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { day: 'Mon', risk: 45 },
  { day: 'Tue', risk: 52 },
  { day: 'Wed', risk: 48 },
  { day: 'Thu', risk: 65 },
  { day: 'Fri', risk: 85 },
  { day: 'Sat', risk: 92 },
  { day: 'Sun', risk: 78 },
];

export const ForecastRiskChart = () => {
  return (
    <div className="h-[250px] w-full bg-slate-50/50 rounded-lg p-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis 
            dataKey="day" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
             contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
          />
          <ReferenceLine y={80} label="Critical" stroke="red" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="risk" 
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
