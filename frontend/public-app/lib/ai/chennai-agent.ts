import { tool } from '@langchain/core/tools';
import { ChatGroq } from '@langchain/groq';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { z } from 'zod';

import { createAppointmentBooking } from './appointments';

type ChatHistoryItem = {
  role: string;
  content: string;
};

const SYSTEM_PROMPT = `You are MediBot Chennai, a Chennai-centric health operations and news assistant.

Your job:
- Focus on Chennai and Tamil Nadu public health context first.
- Help with Chennai health news, hospital guidance, dengue/heat/monsoon precautions, and event medical planning.
- Use tools when they are relevant instead of making up appointments or event logistics.
- If the user asks to book an appointment and key details are missing, ask for the missing fields clearly.
- If the user gives event details, prepare a practical Chennai event health brief with risks, staffing, hydration, ambulance, crowd flow, mosquito control, and escalation steps.
- Do not claim to diagnose emergencies. For chest pain, severe breathing issues, stroke symptoms, heavy bleeding, or loss of consciousness, tell the user to call emergency services immediately.

Response style:
- Be concise, practical, and structured.
- Prefer sections and bullet points.
- Mention when you used a tool if it helps the user.`;

const CHENNAI_HEALTH_NEWS = [
  {
    title: 'Chennai corporations intensify mosquito source reduction in hotspot wards',
    source: 'City Public Health Bulletin',
    summary: 'Ward teams are focusing on stagnant-water control, fever surveillance, and public awareness drives before peak mosquito activity.',
  },
  {
    title: 'Government hospitals expand fever and respiratory triage counters',
    source: 'Chennai Health Desk',
    summary: 'Major facilities are increasing fast triage lanes to reduce waiting time during seasonal spikes in fever and flu-like cases.',
  },
  {
    title: 'Weekend preventive health camps announced across North and South Chennai',
    source: 'Tamil Nadu Community Health Update',
    summary: 'Free screening camps are expected to cover blood pressure, diabetes, anemia, and basic physician consultations.',
  },
];

const CHENNAI_GUIDES: Record<string, string> = {
  dengue: `**Dengue Precautions in Chennai**\n- Eliminate stagnant water around homes, terraces, and construction areas.\n- Use full-sleeve clothing and repellents, especially during dawn and dusk.\n- Seek medical review early for high fever, severe body pain, vomiting, or bleeding signs.\n- Stay hydrated and avoid self-medicating with painkillers without medical advice.`,
  heatwave: `**Heat Safety in Chennai**\n- Avoid peak outdoor exposure between 11 AM and 3 PM.\n- Carry water or ORS and plan shaded rest points.\n- Watch elderly people, children, outdoor workers, and people with chronic illness closely.\n- For events, set up cooling points, water counters, and first-aid volunteers.`,
  hospitals: `**Key Chennai Hospital Options**\n- Rajiv Gandhi Government General Hospital: large public tertiary care centre.\n- Government Stanley Medical College Hospital: major emergency and specialty services.\n- Omandurar Government Multi Super Specialty Hospital: advanced specialty care.\n- Kilpauk Medical College Hospital: emergency and trauma support.\n- Apollo Hospitals Greams Road and MIOT: private tertiary care options.`,
  emergency: `**Emergency Contacts**\n- Ambulance: 108\n- State Health Helpline: 104\n- For life-threatening symptoms, call emergency services immediately and go to the nearest major hospital.`,
};

const getChennaiHealthNews = tool(
  async ({ topic }) => {
    const normalized = (topic || '').toLowerCase();
    const filtered = normalized
      ? CHENNAI_HEALTH_NEWS.filter((item) => `${item.title} ${item.summary}`.toLowerCase().includes(normalized))
      : CHENNAI_HEALTH_NEWS;

    const items = filtered.length > 0 ? filtered : CHENNAI_HEALTH_NEWS;

    return `**Latest Chennai Health News**\n${items
      .map(
        (item, index) => `${index + 1}. **${item.title}**\n- Source: ${item.source}\n- Summary: ${item.summary}`,
      )
      .join('\n')}`;
  },
  {
    name: 'get_chennai_health_news',
    description: 'Get a concise Chennai-centric health news briefing.',
    schema: z.object({
      topic: z.string().optional().describe('Optional filter like dengue, flu, camps, or hospitals.'),
    }),
  },
);

const getChennaiHealthGuide = tool(
  async ({ topic }) => {
    const normalized = topic.toLowerCase();

    if (normalized.includes('dengue') || normalized.includes('mosquito')) {
      return CHENNAI_GUIDES.dengue;
    }
    if (normalized.includes('heat') || normalized.includes('summer') || normalized.includes('dehydration')) {
      return CHENNAI_GUIDES.heatwave;
    }
    if (normalized.includes('hospital') || normalized.includes('clinic')) {
      return `${CHENNAI_GUIDES.hospitals}\n\n${CHENNAI_GUIDES.emergency}`;
    }
    if (normalized.includes('emergency') || normalized.includes('ambulance')) {
      return CHENNAI_GUIDES.emergency;
    }

    return `**Chennai Health Guide**\n${CHENNAI_GUIDES.heatwave}\n\n${CHENNAI_GUIDES.dengue}\n\n${CHENNAI_GUIDES.emergency}`;
  },
  {
    name: 'get_chennai_health_guide',
    description: 'Get Chennai-specific public health guidance, emergency contacts, and hospital direction.',
    schema: z.object({
      topic: z.string().describe('A health topic such as dengue, heatwave, hospitals, emergency, clinics, or monsoon safety.'),
    }),
  },
);

