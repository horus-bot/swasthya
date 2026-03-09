"use client";

import React, { useMemo, useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SimulatorActions, type SimulatorActionType } from '@/components/simulator/SimulatorActions';
import { ImpactMetrics, type ImpactMetric } from '@/components/simulator/ImpactMetrics';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import zoneMapping from '@/app/data/zone_mapping.json';
import { Loader2, RotateCcw, Save, Sparkles } from 'lucide-react';

type DiseaseFocus = 'dengue' | 'diarrhea' | 'typhoid' | 'malaria';
type Season = 'summer' | 'monsoon' | 'winter';

type SimulatorResponse = {
  scenarioName: string;
  zone: { zoneNo: number; label: string; name: string; wardCount: number };
  diseaseFocus: DiseaseFocus;
  season: Season;
  populationPressure: number;
  metrics: {
    avgTravelTimeMinutes: number;
    avgTravelTimeDeltaPercent: number;
    unservedPopulation: number;
    unservedPopulationDeltaPercent: number;
    overloadRisk: string;
    overloadScore: number;
    projectedCaseLoad: number;
    projectedCaseDeltaPercent: number;
    capacityLiftPercent: number;
  };
  interventionEffects: Array<{ type: SimulatorActionType; label: string; count: number; effect: string }>;
  assumptions: string[];
  ai: {
    executiveSummary: string;
    recommendedActions: string[];
    operationalRisks: string[];
    confidence: 'high' | 'medium' | 'low';
    watchMetrics: string[];
  };
  aiSource: 'groq' | 'fallback';
  generatedAt: string;
};

type ZoneRecord = {
  zone_no: number;
  zone_label: string;
  zone_name: string;
  wards: number[];
};

const zones = (zoneMapping as { zones: ZoneRecord[] }).zones;

const initialCounts: Record<SimulatorActionType, number> = {
  clinic: 0,
  upgrade: 0,
  mobile: 0,
  ambulance: 0,
};

function formatSignedPercent(value: number) {
  if (value === 0) return 'Stable';
  return `${value > 0 ? '+' : ''}${value}%`;
}

function formatCompactNumber(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  }
  return `${value}`;
}

function buildPreviewMetrics(counts: Record<SimulatorActionType, number>): ImpactMetric[] {
  const interventionUnits = Object.values(counts).reduce((sum, value) => sum + value, 0);
  const travel = Math.max(18, 34 - counts.clinic * 3 - counts.mobile * 2 - counts.ambulance);
  const unserved = Math.max(2400, 9600 - counts.clinic * 1800 - counts.mobile * 1400 - counts.upgrade * 700);
  const overloadTrend = interventionUnits === 0 ? 'neutral' : 'good';

  return [
    { label: 'Avg Travel Time', value: `${travel}m`, change: interventionUnits === 0 ? 'Stable' : `${-Math.min(45, interventionUnits * 6)}%`, trend: interventionUnits === 0 ? 'neutral' : 'good' },
    { label: 'Unserved Pop.', value: formatCompactNumber(unserved), change: interventionUnits === 0 ? 'Stable' : `${-Math.min(60, interventionUnits * 8)}%`, trend: interventionUnits === 0 ? 'neutral' : 'good' },
    { label: 'Overload Risk', value: interventionUnits >= 4 ? 'Low' : interventionUnits >= 2 ? 'Medium' : 'High', change: interventionUnits === 0 ? 'Stable' : interventionUnits >= 4 ? 'Improving' : 'Watch', trend: overloadTrend },
  ];
}

function buildMetrics(result: SimulatorResponse | null, counts: Record<SimulatorActionType, number>): ImpactMetric[] {
  if (!result) {
    return buildPreviewMetrics(counts);
  }

  return [
    {
      label: 'Avg Travel Time',
      value: `${result.metrics.avgTravelTimeMinutes}m`,
      change: formatSignedPercent(result.metrics.avgTravelTimeDeltaPercent),
      trend: result.metrics.avgTravelTimeDeltaPercent < 0 ? 'good' : result.metrics.avgTravelTimeDeltaPercent > 0 ? 'bad' : 'neutral',
    },
    {
      label: 'Unserved Pop.',
      value: formatCompactNumber(result.metrics.unservedPopulation),
      change: formatSignedPercent(result.metrics.unservedPopulationDeltaPercent),
      trend: result.metrics.unservedPopulationDeltaPercent < 0 ? 'good' : result.metrics.unservedPopulationDeltaPercent > 0 ? 'bad' : 'neutral',
    },
    {
      label: 'Overload Risk',
      value: result.metrics.overloadRisk,
      change: `${result.metrics.capacityLiftPercent}% lift`,
      trend: result.metrics.overloadRisk === 'High' ? 'bad' : result.metrics.overloadRisk === 'Medium' ? 'neutral' : 'good',
    },
  ];
}

