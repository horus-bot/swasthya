import fs from 'fs/promises';
import path from 'path';

export interface AppointmentInput {
  name: string;
  phone?: string;
  email?: string;
  clinic: string;
  department: string;
  preferredDate: string;
  preferredTime: string;
  symptoms?: string;
}

export interface AppointmentRecord extends AppointmentInput {
  id: string;
  createdAt: string;
  status: 'confirmed';
}

const BOOKINGS_FILE = path.resolve(process.cwd(), 'public-app-bookings.json');

export async function createAppointmentBooking(input: AppointmentInput): Promise<AppointmentRecord> {
  const booking: AppointmentRecord = {
    id: `BK-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
    name: input.name,
    phone: input.phone || '',
    email: input.email || '',
    clinic: input.clinic,
    department: input.department,
    preferredDate: input.preferredDate,
    preferredTime: input.preferredTime,
    symptoms: input.symptoms || '',
  };

  let existing: AppointmentRecord[] = [];

  try {
    const raw = await fs.readFile(BOOKINGS_FILE, 'utf8');
    existing = JSON.parse(raw || '[]') as AppointmentRecord[];
  } catch {
    existing = [];
  }

  existing.push(booking);
  await fs.writeFile(BOOKINGS_FILE, JSON.stringify(existing, null, 2), 'utf8');

  return booking;
}