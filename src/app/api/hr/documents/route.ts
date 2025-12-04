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

    const documents = await db.collection('hr_documents')
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

    return NextResponse.json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();

    const document = {
      ...body,
      businessId: body.businessId || 'default',
      status: body.status || 'active',
      signedAt: null,
      signedBy: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('hr_documents').insertOne(document);
    const newDoc = await db.collection('hr_documents').findOne({ _id: result.insertedId });

    return NextResponse.json(newDoc);
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();
    const { _id, action, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    updateData.updatedAt = new Date();

    if (action === 'sign') {
      updateData.signedAt = new Date();
      updateData.signedBy = updateData.signedBy || 'Employee';
      updateData.status = 'signed';
    }

    await db.collection('hr_documents').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    const updatedDocument = await db.collection('hr_documents').findOne({ _id: new ObjectId(_id) });

    if (!updatedDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json({ error: 'Failed to update document' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    await db.collection('hr_documents').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
