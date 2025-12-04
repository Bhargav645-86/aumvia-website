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

    const query: any = { businessId };
    if (status) query.status = status;

    const employees = await db.collection('employees')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();

    const employee = {
      ...body,
      businessId: body.businessId || 'default',
      status: 'active',
      documents: [],
      performanceNotes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('employees').insertOne(employee);
    const newEmployee = await db.collection('employees').findOne({ _id: result.insertedId });

    return NextResponse.json(newEmployee);
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
    }

    updateData.updatedAt = new Date();

    await db.collection('employees').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    const updatedEmployee = await db.collection('employees').findOne({ _id: new ObjectId(_id) });

    if (!updatedEmployee) {
      return NextResponse.json({ error: 'Employee not found' }, { status: 404 });
    }

    return NextResponse.json(updatedEmployee);
  } catch (error) {
    console.error('Error updating employee:', error);
    return NextResponse.json({ error: 'Failed to update employee' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Employee ID required' }, { status: 400 });
    }

    await db.collection('employees').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting employee:', error);
    return NextResponse.json({ error: 'Failed to delete employee' }, { status: 500 });
  }
}
