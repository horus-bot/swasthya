"use client";

import { useState } from "react";

/* ---------------- Types ---------------- */

type Severity = "low" | "medium" | "high";

type Condition = {
  id: string;
  title: string;
  description: string;
  icon: string;
  severity: Severity;
};

/* ---------------- Conditions ---------------- */

const CONDITIONS: Condition[] = [
  {
    id: "mild",
    title: "Fever / Infection",
    description: "Mild symptoms, non-urgent care",
    icon: "🤒",
    severity: "low",
  },
  {
    id: "pregnancy",
    title: "Pregnancy Care",
    description: "Regular maternal checkups",
    icon: "🤰",
    severity: "medium",
  },
  {
    id: "emergency",
    title: "Emergency",
    description: "Immediate medical attention",
    icon: "🚑",
    severity: "high",
  },
];

/* ---------------- Recommendation Logic ---------------- */

function getRecommendation(severity: Severity) {
  if (severity === "low") {
    return {
      clinic: "Community Health Center (CHC)",
      distance: "7–10 km away",
      route: "Non-priority route",
      transport: "Public transport / Two-wheeler",
      reason:
        "Mild condition detected. Redirecting to farther clinics to reduce hospital crowding.",
    };
  }

  if (severity === "medium") {
    return {
      clinic: "Primary Health Center (PHC)",
      distance: "2–4 km away",
      route: "Balanced route",
      transport: "Auto / Public transport",
      reason:
        "Moderate condition detected. Nearest clinic recommended for timely care.",
    };
  }

  return {
    clinic: "District Government Hospital",
    distance: "< 2 km away",
    route: "Fastest AI-priority route",
    transport: "Ambulance",
    reason:
      "Emergency detected. Nearest hospital and fastest route prioritized.",
  };
}

/* ---------------- Page ---------------- */

export default function RoutingPage() {
  const [selected, setSelected] = useState<Condition | null>(null);

  const recommendation = selected
    ? getRecommendation(selected.severity)
    : null;

  return (
    <main className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Smart Routing</h1>
        <p className="text-gray-500">
          Select your condition to get the best clinic and route
        </p>
      </div>

      {/* Condition Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {CONDITIONS.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelected(item)}
            className={`text-left bg-white rounded-xl border p-6 shadow-sm transition hover:shadow-md ${
              selected?.id === item.id
                ? "border-blue-600 ring-2 ring-blue-100"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div>
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-sm text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Recommendation Panel */}
      {recommendation && (
        <div className="bg-white rounded-xl border shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recommended Clinic & Route
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard
              title="Recommended Facility"
              value={recommendation.clinic}
              meta={recommendation.distance}
              icon="🏥"
            />

            <InfoCard
              title="Suggested Route"
              value={recommendation.route}
              meta="Based on condition severity"
              icon="🗺️"
            />

            <InfoCard
              title="Suggested Transport"
              value={recommendation.transport}
              meta="Optimized choice"
              icon="🚗"
            />
          </div>

          {/* Reason */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
            <strong>Why this recommendation?</strong>
            <p className="mt-1">{recommendation.reason}</p>
          </div>

          {/* Action */}
          <div className="mt-6 flex justify-end">
            <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Start Navigation
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ---------------- Reusable Card ---------------- */

function InfoCard({
  title,
  value,
  meta,
  icon,
}: {
  title: string;
  value: string;
  meta: string;
  icon: string;
}) {
  return (
    <div className="border rounded-xl p-5 flex gap-4">
      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div>
        <h3 className="text-sm text-gray-500">{title}</h3>
        <p className="font-semibold">{value}</p>
        <p className="text-xs text-gray-400">{meta}</p>
      </div>
    </div>
  );
}
