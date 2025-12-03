import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();

    const { data: rating, error: ratingError } = await supabase
      .from('marketplace_ratings')
      .insert([body])
      .select()
      .single();

    if (ratingError) throw ratingError;

    if (body.ratee_type === 'worker') {
      const { data: ratings } = await supabase
        .from('marketplace_ratings')
        .select('stars')
        .eq('ratee_id', body.ratee_id)
        .eq('ratee_type', 'worker');

      if (ratings && ratings.length > 0) {
        const avgRating = ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length;
        await supabase
          .from('marketplace_workers')
          .update({
            average_rating: avgRating,
            total_ratings: ratings.length
          })
          .eq('id', body.ratee_id);
      }
    }

    return NextResponse.json(rating);
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json({ error: 'Failed to create rating' }, { status: 500 });
  }
}
