import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';

export const ImpactMetrics = () => {
    const metrics = [
        { label: 'Avg Travel Time', value: '21m', change: '-12%', trend: 'good' },
        { label: 'Unserved Pop.', value: '8.4k', change: '-32%', trend: 'good' },
        { label: 'Overload Risk', value: 'Medium', change: 'Stable', trend: 'neutral' },
    ];

  return (
    <div className="space-y-3 mt-4">
        {metrics.map((m, i) => (
             <Card key={i} className="bg-slate-50 border-slate-200 shadow-none">
                <CardContent className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase">{m.label}</p>
                        <p className="text-xl font-bold text-slate-900">{m.value}</p>
                    </div>
                    <div className={cn(
                        "flex items-center text-sm font-bold px-2 py-1 rounded-md",
                        m.trend === 'good' ? "text-green-700 bg-green-100" :
                        m.trend === 'bad' ? "text-red-700 bg-red-100" : "text-slate-700 bg-slate-200"
                    )}>
                        {m.trend === 'good' ? <ArrowDown className="h-3 w-3 mr-1" /> :
                         m.trend === 'bad' ? <ArrowUp className="h-3 w-3 mr-1" /> : <Minus className="h-3 w-3 mr-1" />}
                        {m.change}
                    </div>
                </CardContent>
             </Card>
        ))}
    </div>
  );
};
