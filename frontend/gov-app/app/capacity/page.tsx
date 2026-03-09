"use client";

import React, { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { mockFacilities } from '@/mock';
import { StatBadge } from '@/components/common/StatBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { OccupancyLineChart } from '@/components/charts/OccupancyLineChart';

export default function CapacityPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('All');

  const filteredFacilities = mockFacilities.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === 'All' || f.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  return (
    <>
      <PageHeader 
        title="Facility Capacity" 
        subtitle="Real-time occupancy and resource status across all facilities."
      >
        <Button>Add Facility</Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card className="lg:col-span-2">
              <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Network-wide Bed Occupancy Trends</h3>
                  <OccupancyLineChart />
              </CardContent>
          </Card>
          <Card className="bg-blue-600 text-white">
              <CardContent className="p-6 flex flex-col justify-center h-full">
                  <h3 className="font-medium text-blue-100 mb-1">Total Available Beds</h3>
                  <div className="text-4xl font-bold mb-4">1,240</div>
                  <div className="space-y-2">
                       <div className="flex justify-between text-sm text-blue-100">
                           <span>General Ward</span>
                           <span>850</span>
                       </div>
                       <div className="flex justify-between text-sm text-blue-100">
                           <span>ICU</span>
                           <span>120</span>
                       </div>
                       <div className="flex justify-between text-sm text-blue-100">
                           <span>Emergency</span>
                           <span>270</span>
                       </div>
                  </div>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search facilities..." 
                        className="pl-9" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)}>
                        <option value="All">All Zones</option>
                        <option value="North">North</option>
                        <option value="South">South</option>
                        <option value="Central">Central</option>
                        <option value="West">West</option>
                    </Select>
                    <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Facility Name</TableHead>
                        <TableHead>Zone</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>OPD Load</TableHead>
                        <TableHead>Bed Occupancy</TableHead>
                        <TableHead>ICU Occupancy</TableHead>
                        <TableHead>Staff Avail.</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredFacilities.map((facility) => (
                        <TableRow key={facility.id} className="cursor-pointer hover:bg-slate-50">
                            <TableCell className="font-medium">{facility.name}</TableCell>
                            <TableCell>{facility.zone}</TableCell>
                            <TableCell>{facility.type}</TableCell>
                            <TableCell>{facility.opdLoad}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full" 
                                            style={{ width: `${facility.bedOccupancy}%`, backgroundColor: facility.bedOccupancy > 90 ? '#ef4444' : facility.bedOccupancy > 75 ? '#f97316' : '#3b82f6' }} 
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{facility.bedOccupancy}%</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-purple-500 rounded-full" 
                                            style={{ width: `${facility.icuOccupancy}%`, backgroundColor: facility.icuOccupancy > 90 ? '#ef4444' : facility.icuOccupancy > 75 ? '#f97316' : '#a855f7' }} 
                                        />
                                    </div>
                                    <span className="text-xs text-muted-foreground">{facility.icuOccupancy}%</span>
                                </div>
                            </TableCell>
                            <TableCell>{facility.staffAvailability}%</TableCell>
                            <TableCell className="text-right">
                                <StatBadge status={facility.status} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>
    </>
  );
}
