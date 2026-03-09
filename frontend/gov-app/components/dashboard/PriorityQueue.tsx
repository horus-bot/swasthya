import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockAlerts } from '@/mock';
import { AlertTriangle, Clock, MapPin, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';

export const PriorityQueue = () => {
  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
             <CardTitle className="text-lg flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Priority Queue
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-xs h-7">View All</Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
         <div className="divide-y divide-slate-100">
            {mockAlerts.map((alert) => (
                <div key={alert.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex items-start gap-3">
                        <div className={cn(
                            "mt-1 p-1.5 rounded-full shrink-0",
                            alert.severity === 'High' ? "bg-red-100 text-red-600" :
                            alert.severity === 'Medium' ? "bg-orange-100 text-orange-600" :
                            "bg-blue-100 text-blue-600"
                        )}>
                            <AlertTriangle className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-slate-900 group-hover:text-blue-700">{alert.title}</h4>
                            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {alert.location}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {alert.time}
                                </span>
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                </div>
            ))}
         </div>
      </CardContent>
    </Card>
  );
};
