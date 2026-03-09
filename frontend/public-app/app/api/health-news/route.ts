import { NextResponse } from 'next/server';
import supabase from '@/app/lib/api/supabase';

export async function GET() {
  try {
    // Attempt to fetch notifications that serve as health news/alerts
    const { data, error } = await supabase
      .from('notifications')
      .select('*, notification_type:notification_type_id(*)')
      .order('created_at', { ascending: false })
      .limit(10);

    if (!error && data && data.length > 0) {
      const healthUpdates = data.map((n: any) => ({
        title: n.title ?? 'Health Update',
        source: n.notification_type?.type_name ?? 'Health Dept',
        link: '',
        date: n.created_at?.split('T')[0] ?? new Date().toISOString().split('T')[0],
      }));
      return NextResponse.json({ healthUpdates });
    }
  } catch (err) {
    console.error('Error fetching health news:', err);
  }

  return NextResponse.json({ healthUpdates: [] });
}