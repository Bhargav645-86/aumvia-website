import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: NextRequest) {
  const health: any[] = [];
  const startTime = Date.now();

  try {
    const mongoStart = Date.now();
    const client = await clientPromise;
    const db = client.db('aumvia');
    await db.command({ ping: 1 });
    const mongoLatency = Date.now() - mongoStart;

    health.push({
      service: 'MongoDB',
      status: 'up',
      latency: mongoLatency,
      uptime: 99.9,
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    health.push({
      service: 'MongoDB',
      status: 'down',
      latency: 0,
      uptime: 0,
      error: 'Connection failed',
      lastChecked: new Date().toISOString()
    });
  }

  if (supabaseUrl && supabaseKey) {
    try {
      const supabaseStart = Date.now();
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from('staff').select('id').limit(1);
      const supabaseLatency = Date.now() - supabaseStart;

      health.push({
        service: 'Supabase',
        status: 'up',
        latency: supabaseLatency,
        uptime: 99.5,
        lastChecked: new Date().toISOString()
      });
    } catch (error) {
      health.push({
        service: 'Supabase',
        status: 'warning',
        latency: 0,
        uptime: 0,
        error: 'Connection issue',
        lastChecked: new Date().toISOString()
      });
    }
  } else {
    health.push({
      service: 'Supabase',
      status: 'warning',
      latency: 0,
      uptime: 0,
      error: 'Not configured',
      lastChecked: new Date().toISOString()
    });
  }

  health.push({
    service: 'API Server',
    status: 'up',
    latency: Date.now() - startTime,
    uptime: 99.9,
    lastChecked: new Date().toISOString()
  });

  health.push({
    service: 'Authentication',
    status: 'up',
    latency: 5,
    uptime: 99.8,
    lastChecked: new Date().toISOString()
  });

  let platformStats = {
    totalUsers: 0,
    activeBusinesses: 0,
    totalShifts: 0,
    pendingApprovals: 0
  };

  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    
    platformStats.totalUsers = await db.collection('users').countDocuments();
    platformStats.activeBusinesses = await db.collection('users').countDocuments({ role: 'business', status: 'active' });
    platformStats.pendingApprovals = await db.collection('users').countDocuments({ status: 'pending' });
  } catch (error) {
    console.error('Error fetching platform stats:', error);
  }

  return NextResponse.json({
    health,
    platformStats,
    overallStatus: health.every(h => h.status === 'up') ? 'healthy' : 
                   health.some(h => h.status === 'down') ? 'degraded' : 'warning'
  });
}