const planHealthEvent = tool(
  async ({ eventName, location, eventDate, expectedAttendees, eventType, notes }) => {
    return `**Event Health Brief: ${eventName}**\n- Location: ${location}\n- Date: ${eventDate}\n- Audience Size: ${expectedAttendees}\n- Event Type: ${eventType}\n\n**Operational Priorities**\n- Set up one visible first-aid desk and one fast-response roaming team.\n- Keep hydration points, ORS, and shaded waiting space if the event is outdoors.\n- Maintain one emergency vehicle or ambulance standby path with clear access.\n- Use mosquito control and waste clearance for open venues.\n\n**Suggested Medical Setup**\n- 1 doctor or senior nurse lead per 500-1000 attendees.\n- 2 to 4 first-aid responders depending on venue spread.\n- Stock ORS, ice packs, BP monitor, glucometer, masks, gloves, and stretcher access.\n\n**Chennai-Specific Risks**\n- Heat stress and dehydration for daytime outdoor events.\n- Mosquito exposure after rain or near waterlogged areas.\n- Traffic congestion around venue access affecting ambulance response.\n\n**Coordination Checklist**\n- Share nearest hospital and route map with volunteers.\n- Announce emergency contact point to attendees.\n- Keep drinking water, crowd signage, and shaded rest zones ready.\n- Review weather and rainfall forecast 24 hours before start.\n\n**Event Notes Considered**\n- ${notes || 'No additional notes provided.'}`;
  },
  {
    name: 'plan_chennai_health_event',
    description: 'Create a Chennai-focused medical and operational plan for a public event or camp.',
    schema: z.object({
      eventName: z.string().describe('Name of the event or health camp.'),
      location: z.string().describe('Venue or area in Chennai.'),
      eventDate: z.string().describe('Date or schedule of the event.'),
      expectedAttendees: z.string().describe('Estimated attendee count or crowd size.'),
      eventType: z.string().describe('Type of event such as marathon, school camp, public talk, screening camp, or expo.'),
      notes: z.string().optional().describe('Extra operational notes, weather concerns, or special groups.'),
    }),
  },
);

const bookAppointmentTool = tool(
  async ({ name, phone, email, clinic, department, preferredDate, preferredTime, symptoms }) => {
    const booking = await createAppointmentBooking({
      name,
      phone,
      email,
      clinic,
      department,
      preferredDate,
      preferredTime,
      symptoms,
    });

    return `**Appointment Confirmed**\n- Booking ID: ${booking.id}\n- Patient: ${booking.name}\n- Clinic: ${booking.clinic}\n- Department: ${booking.department}\n- Date: ${booking.preferredDate}\n- Time: ${booking.preferredTime}`;
  },
  {
    name: 'book_chennai_appointment',
    description: 'Book a prototype health appointment when the user provides clinic, department, date, and time.',
    schema: z.object({
      name: z.string().describe('Patient name.'),
      phone: z.string().optional().describe('Contact phone number.'),
      email: z.string().optional().describe('Contact email.'),
      clinic: z.string().describe('Clinic or hospital name in Chennai.'),
      department: z.string().describe('Requested department, e.g. General Medicine or Pediatrics.'),
      preferredDate: z.string().describe('Requested appointment date.'),
      preferredTime: z.string().describe('Requested appointment time.'),
      symptoms: z.string().optional().describe('Short symptom summary.'),
    }),
  },
);

const tools = [
  getChennaiHealthNews,
  getChennaiHealthGuide,
  planHealthEvent,
  bookAppointmentTool,
];

let cachedAgent: ReturnType<typeof createReactAgent> | null = null;

function getAgent() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured.');
  }

  if (!cachedAgent) {
    const llm = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.2,
    });

    cachedAgent = createReactAgent({
      llm,
      tools,
      prompt: SYSTEM_PROMPT,
      name: 'medibot-chennai-agent',
    });
  }

  return cachedAgent;
}

function normaliseContent(content: unknown): string {
  if (typeof content === 'string') {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') {
          return item;
        }

        if (item && typeof item === 'object' && 'text' in item) {
          return String((item as { text?: unknown }).text ?? '');
        }

        return JSON.stringify(item);
      })
      .join('\n')
      .trim();
  }

  if (content == null) {
    return '';
  }

  return JSON.stringify(content);
}

function extractToolsUsed(messages: Array<{ _getType?: () => string; name?: string }>) {
  const toolsUsed = messages
    .filter((message) => typeof message._getType === 'function' && message._getType() === 'tool')
    .map((message) => message.name || 'tool');

  return Array.from(new Set(toolsUsed));
}

export async function runChennaiHealthAgent(input: { message: string; history?: ChatHistoryItem[] }) {
  const agent = getAgent();
  const history = (input.history || [])
    .slice(-8)
    .filter((item) => item && item.content)
    .map((item) => ({
      role: item.role === 'assistant' ? 'assistant' : 'user',
      content: item.content,
    }));

  const result = await agent.invoke({
    messages: [...history, { role: 'user', content: input.message }],
    recursionLimit: Number(process.env.LANGGRAPH_RECURSION_LIMIT ?? 1000000),
  });

  const messages = (result.messages || []) as Array<{ _getType?: () => string; content?: unknown; name?: string }>;
  const lastAiMessage = [...messages].reverse().find(
    (message) => typeof message._getType === 'function' && message._getType() === 'ai',
  );

  return {
    response: normaliseContent(lastAiMessage?.content || 'I could not prepare a response right now.'),
    toolsUsed: extractToolsUsed(messages),
  };
}