import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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

    // Get base requirements for business type
    const requirements = await db.collection('compliance_requirements')
      .find({ 
        $or: [
          { businessTypes: businessType },
          { businessTypes: 'all' }
        ]
      })
      .sort({ priority: 1, category: 1 })
      .toArray();

    // Get user's document submissions
    const documents = await db.collection('compliance_documents')
      .find({ businessId })
      .toArray();

    // Enhance requirements with submission status
    const enhancedRequirements = requirements.map(req => {
      const userDocs = documents.filter(doc => doc.requirementKey === req.key);
      const latestDoc = userDocs.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )[0];

      let status = 'missing';
      let daysUntilExpiry = null;

      if (latestDoc) {
        if (latestDoc.expiryDate) {
          const today = new Date();
          const expiry = new Date(latestDoc.expiryDate);
          daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

          if (daysUntilExpiry < 0) {
            status = 'expired';
          } else if (daysUntilExpiry <= 30) {
            status = 'expiring';
          } else {
            status = 'valid';
          }
        } else {
          status = 'valid';
        }
      }

      return {
        ...req,
        status,
        daysUntilExpiry,
        latestDocument: latestDoc || null,
        documentCount: userDocs.length
      };
    });

    return NextResponse.json(enhancedRequirements);
  } catch (error) {
    console.error('Error fetching compliance requirements:', error);
    return NextResponse.json({ error: 'Failed to fetch requirements' }, { status: 500 });
  }
}
