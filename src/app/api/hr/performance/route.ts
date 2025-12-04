import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'default';
    const employeeId = searchParams.get('employeeId');
    const type = searchParams.get('type');

    const query: any = { businessId };
    if (employeeId) query.employeeId = employeeId;
    if (type) query.type = type;

    const notes = await db.collection('performance_notes')
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'employees',
            let: { empId: { $toObjectId: '$employeeId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$empId'] } } }
            ],
            as: 'employee'
          }
        },
        { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } }
      ])
      .toArray();

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching performance notes:', error);
    return NextResponse.json({ error: 'Failed to fetch performance notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();

    const note = {
      ...body,
      businessId: body.businessId || 'default',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('performance_notes').insertOne(note);
    
    const newNote = await db.collection('performance_notes')
      .aggregate([
        { $match: { _id: result.insertedId } },
        {
          $lookup: {
            from: 'employees',
            let: { empId: { $toObjectId: '$employeeId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$empId'] } } }
            ],
            as: 'employee'
          }
        },
        { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } }
      ])
      .next();

    return NextResponse.json(newNote);
  } catch (error) {
    console.error('Error creating performance note:', error);
    return NextResponse.json({ error: 'Failed to create performance note' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Performance note ID required' }, { status: 400 });
    }

    updateData.updatedAt = new Date();

    await db.collection('performance_notes').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    const updated = await db.collection('performance_notes')
      .aggregate([
        { $match: { _id: new ObjectId(_id) } },
        {
          $lookup: {
            from: 'employees',
            let: { empId: { $toObjectId: '$employeeId' } },
            pipeline: [
              { $match: { $expr: { $eq: ['$_id', '$$empId'] } } }
            ],
            as: 'employee'
          }
        },
        { $unwind: { path: '$employee', preserveNullAndEmptyArrays: true } }
      ])
      .next();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating performance note:', error);
    return NextResponse.json({ error: 'Failed to update performance note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Performance note ID required' }, { status: 400 });
    }

    await db.collection('performance_notes').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting performance note:', error);
    return NextResponse.json({ error: 'Failed to delete performance note' }, { status: 500 });
  }
}
