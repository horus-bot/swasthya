import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Severity } from '@/types';
import { cn } from '@/lib/cn';

interface StatBadgeProps {
  status: Severity;
  className?: string;
}

export const StatBadge: React.FC<StatBadgeProps> = ({ status, className }) => {
  const variant =
    status === 'Safe' ? 'default' : status === 'Watch' ? 'secondary' : 'destructive';

  // Override default colors for better context matching if needed
  const colorClass = 
    status === 'Safe' ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200' :
    status === 'Watch' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200' :
    'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';

  return (
    <Badge variant="outline" className={cn("font-medium border", colorClass, className)}>
      {status}
    </Badge>
  );
};
