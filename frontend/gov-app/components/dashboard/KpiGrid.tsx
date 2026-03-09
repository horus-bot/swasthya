import React from 'react';
import { KpiCard } from './KpiCard';
import { mockKPIs } from '@/mock';

export const KpiGrid = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-6">
      {mockKPIs.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
};
