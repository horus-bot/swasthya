"use client";

import React from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar } from 'lucide-react';

export default function ReportsPage() {
    const reports = [
        { title: 'Weekly District Health Summary', desc: 'Consolidated OPD load, bed occupancy, and critical alerts.', date: 'Generated today', type: 'PDF' },
        { title: 'Outbreak Analysis Report', desc: 'Detailed view of disease spread clusters and vector control impact.', date: 'Generated yesterday', type: 'PDF' },
        { title: 'Infrastructure Gap Audit', desc: 'Facilities running below 50% resource capability.', date: 'Generated 2 days ago', type: 'Excel' },
        { title: 'Mobile Unit Utilization', desc: 'Routes covered and population served metrics.', date: 'Generated 3 days ago', type: 'Excel' },
    ];

  return (
    <>
      <PageHeader 
        title="Reports & Analytics" 
        subtitle="Generate and download detailed health summaries."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report, i) => (
            <Card key={i} className="hover:border-blue-300 transition-colors">
                <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div className="flex items-start justify-between">
                         <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                            <FileText className="h-6 w-6" />
                         </div>
                         <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                         </Button>
                    </div>
                    
                    <div className="mt-4">
                        <h3 className="font-semibold text-lg text-slate-900">{report.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">{report.desc}</p>
                    </div>

                    <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {report.date}
                        </span>
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">{report.type}</span>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
    </>
  );
}
