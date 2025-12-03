import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    const wasteLogs = await db.collection('waste_logs')
      .find({ businessId })
      .sort({ date: -1 })
      .toArray();

    // Populate item details
    for (const log of wasteLogs) {
      if (log.itemId) {
        const item = await db.collection('inventory_items').findOne({ _id: new ObjectId(log.itemId) });
        log.item = item;
      }
    }

    return NextResponse.json(wasteLogs);
  } catch (error) {
    console.error('Error fetching waste logs:', error);
    return NextResponse.json({ error: 'Failed to fetch waste logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const data = await request.json();

    // Get item details to calculate cost
    const item = await db.collection('inventory_items').findOne({ _id: new ObjectId(data.itemId) });
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const wasteLog = {
      businessId: data.businessId,
      itemId: data.itemId,
      itemName: item.name,
      quantity: parseFloat(data.quantity),
      unit: item.unit,
      costPerUnit: item.costPerUnit,
      totalCost: parseFloat(data.quantity) * item.costPerUnit,
      reason: data.reason, // expired, damaged, spoilage, other
      notes: data.notes || '',
      date: new Date(),
      recordedBy: data.recordedBy,
      createdAt: new Date(),
    };

    const result = await db.collection('waste_logs').insertOne(wasteLog);
    
    // Update inventory quantity
    await db.collection('inventory_items').updateOne(
      { _id: new ObjectId(data.itemId) },
      { 
        $inc: { quantity: -parseFloat(data.quantity) },
        $set: { updatedAt: new Date() }
      }
    );

    return NextResponse.json({ ...wasteLog, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating waste log:', error);
    return NextResponse.json({ error: 'Failed to create waste log' }, { status: 500 });
  }
}
