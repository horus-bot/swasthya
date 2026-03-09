
/* ---------------- TYPES ---------------- */

export type AdvisorySeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface AdvisoryPayload {
  department?: string;      // e.g. "Corporation", "CRRT"
  location?: string;        // e.g. "T Nagar", "Central Chennai"
  icon?: string;            // optional (used by UI if needed)
  updates?: boolean;        // for the "UPDATES" badge
}

export interface Advisory {
  id: string;
  title: string;
  category: string;
  severity: AdvisorySeverity;
  message: string;
  payload: AdvisoryPayload;
  created_at: string;
}

/* ---------------- READ ---------------- */

/**
 * Fetch Govt Initiatives / Advisories
 */
export async function getGovInitiatives() {
  // Mock data replacing database call
  const mockData: Advisory[] = [
    {
      id: "1",
      title: "Stormwater Drain Completion",
      category: "Infrastructure",
      severity: "CRITICAL",
      message: "Expediting final phase of stormwater drain network in T. Nagar and Mambalam to prevent monsoon waterlogging.",
      payload: { department: "Corporation", location: "T. Nagar", icon: "🏗️", updates: true },
      created_at: new Date().toISOString()
    },
    {
      id: "2",
      title: "Cooum River Restoration",
      category: "Environment",
      severity: "HIGH",
      message: "Phase 3 of the eco-restoration project begun. Removing encroachments and planting native saplings along banks.",
      payload: { department: "CRRT", location: "Central Chennai", icon: "🌊", updates: true },
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: "3",
      title: "Air Quality Monitoring",
      category: "Health",
      severity: "HIGH",
      message: "Setting up 5 new continuous ambient air quality monitoring stations in Manali and Ennore industrial belts.",
      payload: { department: "Pollution Ctrl", location: "North Chennai", icon: "🏭", updates: false },
      created_at: new Date(Date.now() - 172800000).toISOString()
    }
  ];

  return mockData;
}
