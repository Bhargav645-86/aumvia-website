import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { businessId } = await request.json();

    const { data: shifts } = await supabase
      .from('shifts')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', 'published')
      .limit(5);

    if (!shifts || shifts.length === 0) {
      return NextResponse.json({ message: 'No published shifts to create timesheets for' });
    }

    const timesheets = [];

    for (const shift of shifts) {
      const start = new Date(shift.start_time);
      const end = new Date(shift.end_time);
      const scheduledHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60) - (shift.unpaid_break_minutes || 0) / 60;

      const variance = Math.random() > 0.7 ? (Math.random() > 0.5 ? 20 : -10) : 5;
      const actualHours = scheduledHours + variance / 60;

      const status = Math.abs(variance) <= 15 ? 'approved' : 'requires_review';

      timesheets.push({
        shift_id: shift.id,
        staff_id: shift.staff_id,
        business_id: businessId,
        scheduled_hours: parseFloat(scheduledHours.toFixed(2)),
        actual_hours: parseFloat(actualHours.toFixed(2)),
        clock_in: start.toISOString(),
        clock_out: end.toISOString(),
        variance_minutes: variance,
        status,
        submitted_at: new Date().toISOString()
      });
    }

    const { data, error } = await supabase
      .from('timesheets')
      .insert(timesheets)
      .select();

    if (error) throw error;

    return NextResponse.json({ message: 'Sample timesheets created', count: data.length });
  } catch (error) {
    console.error('Error seeding timesheets:', error);
    return NextResponse.json({ error: 'Failed to seed timesheets' }, { status: 500 });
  }
}
