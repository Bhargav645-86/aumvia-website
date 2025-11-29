import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { searchParams } = new URL(request.url);
    const skill = searchParams.get('skill');
    const verified = searchParams.get('verified');
    const maxDistance = searchParams.get('maxDistance');
    const businessLat = searchParams.get('businessLat');
    const businessLng = searchParams.get('businessLng');

    let query = supabase
      .from('marketplace_workers')
      .select('*')
      .eq('status', 'active')
      .order('average_rating', { ascending: false });

    if (skill) {
      query = query.contains('skills', [skill]);
    }

    if (verified === 'true') {
      query = query.eq('background_checked', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    let workers = data || [];

    if (maxDistance && businessLat && businessLng) {
      const lat1 = parseFloat(businessLat);
      const lng1 = parseFloat(businessLng);
      const maxDist = parseFloat(maxDistance);

      workers = workers
        .map(worker => {
          if (worker.latitude && worker.longitude) {
            const distance = calculateDistance(lat1, lng1, worker.latitude, worker.longitude);
            return { ...worker, distance };
          }
          return { ...worker, distance: 999 };
        })
        .filter(worker => worker.distance <= maxDist)
        .sort((a, b) => a.distance - b.distance);
    }

    return NextResponse.json(workers);
  } catch (error) {
    console.error('Error fetching workers:', error);
    return NextResponse.json({ error: 'Failed to fetch workers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const profileCompletion = calculateProfileCompletion(body);

    const { data, error } = await supabase
      .from('marketplace_workers')
      .insert([{ ...body, profile_completion: profileCompletion }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating worker:', error);
    return NextResponse.json({ error: 'Failed to create worker' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { id, ...updateData } = body;

    const profileCompletion = calculateProfileCompletion(updateData);

    const { data, error } = await supabase
      .from('marketplace_workers')
      .update({ ...updateData, profile_completion: profileCompletion, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating worker:', error);
    return NextResponse.json({ error: 'Failed to update worker' }, { status: 500 });
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

function calculateProfileCompletion(worker: any): number {
  let score = 0;
  const fields = [
    'name', 'email', 'phone', 'photo_url', 'postcode',
    'skills', 'availability', 'id_verified', 'background_checked', 'right_to_work_verified'
  ];

  fields.forEach(field => {
    if (field === 'skills') {
      if (worker.skills && worker.skills.length > 0) score += 15;
    } else if (field === 'availability') {
      if (worker.availability && Object.values(worker.availability).some(v => v === true)) score += 10;
    } else if (worker[field]) {
      score += 10;
    }
  });

  return Math.min(100, score);
}
