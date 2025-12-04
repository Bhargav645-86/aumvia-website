import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const targetType = searchParams.get('targetType');
    const limit = parseInt(searchParams.get('limit') || '100');
    const page = parseInt(searchParams.get('page') || '1');

    const query: any = {};
    if (action) query.action = action;
    if (targetType) query.targetType = targetType;

    const skip = (page - 1) * limit;

    const logs = await db.collection('audit_logs')
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await db.collection('audit_logs').countDocuments(query);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    return NextResponse.json({ error: 'Failed to fetch audit logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();

    const log = {
      ...body,
      createdAt: new Date()
    };

    const result = await db.collection('audit_logs').insertOne(log);
    const newLog = await db.collection('audit_logs').findOne({ _id: result.insertedId });

    return NextResponse.json(newLog);
  } catch (error) {
    console.error('Error creating audit log:', error);
    return NextResponse.json({ error: 'Failed to create audit log' }, { status: 500 });
  }
}
