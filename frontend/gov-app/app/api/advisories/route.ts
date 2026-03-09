import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This route uses the Supabase service role key. Ensure you set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server env.
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(req: Request) {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for /api/advisories');
      return NextResponse.json({ error: 'Server not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });
    }

    let supabaseAdmin;
    try {
      supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });
    } catch (createErr: any) {
      console.error('Failed to create Supabase client in /api/advisories', createErr);
      return NextResponse.json({ error: createErr?.message || 'Failed to initialize database client' }, { status: 500 });
    }

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

    const insertObj = {
      id,
      hospital_id: null,
      category: title || null,
      message: description || null,
      severity,
      payload,
    };

    const { error } = await supabaseAdmin.from('govt.govt_complaints').insert(insertObj);
    if (error) {
      console.error('Insert error', error);
      return NextResponse.json({ error: error.message || 'Insert failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id });
  } catch (err: any) {
    console.error('API /api/advisories error', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for /api/advisories GET');
      return NextResponse.json({ error: 'Server not configured (missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } });

    const { data, error } = await supabaseAdmin
      .from('govt.govt_complaints')
      .select('id, severity, category, payload, message, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Failed to fetch advisories (server):', error);
      return NextResponse.json({ error: error.message || 'Failed to fetch advisories' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error('API /api/advisories GET error', err);
    return NextResponse.json({ error: err?.message || 'Server error' }, { status: 500 });
  }
}
