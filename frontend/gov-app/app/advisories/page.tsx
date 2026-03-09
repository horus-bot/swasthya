"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/api/supabase";
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Send, Megaphone, AlertTriangle } from 'lucide-react';

export default function AdvisoriesPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [advisories, setAdvisories] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadAdvisories() {
    const { data, error } = await supabase
      .from("advisories")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      setError("Failed to load advisories");
    } else {
      setAdvisories(data || []);
    }
  }

  async function createAdvisory() {
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        raised_when: new Date().toISOString(),
        description: message,
        state: "normal",
      };

      const { error } = await supabase.from("advisories").insert([
        {
          title,
          category: "General",
          severity: "Low",
          message,
          payload,
        },
      ]);

      if (error) {
        console.error(error);
        setError("Insert failed");
        return;
      }

      setTitle("");
      setMessage("");
      loadAdvisories();
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    loadAdvisories();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <PageHeader 
          title="Public Advisories" 
          subtitle="Broadcast alerts and health guidelines to the public and hospitals."
        />

        <div className="space-y-4">
          {/* New Advisory Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-blue-600" />
                Create New Advisory
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input 
                  placeholder="e.g. Dengue Prevention Alert" 
                  value={title} 
                  onChange={(e: any) => setTitle(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  className="w-full min-h-[120px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                  placeholder="Enter full advisory details..." 
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="pt-2 flex justify-end">
                <Button 
                  disabled={isSubmitting || !title || !message} 
                  onClick={createAdvisory} 
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                >
                  <Send className="h-4 w-4 mr-2" /> 
                  {isSubmitting ? 'Broadcasting...' : 'Broadcast Advisory'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Advisories List */}
          <h3 className="font-semibold text-lg text-slate-900 pt-4">Active Advisories</h3>
          <div className="space-y-3">
            {advisories.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Megaphone className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-muted-foreground">No active advisories</p>
                  <p className="text-sm text-muted-foreground mt-1">Create one to get started</p>
                </CardContent>
              </Card>
            ) : (
              advisories.map((a) => (
                <Card key={a.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default" className="h-5 px-2 text-[10px] uppercase">
                            {a.severity || 'Low'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {a.category || 'General'}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1">
                          {a.title}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {a.message}
                        </p>
                        <div className="text-xs text-slate-400 mt-3">
                          {new Date(a.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mobile Preview */}
      <div className="hidden lg:block">
        <div className="sticky top-24">
          <div className="mockup-phone border-gray-800 rounded-[2.5rem] p-2 bg-gray-900 shadow-xl w-[300px] mx-auto">
            <div className="bg-white rounded-[2rem] h-[550px] overflow-hidden relative flex flex-col">
              {/* Header */}
              <div className="bg-blue-600 h-14 w-full flex items-center justify-center text-white font-bold text-sm shadow-sm z-10">
                GovHealth App
              </div>
              
              <div className="p-4 space-y-4 bg-slate-50 flex-1 overflow-y-auto">
                {advisories.length > 0 ? (
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-bold text-blue-600 uppercase">Public Alert</span>
                    </div>
                    <h4 className="font-bold text-sm mb-1">
                      {advisories[0]?.title || 'Latest Advisory'}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-3">
                      {advisories[0]?.message || 'No description'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center">
                    <p className="text-xs text-slate-400">No advisories yet</p>
                  </div>
                )}
              </div>
              
              {/* Nav */}
              <div className="h-12 bg-white border-t flex justify-around items-center px-4">
                <div className="w-8 h-1 bg-slate-200 rounded-full"/>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-4">Public App Preview</p>
        </div>
      </div>
    </div>
  );
}
