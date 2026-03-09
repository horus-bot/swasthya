"use client";

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockMobileUnits } from '@/mock';
import { Truck, MapPin, Navigation, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function MobileUnitsPage() {
  return (
    <>
      <PageHeader 
        title="Mobile Health Units" 
        subtitle="Track and manage the mobile fleet dispatch."
      >
        <Button>
            <Truck className="h-4 w-4 mr-2" />
            Dispatch New Unit
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMobileUnits.map((unit) => (
            <Card key={unit.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
                <div className="h-32 bg-slate-100 relative">
                     {/* Map Placeholder */}
                     <div className="absolute inset-0 bg-blue-50 pattern-grid-lg opacity-20" />
                     <div className="absolute bottom-4 left-4 p-2 bg-white rounded-full shadow-sm">
                        <Truck className="h-5 w-5 text-blue-600" />
                     </div>
                     <div className="absolute top-4 right-4">
                        <Badge variant={unit.status === 'Active' ? 'default' : 'secondary'} className={unit.status === 'Active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                            {unit.status}
                        </Badge>
                     </div>
                </div>
                <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                        <span>{unit.name}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 flex items-center gap-2">
                            <MapPin className="h-4 w-4" /> Current Location
                        </span>
                        <span className="font-medium text-slate-900">{unit.currentLocation}</span>
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Today's Route</p>
                        <div className="flex items-center gap-2 text-sm">
                             {unit.route.length > 0 ? (
                                 unit.route.map((stop, i) => (
                                     <React.Fragment key={i}>
                                         <span className="bg-slate-100 px-2 py-1 rounded text-slate-700">{stop}</span>
                                         {i < unit.route.length - 1 && <span className="text-slate-300">→</span>}
                                     </React.Fragment>
                                 ))
                             ) : (
                                 <span className="text-slate-400 italic">No route assigned</span>
                             )}
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-between items-center">
                        <div className="text-sm">
                            <span className="text-slate-500">Served Today:</span> <span className="font-bold text-slate-900">{unit.servedToday}</span>
                        </div>
                        <Button variant="outline" size="sm" className="h-8">
                            <Navigation className="h-3 w-3 mr-2" /> Track
                        </Button>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </>
  );
}
