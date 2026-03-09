import { NextResponse } from 'next/server';
import { createComplaint, getPublicComplaints } from '../../lib/api/complaints.service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, description, severity = 'Low', targetAudience = 'All Public App Users', expires_in_hours } = body;

    const payload = {
      title: title || 'Advisory',
      description: description || '',
      issued_by: 'Gov Authority',
      target_audience: targetAudience,
      expires_in_hours: expires_in_hours || 24,
    };

    const id = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

    await createComplaint({
      hospital_id: null,
      category: title || null,
      severity: severity as any,
      payload,
    });

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error('API /api/advisories error', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await getPublicComplaints();
    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('API /api/advisories GET error', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
