"use client";

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockOutbreaks } from '@/mock';
import { AlertTriangle, TrendingUp, Minus } from 'lucide-react';
import { OutbreakTrendChart } from '@/components/charts/OutbreakTrendChart';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function OutbreaksPage() {
  return (
    <div className="space-y-6">
       <PageHeader 
        title="Disease Outbreaks" 
        subtitle="Monitor active clusters and transmission trends."
      />

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
           <Card>
               <CardContent className="p-6 text-center lg:text-left">
                   <h3 className="font-semibold mb-4">Transmission by Zone</h3>
                   <div className="h-64 pt-2">
                       <OutbreakTrendChart />
                   </div>
               </CardContent>
           </Card>

           <Card>
               <CardContent className="p-6">
                   <h3 className="font-semibold mb-4">Active Clusters</h3>
                   <div className="space-y-4">
                       {mockOutbreaks.map((outbreak) => (
                           <div key={outbreak.id} className="flex items-center justify-between p-3 border rounded-lg bg-slate-50">
                               <div className="flex items-start gap-3">
                                   <div className="p-2 bg-red-100 text-red-600 rounded-full mt-1">
                                       <AlertTriangle className="h-4 w-4" />
                                   </div>
                                   <div>
                                       <h4 className="font-bold text-slate-900">{outbreak.location} Cluster</h4>
                                       <p className="text-sm text-slate-500">{outbreak.disease} • {outbreak.cases} Active Cases</p>
                                   </div>
                               </div>
                               <div className="text-right">
                                   <Badge variant={outbreak.riskLevel === 'High' ? 'destructive' : 'secondary'}>{outbreak.riskLevel} Risk</Badge>
                                   <div className="flex items-center justify-end gap-1 mt-1 text-xs font-medium text-slate-500">
                                       {outbreak.trend === 'increasing' ? <TrendingUp className="h-3 w-3 text-red-500" /> : <Minus className="h-3 w-3" />}
                                       {outbreak.trend}
                                   </div>
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
