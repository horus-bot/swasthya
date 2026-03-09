import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/cn';
import { KPI } from '@/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { TrendMiniChart } from '@/components/common/TrendMiniChart';

interface KpiCardProps {
  kpi: KPI;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
  const isPositive = kpi.trendDir === 'up';
  const isNeutral = kpi.trendDir === 'neutral';
  
  const TrendIcon = isNeutral ? Minus : isPositive ? TrendingUp : TrendingDown;
  
  const statusColor = 
    kpi.status === 'Critical' ? 'bg-red-50 border-red-100' :
    kpi.status === 'Watch' ? 'bg-orange-50 border-orange-100' :
    'bg-white border-slate-200';

  const trendColor = 
    kpi.trendDir === 'up' ? "text-red-600" :
    kpi.trendDir === 'down' ? "text-green-600" :
    "text-slate-500";

  // Mock trend data for sparkline
  const mockTrendData = [40, 35, 50, 45, 60, kpi.status === 'Critical' ? 85 : 55, kpi.trend > 0 ? 65 : 40];

  return (
    <Card className={cn("shadow-sm transition-all hover:shadow-md overflow-hidden", statusColor)}>
      <CardContent className="p-4 flex flex-col justify-between h-full relative">
        <div className="z-10">
            <p className="text-sm font-medium text-slate-500 mb-1 line-clamp-1">{kpi.label}</p>
            <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                <div className="opacity-50">
                    <TrendMiniChart data={mockTrendData} color={kpi.status === 'Critical' ? '#ef4444' : '#3b82f6'} />
                </div>
            </div>
        </div>
        <div className="flex items-center gap-1 mt-3 z-10">
             <div className={cn("flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-full bg-white/60", trendColor)}>
                <TrendIcon className="h-3 w-3 mr-1" />
                {kpi.trend > 0 ? `${kpi.trend}%` : '-'}
             </div>
             <span className="text-xs text-slate-400">vs last 7d</span>
        </div>
      </CardContent>
    </Card>
  );
};
