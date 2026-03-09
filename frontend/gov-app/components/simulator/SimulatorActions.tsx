import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, BedDouble, Truck, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type SimulatorActionType = 'clinic' | 'upgrade' | 'mobile' | 'ambulance';

interface SimulatorActionsProps {
  counts: Record<SimulatorActionType, number>;
  onAdd: (action: SimulatorActionType) => void;
  onRemove: (action: SimulatorActionType) => void;
}

const actions: Array<{
  type: SimulatorActionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}> = [
  { type: 'clinic', label: 'New Clinic', icon: PlusCircle, tone: 'text-blue-600' },
  { type: 'upgrade', label: 'Add Beds', icon: BedDouble, tone: 'text-violet-600' },
  { type: 'mobile', label: 'Mobile Unit', icon: Truck, tone: 'text-emerald-600' },
  { type: 'ambulance', label: 'Ambulance', icon: MapPin, tone: 'text-rose-600' },
];

export const SimulatorActions: React.FC<SimulatorActionsProps> = ({ counts, onAdd, onRemove }) => {
  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg">Interventions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {actions.map((action) => {
          const Icon = action.icon;
          const count = counts[action.type];

          return (
            <div key={action.type} className="rounded-xl border border-slate-200 p-3 bg-slate-50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Icon className={`h-5 w-5 ${action.tone}`} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{action.label}</div>
                    <div className="text-xs text-slate-500">Deploy or remove units from the scenario.</div>
                  </div>
                </div>
                <Badge variant="outline" className="border-slate-300 bg-white text-slate-700">
                  {count}
                </Badge>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="flex-1" onClick={() => onRemove(action.type)} disabled={count === 0}>
                  Remove
                </Button>
                <Button type="button" size="sm" className="flex-1" onClick={() => onAdd(action.type)}>
                  Add
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
