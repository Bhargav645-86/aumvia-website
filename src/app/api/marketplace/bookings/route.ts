import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const workerId = searchParams.get('workerId');

    let query = supabase
      .from('marketplace_bookings')
      .select(`
        *,
        shift:marketplace_shifts(*),
        worker:marketplace_workers(*)
      `)
      .order('created_at', { ascending: false });

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    if (workerId) {
      query = query.eq('worker_id', workerId);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const { data: booking, error: bookingError } = await supabase
      .from('marketplace_bookings')
      .insert([body])
      .select()
      .single();

    if (bookingError) throw bookingError;

    await supabase
      .from('marketplace_shifts')
      .update({
        status: 'filled',
        filled_by: body.worker_id,
        filled_at: new Date().toISOString()
      })
      .eq('id', body.shift_id);

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from('marketplace_bookings')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (updateData.status === 'completed') {
      const { data: booking } = await supabase
        .from('marketplace_bookings')
        .select('worker_id, actual_hours, amount_paid')
        .eq('id', id)
        .single();

      if (booking) {
        await supabase
          .from('marketplace_workers')
          .update({
            total_shifts_completed: supabase.raw('total_shifts_completed + 1'),
            total_hours_worked: supabase.raw(`total_hours_worked + ${booking.actual_hours || 0}`),
            total_earnings: supabase.raw(`total_earnings + ${booking.amount_paid || 0}`)
          })
          .eq('id', booking.worker_id);
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
}
