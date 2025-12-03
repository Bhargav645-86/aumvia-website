import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');

    if (!businessId) {
      return NextResponse.json({ error: 'Business ID required' }, { status: 400 });
    }

    // Calculate total inventory value
    const items = await db.collection('inventory_items').find({ businessId }).toArray();
    const totalValue = items.reduce((sum, item) => sum + (item.totalValue || 0), 0);

    // Get low stock items
    const lowStockItems = items.filter(item => item.quantity <= item.reorderLevel);

    // Get expiring items (within 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    const expiringItems = items.filter(item => 
      item.expiryDate && 
      new Date(item.expiryDate) <= sevenDaysFromNow && 
      new Date(item.expiryDate) >= new Date()
    );

    // Calculate waste analytics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const wasteLogs = await db.collection('waste_logs')
      .find({ 
        businessId,
        date: { $gte: thirtyDaysAgo }
      })
      .toArray();

    const totalWasteCost = wasteLogs.reduce((sum, log) => sum + (log.totalCost || 0), 0);
    
    // Waste by reason
    const wasteByReason = wasteLogs.reduce((acc: any, log) => {
      const reason = log.reason || 'other';
      if (!acc[reason]) {
        acc[reason] = { reason, cost: 0, count: 0 };
      }
      acc[reason].cost += log.totalCost || 0;
      acc[reason].count += 1;
      return acc;
    }, {});

    // Top wasted items
    const wasteByItem = wasteLogs.reduce((acc: any, log) => {
      const itemName = log.itemName || 'Unknown';
      if (!acc[itemName]) {
        acc[itemName] = { itemName, cost: 0, quantity: 0 };
      }
      acc[itemName].cost += log.totalCost || 0;
      acc[itemName].quantity += log.quantity || 0;
      return acc;
    }, {});

    const topWastedItems = Object.values(wasteByItem)
      .sort((a: any, b: any) => b.cost - a.cost)
      .slice(0, 5);

    // Category distribution
    const categoryDistribution = items.reduce((acc: any, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { category, value: 0, count: 0 };
      }
      acc[category].value += item.totalValue || 0;
      acc[category].count += 1;
      return acc;
    }, {});

    return NextResponse.json({
      totalValue,
      totalItems: items.length,
      lowStockCount: lowStockItems.length,
      lowStockItems: lowStockItems.map(item => ({
        _id: item._id,
        name: item.name,
        quantity: item.quantity,
        reorderLevel: item.reorderLevel,
        unit: item.unit
      })),
      expiringCount: expiringItems.length,
      expiringItems: expiringItems.map(item => ({
        _id: item._id,
        name: item.name,
        expiryDate: item.expiryDate,
        quantity: item.quantity,
        unit: item.unit
      })),
      wasteAnalytics: {
        totalCost: totalWasteCost,
        totalLogs: wasteLogs.length,
        byReason: Object.values(wasteByReason),
        topWastedItems,
      },
      categoryDistribution: Object.values(categoryDistribution),
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
