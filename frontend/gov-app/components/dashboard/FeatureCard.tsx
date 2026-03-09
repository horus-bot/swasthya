import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/cn';

interface FeatureCardProps {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, desc, icon: Icon, href, color }) => {
  return (
    <Link href={href} className="group">
        <Card className="h-full border-slate-200 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-1">
            <CardContent className="p-5 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                    <div className={cn("p-2.5 rounded-lg", color)}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
                <div className="mt-auto">
                    <h3 className="font-semibold text-slate-900 leading-tight mb-1 group-hover:text-blue-700 transition-colors">{title}</h3>
                    <p className="text-xs text-slate-500 leading-normal">{desc}</p>
                </div>
            </CardContent>
        </Card>
    </Link>
  );
};
