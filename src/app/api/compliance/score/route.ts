import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const searchParams = request.nextUrl.searchParams;
    const businessId = searchParams.get('businessId');
    const businessType = searchParams.get('businessType');

    if (!businessId || !businessType) {
      return NextResponse.json({ error: 'Business ID and type required' }, { status: 400 });
    }

    // Get all requirements for this business type
    const requirements = await db.collection('compliance_requirements')
      .find({ 
        $or: [
          { businessTypes: businessType },
          { businessTypes: 'all' }
        ]
      })
      .toArray();

    // Get user's documents
    const documents = await db.collection('compliance_documents')
      .find({ businessId })
      .toArray();

    // Calculate compliance score
    let totalRequirements = requirements.length;
    let completedCount = 0;
    let validCount = 0;
    let expiringCount = 0;
    let expiredCount = 0;
    let missingCount = 0;

    const statusBreakdown: any = {
      valid: 0,
      expiring: 0,
      expired: 0,
      missing: 0
    };

    requirements.forEach(req => {
      const userDocs = documents.filter(doc => doc.requirementKey === req.key);
      const latestDoc = userDocs.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )[0];

      if (!latestDoc) {
        missingCount++;
        statusBreakdown.missing++;
      } else {
        completedCount++;
        
        if (latestDoc.expiryDate) {
          const today = new Date();
          const expiry = new Date(latestDoc.expiryDate);
          const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          if (daysUntilExpiry < 0) {
            expiredCount++;
            statusBreakdown.expired++;
          } else if (daysUntilExpiry <= 30) {
            expiringCount++;
            statusBreakdown.expiring++;
          } else {
            validCount++;
            statusBreakdown.valid++;
          }
        } else {
          validCount++;
          statusBreakdown.valid++;
        }
      }
    });

    // Calculate overall score
    // Valid items = 100%, Expiring = 75%, Expired = 0%, Missing = 0%
    const score = totalRequirements > 0 
      ? Math.round(
          ((validCount * 100) + (expiringCount * 75)) / totalRequirements
        )
      : 0;

    // Get urgent items (expiring within 7 days or expired)
    const urgentItems = [];
    for (const req of requirements) {
      const userDocs = documents.filter(doc => doc.requirementKey === req.key);
      const latestDoc = userDocs[0];

      if (!latestDoc) {
        urgentItems.push({
          requirementKey: req.key,
          requirementTitle: req.title,
          status: 'missing',
          priority: 'high'
        });
      } else if (latestDoc.expiryDate) {
        const daysUntilExpiry = Math.ceil(
          (new Date(latestDoc.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilExpiry < 0) {
          urgentItems.push({
            requirementKey: req.key,
            requirementTitle: req.title,
            status: 'expired',
            daysOverdue: Math.abs(daysUntilExpiry),
            priority: 'critical'
          });
        } else if (daysUntilExpiry <= 7) {
          urgentItems.push({
            requirementKey: req.key,
            requirementTitle: req.title,
            status: 'expiring',
            daysRemaining: daysUntilExpiry,
            priority: 'high'
          });
        }
      }
    }

    return NextResponse.json({
      score,
      totalRequirements,
      completedCount,
      validCount,
      expiringCount,
      expiredCount,
      missingCount,
      statusBreakdown,
      urgentItems: urgentItems.slice(0, 5), // Top 5 urgent items
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error calculating compliance score:', error);
    return NextResponse.json({ error: 'Failed to calculate score' }, { status: 500 });
  }
}
