"use client";

import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface TrendMiniChartProps {
  data: number[];
  color?: string;
}

export const TrendMiniChart: React.FC<TrendMiniChartProps> = ({ data, color = "#3b82f6" }) => {
  const chartData = data.map((val, i) => ({ i, val }));

  return (
    <div className="h-8 w-20">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="val" 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
