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

    const orders = await db.collection('purchase_orders')
      .find({ businessId })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate supplier details
    for (const order of orders) {
      if (order.supplierId) {
        const supplier = await db.collection('suppliers').findOne({ _id: new ObjectId(order.supplierId) });
        order.supplier = supplier;
      }
    }

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const data = await request.json();

    const order = {
      businessId: data.businessId,
      supplierId: data.supplierId,
      orderNumber: `PO-${Date.now()}`,
      items: data.items, // [{ itemId, itemName, quantity, unitPrice }]
      totalAmount: data.items.reduce((sum: number, item: any) => sum + (item.quantity * item.unitPrice), 0),
      status: 'pending', // pending, approved, received, cancelled
      orderDate: new Date(),
      expectedDelivery: data.expectedDelivery ? new Date(data.expectedDelivery) : null,
      deliveredDate: null,
      notes: data.notes || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('purchase_orders').insertOne(order);
    
    return NextResponse.json({ ...order, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const data = await request.json();

    const { _id, ...updateData } = data;
    updateData.updatedAt = new Date();

    // If status changes to 'received', update inventory quantities
    if (updateData.status === 'received') {
      const order = await db.collection('purchase_orders').findOne({ _id: new ObjectId(_id) });
      if (order && order.status !== 'received') {
        updateData.deliveredDate = new Date();
        
        // Update inventory quantities
        for (const item of order.items) {
          if (item.itemId) {
            await db.collection('inventory_items').updateOne(
              { _id: new ObjectId(item.itemId) },
              { 
                $inc: { quantity: item.quantity },
                $set: { 
                  lastRestocked: new Date(),
                  updatedAt: new Date()
                }
              }
            );
          }
        }
      }
    }

    const result = await db.collection('purchase_orders').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await db.collection('purchase_orders').findOne({ _id: new ObjectId(_id) });
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating purchase order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
