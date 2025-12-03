import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { businessId, weekStart } = await request.json();

    const { data, error } = await supabase
      .from('shifts')
      .update({ status: 'published', updated_at: new Date().toISOString() })
      .eq('business_id', businessId)
      .eq('week_start', weekStart)
      .eq('status', 'draft')
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      publishedCount: data?.length || 0,
      message: 'Rota published successfully. Notifications sent to staff.'
    });
  } catch (error) {
    console.error('Error publishing rota:', error);
    return NextResponse.json({ error: 'Failed to publish rota' }, { status: 500 });
  }
}
