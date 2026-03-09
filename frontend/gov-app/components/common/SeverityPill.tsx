import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/cn';

interface SeverityPillProps {
  level: 'Low' | 'Medium' | 'High';
  className?: string;
}

export const SeverityPill: React.FC<SeverityPillProps> = ({ level, className }) => {
  const colorClass =
    level === 'Low' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200' :
    level === 'Medium' ? 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200' :
    'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';

  return (
    <Badge variant="outline" className={cn("font-medium border", colorClass, className)}>
      {level}
    </Badge>
  );
};
