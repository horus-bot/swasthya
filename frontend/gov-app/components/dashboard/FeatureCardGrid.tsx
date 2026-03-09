import React from 'react';
import { FeatureCard } from './FeatureCard';
import { Activity, Thermometer, Truck, Megaphone, FileText, BarChart3, Radio } from 'lucide-react';

export const FeatureCardGrid = () => {
    const features = [
        { title: 'Heatmap Dashboard', desc: 'Visualize risk & gaps', icon: Activity, href: '/heatmaps', color: 'text-blue-600 bg-blue-50' },
        { title: 'Overload Prediction', desc: 'Forecast demand +7 days', icon: BarChart3, href: '/prediction', color: 'text-purple-600 bg-purple-50' },
        { title: 'Intervention Sim', desc: 'Test resource allocation', icon: Radio, href: '/simulator', color: 'text-indigo-600 bg-indigo-50' },
        { title: 'Mobile Units', desc: 'Track & deploy fleets', icon: Truck, href: '/mobile-units', color: 'text-green-600 bg-green-50' },
        { title: 'Raise Advisory', desc: 'Broadcast health alerts', icon: Megaphone, href: '/advisories', color: 'text-orange-600 bg-orange-50' },
        { title: 'Reports', desc: 'Generate daily summaries', icon: FileText, href: '/reports', color: 'text-slate-600 bg-slate-50' },
    ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
        {features.map((f, i) => (
            <FeatureCard key={i} {...f} />
        ))}
    </div>
  );
};
