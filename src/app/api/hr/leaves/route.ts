import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId') || 'default';
    const status = searchParams.get('status');
    const employeeId = searchParams.get('employeeId');

    const query: any = { businessId };
    if (status) query.status = status;
    if (employeeId) query.employeeId = employeeId;

    const leaves = await db.collection('leave_requests')
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

    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    return NextResponse.json({ error: 'Failed to fetch leave requests' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();

    const leaveRequest = {
      ...body,
      businessId: body.businessId || 'default',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('leave_requests').insertOne(leaveRequest);
    
    const newLeave = await db.collection('leave_requests')
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

    return NextResponse.json(newLeave);
  } catch (error) {
    console.error('Error creating leave request:', error);
    return NextResponse.json({ error: 'Failed to create leave request' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Leave request ID required' }, { status: 400 });
    }

    updateData.updatedAt = new Date();
    if (updateData.status === 'approved' || updateData.status === 'rejected') {
      updateData.reviewedAt = new Date();
      updateData.reviewedBy = updateData.reviewedBy || 'Manager';
    }

    await db.collection('leave_requests').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    const updated = await db.collection('leave_requests')
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
    console.error('Error updating leave request:', error);
    return NextResponse.json({ error: 'Failed to update leave request' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Leave request ID required' }, { status: 400 });
    }

    await db.collection('leave_requests').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting leave request:', error);
    return NextResponse.json({ error: 'Failed to delete leave request' }, { status: 500 });
  }
}
