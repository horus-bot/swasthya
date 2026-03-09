"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SimulatorActions } from '@/components/simulator/SimulatorActions';
import { ImpactMetrics } from '@/components/simulator/ImpactMetrics';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw } from 'lucide-react';

export default function SimulatorPage() {
  const [scenarioName, setScenarioName] = useState('Scenario A');

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
       <PageHeader 
        title="Intervention Simulator" 
        subtitle="Test resource allocation strategies and predict their impact."
       >
         <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
         </Button>
         <Button size="sm">
            <Save className="h-4 w-4 mr-2" /> Save Scenario
         </Button>
       </PageHeader>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
           {/* Map Area */}
           <div className="lg:col-span-2 bg-slate-200 rounded-xl relative overflow-hidden border border-slate-300 shadow-inner">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-medium">
                    Map Simulation Canvas
                </div>
                {/* Mock pins */}
                <div className="absolute top-1/4 left-1/3 p-2 bg-white rounded-lg shadow-lg">
                    <div className="text-xs font-bold text-blue-600">Proposed Clinic</div>
                    <div className="text-[10px] text-slate-500">-5min travel time</div>
                </div>
           </div>

           {/* Sidebar Control */}
           <div className="lg:col-span-1 flex flex-col gap-4 overflow-y-auto pr-1">
                <SimulatorActions onAction={(a) => console.log(a)} />
                <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">Projected Impact</h3>
                    <ImpactMetrics />
                </div>
           </div>
       </div>
    </div>
  );
}
