import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'default';

    const { data, error } = await supabase
      .from('timesheets')
      .select(`
        *,
        staff:staff_id (
          id,
          name,
          role,
          hourly_rate
        ),
        shift:shift_id (
          id,
          start_time,
          end_time,
          role
        )
      `)
      .eq('business_id', businessId)
      .order('submitted_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching timesheets:', error);
    return NextResponse.json({ error: 'Failed to fetch timesheets' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const varianceMinutes = Math.round((body.actual_hours - body.scheduled_hours) * 60);

    let status = 'pending';
    if (Math.abs(varianceMinutes) <= 15) {
      status = 'approved';
    } else {
      status = 'requires_review';
    }

    const { data, error } = await supabase
      .from('timesheets')
      .insert([{
        ...body,
        variance_minutes: varianceMinutes,
        status
      }])
      .select(`
        *,
        staff:staff_id (
          id,
          name,
          role,
          hourly_rate
        ),
        shift:shift_id (
          id,
          start_time,
          end_time,
          role
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating timesheet:', error);
    return NextResponse.json({ error: 'Failed to create timesheet' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { id, ...updateData } = body;

    if (updateData.status === 'approved' || updateData.status === 'rejected') {
      updateData.reviewed_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('timesheets')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        staff:staff_id (
          id,
          name,
          role,
          hourly_rate
        ),
        shift:shift_id (
          id,
          start_time,
          end_time,
          role
        )
      `)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating timesheet:', error);
    return NextResponse.json({ error: 'Failed to update timesheet' }, { status: 500 });
  }
}
