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
    const status = searchParams.get('status');

    let query = supabase
      .from('shifts')
      .select('*')
      .order('start_time', { ascending: true });

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    let shifts = data || [];

    if (workerId) {
      const { data: worker } = await supabase
        .from('marketplace_workers')
        .select('*')
        .eq('id', workerId)
        .single();

      if (worker) {
        shifts = shifts.filter(shift => {
          const hasMatchingSkills = shift.required_skills.length === 0 ||
            shift.required_skills.some((skill: string) => worker.skills.includes(skill));

          const shiftDay = new Date(shift.start_time).toLocaleDateString('en-US', { weekday: 'lowercase' });
          const isAvailable = worker.availability[shiftDay] === true;

          if (worker.latitude && worker.longitude && shift.business_latitude && shift.business_longitude) {
            const distance = calculateDistance(
              worker.latitude,
              worker.longitude,
              shift.business_latitude,
              shift.business_longitude
            );
            return hasMatchingSkills && isAvailable && distance <= worker.radius_miles;
          }

          return hasMatchingSkills && isAvailable;
        });
      }
    }

    return NextResponse.json(shifts);
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return NextResponse.json({ error: 'Failed to fetch shifts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const { data, error } = await supabase
      .from('shifts')
      .insert([body])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating shift:', error);
    return NextResponse.json({ error: 'Failed to create shift' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabase
      .from('shifts')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating shift:', error);
    return NextResponse.json({ error: 'Failed to update shift' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Shift ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('shifts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting shift:', error);
    return NextResponse.json({ error: 'Failed to delete shift' }, { status: 500 });
  }
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
