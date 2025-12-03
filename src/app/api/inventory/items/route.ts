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

    const items = await db.collection('inventory_items')
      .find({ businessId })
      .sort({ category: 1, name: 1 })
      .toArray();

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const data = await request.json();

    const item = {
      businessId: data.businessId,
      name: data.name,
      category: data.category,
      quantity: parseFloat(data.quantity),
      unit: data.unit,
      costPerUnit: parseFloat(data.costPerUnit),
      totalValue: parseFloat(data.quantity) * parseFloat(data.costPerUnit),
      reorderLevel: parseFloat(data.reorderLevel),
      supplierId: data.supplierId,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      lastRestocked: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('inventory_items').insertOne(item);
    
    return NextResponse.json({ ...item, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const data = await request.json();

    const { _id, ...updateData } = data;
    
    if (updateData.quantity && updateData.costPerUnit) {
      updateData.totalValue = parseFloat(updateData.quantity) * parseFloat(updateData.costPerUnit);
    }
    
    updateData.updatedAt = new Date();

    const result = await db.collection('inventory_items').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const updatedItem = await db.collection('inventory_items').findOne({ _id: new ObjectId(_id) });
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating inventory item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID required' }, { status: 400 });
    }

    const result = await db.collection('inventory_items').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
