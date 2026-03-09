import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Play, Users } from 'lucide-react';

export const RecommendedActions = () => {
    const actions = [
        { id: 1, title: 'Deploy Mobile Unit to Tondiarpet', impact: 'High', coverage: '+2.5k served', type: 'Deploy' },
        { id: 2, title: 'Increase ICU Staff at General Hospital', impact: 'Critical', coverage: '-15% overload', type: 'resource' },
        { id: 3, title: 'Advisory: Dengue Watch in North Zone', impact: 'Medium', coverage: 'Prevention', type: 'advisory' },
    ];

  return (
    <Card className="mt-6 border-l-4 border-l-blue-500">
       <CardHeader className="pb-2">
            <CardTitle className="text-lg">Recommended Actions</CardTitle>
       </CardHeader>
       <CardContent>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-4 bg-slate-50 flex flex-col justify-between">
                        <div>
                             <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{action.type}</span>
                                <span className="text-xs font-semibold bg-white border px-2 py-0.5 rounded-full text-slate-600">Impact: {action.impact}</span>
                             </div>
                             <h4 className="font-semibold text-slate-900 mb-1">{action.title}</h4>
                             <p className="text-sm text-slate-500 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {action.coverage}
                             </p>
                        </div>
                        <div className="mt-4 flex gap-2">
                             <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 h-8">
                                <Play className="h-3 w-3 mr-1" /> Simulate
                             </Button>
                             <Button size="sm" variant="outline" className="w-full h-8">
                                <CheckCircle2 className="h-3 w-3 mr-1" /> Approve
                             </Button>
                        </div>
                    </div>
                ))}
           </div>
       </CardContent>
    </Card>
  );
};
