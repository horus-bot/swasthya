import { NextResponse } from 'next/server';
import zoneMapping from '@/app/data/zone_mapping.json';

type ActionType = 'clinic' | 'upgrade' | 'mobile' | 'ambulance';
type Season = 'summer' | 'monsoon' | 'winter';
type Disease = 'dengue' | 'diarrhea' | 'typhoid' | 'malaria';

type ScenarioRequest = {
  scenarioName?: string;
  targetZoneNo?: number;
  diseaseFocus?: Disease;
  season?: Season;
  populationPressure?: number;
  interventions?: Array<{ type: ActionType; count: number }>;
};

type ZoneRecord = {
  zone_no: number;
  zone_label: string;
  zone_name: string;
  wards: number[];
};

const zones = (zoneMapping as { zones: ZoneRecord[] }).zones;

const actionLabels: Record<ActionType, string> = {
  clinic: 'New clinic pods',
  upgrade: 'Bed upgrades',
  mobile: 'Mobile medical units',
  ambulance: 'Ambulance bases',
};

const actionImpact = {
  clinic: { travel: 3.8, unserved: 2200, overload: 7, capacity: 14, cases: 4 },
  upgrade: { travel: 1.2, unserved: 900, overload: 10, capacity: 16, cases: 3 },
  mobile: { travel: 2.4, unserved: 1700, overload: 6, capacity: 9, cases: 5 },
  ambulance: { travel: 1.9, unserved: 650, overload: 5, capacity: 6, cases: 2 },
} satisfies Record<ActionType, { travel: number; unserved: number; overload: number; capacity: number; cases: number }>;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function asNumber(value: unknown, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function getSeasonPressure(season: Season, disease: Disease) {
  if (season === 'monsoon') {
    if (disease === 'dengue' || disease === 'diarrhea') return 12;
    return 8;
  }
  if (season === 'summer') {
    if (disease === 'diarrhea' || disease === 'typhoid') return 10;
    return 5;
  }
  return disease === 'malaria' ? 6 : 3;
}

function getBaseline(zoneNo: number, pressure: number, season: Season, disease: Disease) {
  const zoneFactor = zoneNo * 0.85;
  const seasonal = getSeasonPressure(season, disease);
  return {
    avgTravelTime: 29 + zoneFactor + pressure * 0.11 + seasonal * 0.4,
    unservedPopulation: 6200 + zoneNo * 240 + pressure * 85 + seasonal * 120,
    overloadScore: 48 + zoneNo * 1.8 + pressure * 0.42 + seasonal * 1.7,
    projectedCaseLoad: 900 + zoneNo * 38 + pressure * 12 + seasonal * 35,
  };
}

function summarizeInterventions(interventions: Array<{ type: ActionType; count: number }>) {
  return interventions
    .filter((item) => item.count > 0)
    .map((item) => ({
      ...item,
      label: actionLabels[item.type],
    }));
}

function getRiskLevel(score: number) {
  if (score >= 78) return 'High';
  if (score >= 56) return 'Medium';
  return 'Low';
}

function buildFallbackSummary(zone: ZoneRecord, disease: Disease, interventions: Array<{ type: ActionType; count: number }>, risk: string) {
  if (!interventions.length) {
    return `Zone ${zone.zone_label} ${zone.zone_name} remains under ${risk.toLowerCase()} operational stress for ${disease} surveillance, but no new intervention capacity has been planned yet.`;
  }

  const labels = interventions.map((item) => `${item.count} ${actionLabels[item.type].toLowerCase()}`).join(', ');
  return `Deploying ${labels} in Zone ${zone.zone_label} ${zone.zone_name} should reduce service gaps for ${disease} response while keeping overload risk at ${risk.toLowerCase()} if rollout starts within the next two weeks.`;
}

function extractJsonObject(text: string) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Model response did not contain JSON.');
  }
  return JSON.parse(text.slice(start, end + 1));
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ScenarioRequest;
    const scenarioName = (body.scenarioName || 'Untitled Scenario').trim() || 'Untitled Scenario';
    const targetZoneNo = asNumber(body.targetZoneNo, 1);
    const diseaseFocus = (body.diseaseFocus || 'dengue') as Disease;
    const season = (body.season || 'monsoon') as Season;
    const populationPressure = clamp(asNumber(body.populationPressure, 60), 10, 100);
    const requestedInterventions = Array.isArray(body.interventions) ? body.interventions : [];

    const interventions = requestedInterventions
      .filter((item): item is { type: ActionType; count: number } => Boolean(item) && ['clinic', 'upgrade', 'mobile', 'ambulance'].includes(item.type))
      .map((item) => ({ type: item.type, count: clamp(asNumber(item.count, 0), 0, 10) }))
      .filter((item) => item.count > 0);

    const zone = zones.find((item) => item.zone_no === targetZoneNo);
    if (!zone) {
      return NextResponse.json({ error: 'Invalid target zone.' }, { status: 400 });
    }

    const baseline = getBaseline(targetZoneNo, populationPressure, season, diseaseFocus);
    let avgTravelTime = baseline.avgTravelTime;
    let unservedPopulation = baseline.unservedPopulation;
    let overloadScore = baseline.overloadScore;
    let projectedCaseLoad = baseline.projectedCaseLoad;
    let capacityLift = 0;

    const interventionEffects = summarizeInterventions(interventions).map((item) => {
      const impact = actionImpact[item.type];
      avgTravelTime -= impact.travel * item.count;
      unservedPopulation -= impact.unserved * item.count;
      overloadScore -= impact.overload * item.count;
      projectedCaseLoad -= projectedCaseLoad * ((impact.cases * item.count) / 100);
      capacityLift += impact.capacity * item.count;

      return {
        type: item.type,
        label: item.label,
        count: item.count,
        effect: `${impact.capacity * item.count}% capacity lift, ${Math.round(impact.travel * item.count)} min travel reduction`,
      };
    });

    avgTravelTime = clamp(avgTravelTime, 8, 90);
    unservedPopulation = clamp(Math.round(unservedPopulation), 1200, 50000);
    overloadScore = clamp(Math.round(overloadScore), 12, 99);
    projectedCaseLoad = clamp(Math.round(projectedCaseLoad), 300, 20000);
    capacityLift = clamp(Math.round(capacityLift), 0, 100);

    const overloadRisk = getRiskLevel(overloadScore);
    const caseDelta = clamp(
      Math.round(((projectedCaseLoad - baseline.projectedCaseLoad) / baseline.projectedCaseLoad) * 100),
      -80,
      40,
    );

    const assumptions = [
      `Population pressure is modeled at ${populationPressure}/100 for the next 90 days.`,
      `${season[0].toUpperCase()}${season.slice(1)} season conditions are applied to ${diseaseFocus} demand.`,
      'Interventions are assumed to go live in staged rollout within 2 to 4 weeks.',
    ];

    const fallbackAi = {
      executiveSummary: buildFallbackSummary(zone, diseaseFocus, interventions, overloadRisk),
      recommendedActions: [
        'Deploy the first intervention bundle to the highest-footfall wards before expanding citywide.',
        'Track ambulance turnaround and bed occupancy every 48 hours for the first two weeks.',
        `Keep disease surveillance focused on ${diseaseFocus} hotspots while the rollout stabilizes.`,
      ],
      operationalRisks: [
        'Staff availability may lag behind new infrastructure capacity.',
        'Referral load can shift to adjacent zones if rollout is not phased carefully.',
        'Demand spikes after severe weather can erase early gains unless stock levels are pre-positioned.',
      ],
      confidence: interventions.length > 0 ? 'medium' : 'low',
      watchMetrics: ['Bed occupancy', 'Response time', 'Daily case intake'],
    };

    let ai = fallbackAi;
    let aiSource: 'groq' | 'fallback' = 'fallback';
    const groqApiKey = process.env.GROQ_API_KEY;

    if (groqApiKey) {
      const prompt = {
        scenarioName,
        zone: `${zone.zone_label} ${zone.zone_name}`,
        diseaseFocus,
        season,
        populationPressure,
        interventions: interventionEffects,
        deterministicMetrics: {
          avgTravelTimeMinutes: Math.round(avgTravelTime),
          unservedPopulation,
          overloadRisk,
          projectedCaseLoad,
          projectedCaseDeltaPercent: caseDelta,
          capacityLiftPercent: capacityLift,
        },
        assumptions,
      };

      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            temperature: 0.25,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content:
                  'You are a public-health operations planner. Reply with valid JSON only. Keep every field concise, concrete, and decision-oriented.',
              },
              {
                role: 'user',
                content:
                  'Review this intervention scenario and return JSON with keys executiveSummary, recommendedActions, operationalRisks, confidence, watchMetrics. Each array must contain exactly 3 short strings. Confidence must be one of high, medium, low. Scenario: ' +
                  JSON.stringify(prompt),
              },
            ],
          }),
        });

        if (groqResponse.ok) {
          const completion = await groqResponse.json();
          const content = completion?.choices?.[0]?.message?.content;
          if (typeof content === 'string' && content.trim()) {
            const parsed = extractJsonObject(content) as typeof fallbackAi;
            ai = {
              executiveSummary: parsed.executiveSummary || fallbackAi.executiveSummary,
              recommendedActions: Array.isArray(parsed.recommendedActions) ? parsed.recommendedActions.slice(0, 3) : fallbackAi.recommendedActions,
              operationalRisks: Array.isArray(parsed.operationalRisks) ? parsed.operationalRisks.slice(0, 3) : fallbackAi.operationalRisks,
              confidence:
                parsed.confidence === 'high' || parsed.confidence === 'medium' || parsed.confidence === 'low'
                  ? parsed.confidence
                  : fallbackAi.confidence,
              watchMetrics: Array.isArray(parsed.watchMetrics) ? parsed.watchMetrics.slice(0, 3) : fallbackAi.watchMetrics,
            };
            aiSource = 'groq';
          }
        }
      } catch {
        ai = fallbackAi;
      }
    }

    return NextResponse.json({
      scenarioName,
      zone: {
        zoneNo: zone.zone_no,
        label: zone.zone_label,
        name: zone.zone_name,
        wardCount: zone.wards.length,
      },
      diseaseFocus,
      season,
      populationPressure,
      metrics: {
        avgTravelTimeMinutes: Math.round(avgTravelTime),
        avgTravelTimeDeltaPercent: clamp(Math.round(((avgTravelTime - baseline.avgTravelTime) / baseline.avgTravelTime) * 100), -80, 20),
        unservedPopulation,
        unservedPopulationDeltaPercent: clamp(
          Math.round(((unservedPopulation - baseline.unservedPopulation) / baseline.unservedPopulation) * 100),
          -80,
          20,
        ),
        overloadRisk,
        overloadScore,
        projectedCaseLoad,
        projectedCaseDeltaPercent: caseDelta,
        capacityLiftPercent: capacityLift,
      },
      interventionEffects,
      assumptions,
      ai,
      aiSource,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Failed to run simulator.' }, { status: 500 });
  }
}