import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { businessId } = await request.json();

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    // Check if already seeded
    const existingItems = await db.collection('inventory_items').countDocuments({ businessId });
    if (existingItems > 0) {
      return NextResponse.json({ message: 'Data already exists' }, { status: 200 });
    }

    // Seed suppliers
    const suppliers = [
      {
        businessId,
        name: 'Fresh Foods Ltd',
        contactPerson: 'John Smith',
        email: 'john@freshfoods.com',
        phone: '020 1234 5678',
        address: '123 Market Street, London',
        paymentTerms: 'Net 30',
        categories: ['Food', 'Beverages'],
        rating: 4.5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        businessId,
        name: 'Quality Supplies Co',
        contactPerson: 'Sarah Jones',
        email: 'sarah@qualitysupplies.com',
        phone: '020 9876 5432',
        address: '456 Business Park, London',
        paymentTerms: 'Net 15',
        categories: ['Packaging', 'Cleaning'],
        rating: 4.2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const supplierResults = await db.collection('suppliers').insertMany(suppliers);
    const supplierIds = Object.values(supplierResults.insertedIds);

    // Seed inventory items
    const now = new Date();
    const items = [
      {
        businessId,
        name: 'Coffee Beans (Premium Arabica)',
        category: 'Beverages',
        quantity: 50,
        unit: 'kg',
        costPerUnit: 15.50,
        totalValue: 775,
        reorderLevel: 15,
        supplierId: supplierIds[0].toString(),
        expiryDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        lastRestocked: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        businessId,
        name: 'Whole Milk',
        category: 'Dairy',
        quantity: 8,
        unit: 'liters',
        costPerUnit: 1.20,
        totalValue: 9.60,
        reorderLevel: 10,
        supplierId: supplierIds[0].toString(),
        expiryDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        lastRestocked: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        businessId,
        name: 'Bread Flour',
        category: 'Bakery',
        quantity: 25,
        unit: 'kg',
        costPerUnit: 2.50,
        totalValue: 62.50,
        reorderLevel: 10,
        supplierId: supplierIds[0].toString(),
        expiryDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        lastRestocked: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        businessId,
        name: 'Olive Oil (Extra Virgin)',
        category: 'Oils',
        quantity: 12,
        unit: 'liters',
        costPerUnit: 8.00,
        totalValue: 96.00,
        reorderLevel: 5,
        supplierId: supplierIds[0].toString(),
        expiryDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000),
        lastRestocked: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        businessId,
        name: 'Takeaway Boxes (Medium)',
        category: 'Packaging',
        quantity: 500,
        unit: 'pieces',
        costPerUnit: 0.25,
        totalValue: 125.00,
        reorderLevel: 100,
        supplierId: supplierIds[1].toString(),
        expiryDate: null,
        lastRestocked: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        businessId,
        name: 'Cleaning Solution',
        category: 'Cleaning',
        quantity: 20,
        unit: 'bottles',
        costPerUnit: 3.50,
        totalValue: 70.00,
        reorderLevel: 8,
        supplierId: supplierIds[1].toString(),
        expiryDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        lastRestocked: now,
        createdAt: now,
        updatedAt: now,
      },
    ];

    await db.collection('inventory_items').insertMany(items);

    // Seed some waste logs
    const wasteLogs = [
      {
        businessId,
        itemId: null, // Will reference milk after creation
        itemName: 'Whole Milk',
        quantity: 2,
        unit: 'liters',
        costPerUnit: 1.20,
        totalCost: 2.40,
        reason: 'expired',
        notes: 'Past use-by date',
        date: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        recordedBy: 'Manager',
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        businessId,
        itemId: null,
        itemName: 'Bread Flour',
        quantity: 1,
        unit: 'kg',
        costPerUnit: 2.50,
        totalCost: 2.50,
        reason: 'damaged',
        notes: 'Bag torn during storage',
        date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        recordedBy: 'Staff',
        createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
    ];

    await db.collection('waste_logs').insertMany(wasteLogs);

    return NextResponse.json({ 
      message: 'Sample data created successfully',
      suppliers: suppliers.length,
      items: items.length,
      wasteLogs: wasteLogs.length
    });
  } catch (error) {
    console.error('Error seeding inventory data:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