export default function SimulatorPage() {
  const [scenarioName, setScenarioName] = useState('Scenario A');
  const [targetZoneNo, setTargetZoneNo] = useState(9);
  const [diseaseFocus, setDiseaseFocus] = useState<DiseaseFocus>('dengue');
  const [season, setSeason] = useState<Season>('monsoon');
  const [populationPressure, setPopulationPressure] = useState(62);
  const [counts, setCounts] = useState<Record<SimulatorActionType, number>>(initialCounts);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [result, setResult] = useState<SimulatorResponse | null>(null);

  const selectedZone = zones.find((zone) => zone.zone_no === targetZoneNo) ?? zones[0];

  const plannedInterventions = useMemo(
    () => Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({ type: type as SimulatorActionType, count })),
    [counts],
  );

  const metrics = useMemo(() => buildMetrics(result, counts), [result, counts]);

  const addAction = (action: SimulatorActionType) => {
    setCounts((current) => ({ ...current, [action]: Math.min(current[action] + 1, 10) }));
    setSaveMessage('');
  };

  const removeAction = (action: SimulatorActionType) => {
    setCounts((current) => ({ ...current, [action]: Math.max(current[action] - 1, 0) }));
    setSaveMessage('');
  };

  const resetScenario = () => {
    setScenarioName('Scenario A');
    setTargetZoneNo(9);
    setDiseaseFocus('dengue');
    setSeason('monsoon');
    setPopulationPressure(62);
    setCounts(initialCounts);
    setResult(null);
    setError('');
    setSaveMessage('');
  };

  const saveScenario = () => {
    const payload = {
      scenarioName,
      targetZoneNo,
      diseaseFocus,
      season,
      populationPressure,
      interventions: plannedInterventions,
      savedAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('simulator:lastScenario', JSON.stringify(payload));
    }

    setSaveMessage('Scenario saved locally in this browser.');
  };

  const runSimulation = async () => {
    setIsRunning(true);
    setError('');
    setSaveMessage('');

    try {
      const response = await fetch('/api/simulator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          scenarioName,
          targetZoneNo,
          diseaseFocus,
          season,
          populationPressure,
          interventions: plannedInterventions,
        }),
      });

      const body = await response.json().catch(() => null);
      if (!response.ok) {
        setError(body?.error || 'Simulation failed.');
        return;
      }

      setResult(body as SimulatorResponse);
    } catch (simulationError) {
      console.error('Simulator error:', simulationError);
      setError('Simulation failed. Check your network and GROQ_API_KEY, then try again.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col">
       <PageHeader 
        title="Intervention Simulator" 
        subtitle="Test resource allocation strategies and generate an AI operations briefing for the selected zone."
       >
         <Button variant="outline" size="sm" onClick={resetScenario}>
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
         </Button>
         <Button size="sm" variant="outline" onClick={saveScenario}>
            <Save className="h-4 w-4 mr-2" /> Save Scenario
         </Button>
         <Button size="sm" onClick={runSimulation} disabled={isRunning}>
            {isRunning ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Sparkles className="h-4 w-4 mr-2" />}
            Run AI Simulation
         </Button>
       </PageHeader>

       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
           <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(135deg,#f8fafc,#e2e8f0)] p-6 md:p-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Scenario Canvas</div>
                        <h2 className="mt-2 text-2xl font-semibold text-slate-900">{scenarioName}</h2>
                        <p className="mt-2 max-w-2xl text-sm text-slate-600">
                          Zone {selectedZone.zone_label} {selectedZone.zone_name} with {selectedZone.wards.length} wards, focused on {diseaseFocus} during {season} conditions.
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="border-blue-200 bg-white/70 text-blue-700">
                          Pressure {populationPressure}/100
                        </Badge>
                        <Badge variant="outline" className="border-emerald-200 bg-white/70 text-emerald-700">
                          {plannedInterventions.length || 0} intervention types
                        </Badge>
                        {result && (
                          <Badge variant="outline" className="border-violet-200 bg-white/70 text-violet-700">
                            {result.aiSource === 'groq' ? 'Groq briefing' : 'Fallback briefing'}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                      {plannedInterventions.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-6 text-sm text-slate-500 md:col-span-2 xl:col-span-4">
                          Add interventions from the panel to build a simulation package.
                        </div>
                      ) : (
                        plannedInterventions.map((item) => (
                          <div key={item.type} className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
                            <div className="text-xs uppercase tracking-wide text-slate-500">Deployment</div>
                            <div className="mt-2 text-lg font-semibold text-slate-900">{item.count}x {item.type}</div>
                            <div className="mt-1 text-sm text-slate-600">Assigned to Zone {selectedZone.zone_label} rollout lane.</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">AI Operations Briefing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm text-slate-700">
                    <p>
                      {result?.ai.executiveSummary || 'Run the simulator to generate a zone-specific response plan using the current intervention bundle.'}
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Recommended Actions</div>
                        <ul className="space-y-2">
                          {(result?.ai.recommendedActions || ['Choose a target zone and add an intervention package.', 'Set the demand pressure to reflect current service stress.', 'Run the AI simulation to get an operations briefing.']).map((item) => (
                            <li key={item} className="rounded-xl bg-slate-50 px-3 py-2">{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Operational Risks</div>
                        <ul className="space-y-2">
                          {(result?.ai.operationalRisks || ['No risk analysis yet. Run the simulator to evaluate staffing and response bottlenecks.', 'AI output will appear here after a successful run.', 'Use this to compare competing scenarios before rollout.']).map((item) => (
                            <li key={item} className="rounded-xl bg-slate-50 px-3 py-2">{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Monitoring Watchlist</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {(result?.ai.watchMetrics || ['Bed occupancy', 'Triage delay', 'Field response coverage']).map((item) => (
                      <div key={item} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                        {item}
                      </div>
                    ))}
                    {result && (
                      <div className="rounded-xl bg-violet-50 px-3 py-3 text-sm text-violet-800">
                        Confidence: <span className="font-semibold capitalize">{result.ai.confidence}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {result && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Simulation Output</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Projected Case Load</div>
                      <div className="mt-2 text-2xl font-semibold text-slate-900">{formatCompactNumber(result.metrics.projectedCaseLoad)}</div>
                      <div className="mt-1 text-sm text-slate-600">{formatSignedPercent(result.metrics.projectedCaseDeltaPercent)} vs baseline</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Capacity Lift</div>
                      <div className="mt-2 text-2xl font-semibold text-slate-900">{result.metrics.capacityLiftPercent}%</div>
                      <div className="mt-1 text-sm text-slate-600">From planned deployment bundle</div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-4 md:col-span-2">
                      <div className="text-xs uppercase tracking-wide text-slate-500">Assumptions</div>
                      <ul className="mt-2 space-y-2 text-sm text-slate-700">
                        {result.assumptions.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
           </div>

           <div className="space-y-4">
              <Card className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg">Scenario Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="scenario-name">Scenario Name</Label>
                    <Input id="scenario-name" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="zone-select">Target Zone</Label>
                    <Select id="zone-select" value={String(targetZoneNo)} onChange={(e) => setTargetZoneNo(Number(e.target.value))}>
                      {zones.map((zone) => (
                        <option key={zone.zone_no} value={zone.zone_no}>
                          Zone {zone.zone_label} {zone.zone_name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="disease-focus">Disease Focus</Label>
                      <Select id="disease-focus" value={diseaseFocus} onChange={(e) => setDiseaseFocus(e.target.value as DiseaseFocus)}>
                        <option value="dengue">Dengue</option>
                        <option value="diarrhea">Diarrhea</option>
                        <option value="typhoid">Typhoid</option>
                        <option value="malaria">Malaria</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="season">Season</Label>
                      <Select id="season" value={season} onChange={(e) => setSeason(e.target.value as Season)}>
                        <option value="summer">Summer</option>
                        <option value="monsoon">Monsoon</option>
                        <option value="winter">Winter</option>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pressure">Population Pressure</Label>
                      <span className="text-sm text-slate-500">{populationPressure}/100</span>
                    </div>
                    <input
                      id="pressure"
                      type="range"
                      min={10}
                      max={100}
                      step={1}
                      value={populationPressure}
                      onChange={(e) => setPopulationPressure(Number(e.target.value))}
                      className="mt-2 w-full"
                    />
                  </div>
                  {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
                  {saveMessage && <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{saveMessage}</div>}
                </CardContent>
              </Card>

              <SimulatorActions counts={counts} onAdd={addAction} onRemove={removeAction} />

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Projected Impact</h3>
                <ImpactMetrics metrics={metrics} />
              </div>

              {result?.interventionEffects && result.interventionEffects.length > 0 && (
                <Card className="border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg">Intervention Effects</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.interventionEffects.map((item) => (
                      <div key={item.type} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                        <div className="font-medium text-slate-900">{item.label} x{item.count}</div>
                        <div className="mt-1 text-sm text-slate-600">{item.effect}</div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
           </div>
       </div>
    </div>
  );
}
