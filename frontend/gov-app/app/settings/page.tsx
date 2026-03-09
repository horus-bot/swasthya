"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Bell, Shield, LogOut } from 'lucide-react';

function Label({ children, className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>{children}</label>
}

export default function SettingsPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Clear authentication state
    localStorage.removeItem('gov_auth');
    localStorage.removeItem('gov_username');
    localStorage.removeItem('login_time');
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your profile and dashboard preferences."
      />

      <div className="space-y-6">
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" /> Profile Information
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input defaultValue="Dr. Health Admin" />
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input defaultValue="admin@tn.gov.in" disabled />
                    </div>
                    <div className="space-y-2">
                        <Label>Department</Label>
                        <Input defaultValue="Public Health & Preventive Medicine" disabled />
                    </div>
                     <div className="space-y-2">
                        <Label>Role</Label>
                        <Input defaultValue="Super Admin" disabled />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button>Save Changes</Button>
                </div>
            </CardContent>
         </Card>

         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" /> Notification Preferences
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                     {[
                         "Receive daily summary reports via email",
                         "Alert me for critical outbreaks immediately (SMS)",
                         "Notify when facility occupancy exceeds 90%",
                         "Weekly infrastructure gap analysis digest"
                     ].map((item, i) => (
                         <div key={i} className="flex items-center justify-between py-2 border-b last:border-0 border-slate-100">
                             <Label className="font-normal text-base text-slate-700">{item}</Label>
                             <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                         </div>
                     ))}
                </div>
            </CardContent>
         </Card>

         <Card className="border-red-200 bg-red-50/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                    <LogOut className="h-5 w-5" /> Account Actions
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-slate-900">Sign out of your account</p>
                        <p className="text-sm text-slate-600 mt-1">This will log you out from the government portal</p>
                    </div>
                    <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
