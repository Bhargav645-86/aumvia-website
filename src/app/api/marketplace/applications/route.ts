import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const shiftId = searchParams.get('shiftId');
    const workerId = searchParams.get('workerId');

    let query = supabase
      .from('marketplace_applications')
      .select(`
        *,
        shift:marketplace_shifts(*),
        worker:marketplace_workers(*)
      `)
      .order('applied_at', { ascending: false });

    if (shiftId) {
      query = query.eq('shift_id', shiftId);
    }

    if (workerId) {
      query = query.eq('worker_id', workerId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const { data: application, error: appError } = await supabase
      .from('marketplace_applications')
      .insert([body])
      .select()
      .single();

    if (appError) throw appError;

    const { error: shiftError } = await supabase.rpc('increment_applicant_count', {
      shift_id: body.shift_id
    });

    if (shiftError) {
      await supabase
        .from('marketplace_shifts')
        .update({ applicant_count: supabase.raw('applicant_count + 1') })
        .eq('id', body.shift_id);
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { id, status } = body;

    const { data, error } = await supabase
      .from('marketplace_applications')
      .update({ status, reviewed_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
