import { NextRequest, NextResponse } from 'next/server';

import { createAppointmentBooking } from '@/lib/ai/appointments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, date, clinic, phone, email, department, time, symptoms } = body;
    if (!name || !date || !clinic) {
      return NextResponse.json({ error: 'name, date, and clinic are required' }, { status: 400 });
    }

    const booking = await createAppointmentBooking({
      name,
      phone,
      email,
      clinic,
      department: department || 'General Medicine',
      preferredDate: date,
      preferredTime: time || '10:00 AM',
      symptoms,
    });

    return NextResponse.json({ success: true, booking });
  } catch (e) {
    console.error('Booking error', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
