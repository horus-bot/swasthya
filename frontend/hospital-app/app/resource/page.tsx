import ResourceStatCard from "./components/ResourceStatCard";
import BedManagement from "./components/BedManagement";
import StaffManagement from "./components/StaffManagement";
import ResourceFilters from "./components/ResourceFilters";
import EquipmentStatusCard from "../dashboard/components/EquipmentStatus";
import { Bed, Wrench, Users, AlertTriangle } from "lucide-react";

export default function ResourcePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
          Resource Management
        </h1>
        <p className="text-gray-500 mt-2">Monitor and manage hospital beds, equipment, and staff resources</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ResourceStatCard 
          title="Available Beds" 
          value="28" 
          subtitle="Out of 60 total" 
          icon={<Bed className="text-blue-600" size={24} />}
        />
        <ResourceStatCard 
          title="Active Equipment" 
          value="42" 
          subtitle="85% operational" 
          icon={<Wrench className="text-emerald-600" size={24} />}
        />
        <ResourceStatCard 
          title="Staff On Duty" 
          value="35" 
          subtitle="Morning shift" 
          icon={<Users className="text-purple-600" size={24} />}
        />
        <ResourceStatCard 
          title="Critical Issues" 
          value="3" 
          subtitle="Require attention" 
          icon={<AlertTriangle className="text-red-600" size={24} />}
        />
      </div>

      {/* Filters */}
      <ResourceFilters />

      {/* Resource Management Sections */}
      <div className="space-y-8">
        {/* Bed Management */}
        <BedManagement />

        {/* Equipment and Staff in a grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EquipmentStatusCard />
          <StaffManagement />
        </div>
      </div>
    </div>
  );
}