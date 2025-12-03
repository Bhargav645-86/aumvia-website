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

    const documents = await db.collection('compliance_documents')
      .find({ businessId })
      .sort({ uploadedAt: -1 })
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
    const data = await request.json();

    const document = {
      businessId: data.businessId,
      requirementKey: data.requirementKey,
      requirementTitle: data.requirementTitle,
      filename: data.filename,
      fileUrl: data.fileUrl || '', // In production, upload to S3/storage
      fileType: data.fileType,
      fileSize: data.fileSize || 0,
      status: 'valid', // valid, expired, pending_review
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      uploadedAt: new Date(),
      uploadedBy: data.uploadedBy,
      notes: data.notes || '',
      verified: false,
      verifiedAt: null,
      verifiedBy: null,
    };

    const result = await db.collection('compliance_documents').insertOne(document);
    
    return NextResponse.json({ ...document, _id: result.insertedId });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
    }

    const result = await db.collection('compliance_documents').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
