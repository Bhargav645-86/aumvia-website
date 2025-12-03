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

    const suppliers = await db.collection('suppliers')
      .find({ businessId })
      .sort({ name: 1 })
      .toArray();

    return NextResponse.json(suppliers);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const data = await request.json();

    const supplier = {
      businessId: data.businessId,
      name: data.name,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      address: data.address,
      paymentTerms: data.paymentTerms,
      categories: data.categories || [],
      rating: data.rating || 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('suppliers').insertOne(supplier);
    
    return NextResponse.json({ ...supplier, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const data = await request.json();

    const { _id, ...updateData } = data;
    updateData.updatedAt = new Date();

    const result = await db.collection('suppliers').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Supplier not found' }, { status: 404 });
    }

    const updatedSupplier = await db.collection('suppliers').findOne({ _id: new ObjectId(_id) });
    return NextResponse.json(updatedSupplier);
  } catch (error) {
    console.error('Error updating supplier:', error);
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 });
  }
}
