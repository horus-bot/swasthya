import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Maximize2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const MapPreviewCard = () => {
  return (
    <Card className="h-[400px] flex flex-col relative overflow-hidden group border-slate-200 shadow-md">
       <div className="absolute top-4 left-4 z-10 flex gap-2">
           <Badge variant="secondary" className="bg-white/90 backdrop-blur-md shadow-sm">Access Gap</Badge>
           <Badge variant="secondary" className="bg-white/90 backdrop-blur-md shadow-sm">Overload</Badge>
           <Badge variant="secondary" className="bg-white/90 backdrop-blur-md shadow-sm">Outbreaks</Badge>
       </div>
       
       <div className="absolute top-4 right-4 z-10">
           <Button size="icon" variant="secondary" className="bg-white/90 shadow-sm h-8 w-8 hover:bg-white"> 
                <Maximize2 className="h-4 w-4 text-slate-700" />
           </Button>
       </div>

       <div className="absolute bottom-4 right-4 z-10">
            <Button variant="outline" size="sm" className="bg-white/90 shadow-sm gap-2 text-xs font-semibold">
                <Layers className="h-3 w-3" />
                Layers
            </Button>
       </div>

       {/* Fake Map Background */}
       <div className="bg-slate-100 w-full h-full flex items-center justify-center relative">
           <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>
           <span className="text-slate-400 font-medium z-10 flex flex-col items-center gap-2">
               <MapIcon className="h-10 w-10 opacity-50" />
               Interactive Map Placeholder
           </span>
           
           {/* Fake Hotspots */}
           <div className="absolute top-1/3 left-1/4 h-8 w-8 rounded-full bg-red-400/30 animate-ping" />
           <div className="absolute top-1/3 left-1/4 h-4 w-4 rounded-full bg-red-500 shadow-lg border-2 border-white" />
           
           <div className="absolute bottom-1/3 right-1/3 h-6 w-6 rounded-full bg-orange-400/30 animate-pulse" />
           <div className="absolute bottom-1/3 right-1/3 h-3 w-3 rounded-full bg-orange-500 shadow-lg border-2 border-white" />
       </div>
    </Card>
  );
};

function MapIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        >
        <polygon points="3 6 9 3 15 6 21 3 21 21 15 18 9 21 3 18 3 6" />
        <line x1="9" x2="9" y1="3" y2="21" />
        <line x1="15" x2="15" y1="6" y2="24" />
        </svg>
    )
}
