import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, BedDouble, Truck, MapPin } from 'lucide-react';

interface SimulatorActionsProps {
  onAction: (action: string) => void;
}

export const SimulatorActions: React.FC<SimulatorActionsProps> = ({ onAction }) => {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg">Interventions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-200" onClick={() => onAction('clinic')}>
             <PlusCircle className="h-6 w-6 text-blue-600" />
             <span className="text-xs font-semibold">New Clinic</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-200" onClick={() => onAction('upgrade')}>
             <BedDouble className="h-6 w-6 text-purple-600" />
             <span className="text-xs font-semibold">Add Beds</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:bg-green-50 hover:border-green-200" onClick={() => onAction('mobile')}>
             <Truck className="h-6 w-6 text-green-600" />
             <span className="text-xs font-semibold">Mobile Unit</span>
        </Button>
         <Button variant="outline" className="h-auto py-3 flex flex-col gap-2 hover:bg-red-50 hover:border-red-200" onClick={() => onAction('base')}>
             <MapPin className="h-6 w-6 text-red-600" />
             <span className="text-xs font-semibold">Ambulance</span>
        </Button>
      </CardContent>
    </Card>
  );
};
