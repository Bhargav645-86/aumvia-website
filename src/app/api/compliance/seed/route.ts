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

    // Check if requirements already exist
    const existingReqs = await db.collection('compliance_requirements').countDocuments();
    if (existingReqs === 0) {
      // Seed compliance requirements
      const requirements = [
        // Universal requirements (all business types)
        {
          key: 'business_insurance',
          title: 'Business Insurance',
          description: 'Public Liability Insurance (minimum £5m) and Employer\'s Liability Insurance (if you have staff)',
          category: 'Insurance',
          businessTypes: ['all'],
          required: true,
          hasExpiry: true,
          renewalPeriod: 365, // days
          priority: 1,
          templateAvailable: true,
          guideUrl: '',
          createdAt: new Date()
        },
        {
          key: 'emergency_contacts',
          title: 'Emergency Contact Information',
          description: 'List of emergency contacts including fire, police, and key personnel',
          category: 'Health & Safety',
          businessTypes: ['all'],
          required: true,
          hasExpiry: false,
          priority: 3,
          templateAvailable: true,
          createdAt: new Date()
        },

        // Food business specific
        {
          key: 'food_hygiene_cert',
          title: 'Food Hygiene Certificates',
          description: 'Level 2 Food Hygiene Certificate for all food handlers, Level 3 for supervisors',
          category: 'Food Safety',
          businessTypes: ['takeaway', 'cafe', 'restaurant', 'bubble_tea'],
          required: true,
          hasExpiry: true,
          renewalPeriod: 1095, // 3 years
          priority: 1,
          templateAvailable: false,
          createdAt: new Date()
        },
        {
          key: 'food_business_registration',
          title: 'Food Business Registration',
          description: 'Registration with local council as a food business operator',
          category: 'Licenses',
          businessTypes: ['takeaway', 'cafe', 'restaurant', 'bubble_tea'],
          required: true,
          hasExpiry: false,
          priority: 1,
          templateAvailable: true,
          createdAt: new Date()
        },
        {
          key: 'allergen_info',
          title: 'Allergen Information',
          description: 'Documentation of 14 major allergens in all menu items',
          category: 'Food Safety',
          businessTypes: ['takeaway', 'cafe', 'restaurant', 'bubble_tea'],
          required: true,
          hasExpiry: false,
          priority: 2,
          templateAvailable: true,
          createdAt: new Date()
        },
        {
          key: 'haccp',
          title: 'HACCP / Food Safety Management System',
          description: 'Safer Food Better Business pack or equivalent HACCP system',
          category: 'Food Safety',
          businessTypes: ['takeaway', 'cafe', 'restaurant'],
          required: true,
          hasExpiry: false,
          priority: 1,
          templateAvailable: true,
          createdAt: new Date()
        },

        // Alcohol licenses
        {
          key: 'premises_license',
          title: 'Premises License (Alcohol)',
          description: 'Required if selling alcohol for consumption on or off premises',
          category: 'Licenses',
          businessTypes: ['restaurant', 'cafe', 'offlicense'],
          required: false,
          hasExpiry: false,
          priority: 2,
          templateAvailable: false,
          createdAt: new Date()
        },
        {
          key: 'personal_license',
          title: 'Personal License (Designated Premises Supervisor)',
          description: 'At least one person must hold a personal license to sell alcohol',
          category: 'Licenses',
          businessTypes: ['restaurant', 'cafe', 'offlicense'],
          required: false,
          hasExpiry: true,
          renewalPeriod: 3650, // 10 years
          priority: 2,
          templateAvailable: false,
          createdAt: new Date()
        },

        // Health & Safety
        {
          key: 'risk_assessment',
          title: 'Risk Assessment',
          description: 'Written risk assessment covering all workplace hazards',
          category: 'Health & Safety',
          businessTypes: ['all'],
          required: true,
          hasExpiry: false,
          priority: 2,
          templateAvailable: true,
          createdAt: new Date()
        },
        {
          key: 'fire_safety',
          title: 'Fire Risk Assessment',
          description: 'Fire safety risk assessment and evacuation plan',
          category: 'Health & Safety',
          businessTypes: ['all'],
          required: true,
          hasExpiry: false,
          priority: 1,
          templateAvailable: true,
          createdAt: new Date()
        },
        {
          key: 'first_aid',
          title: 'First Aid Certificate',
          description: 'At least one trained first aider on premises',
          category: 'Health & Safety',
          businessTypes: ['all'],
          required: true,
          hasExpiry: true,
          renewalPeriod: 1095, // 3 years
          priority: 2,
          templateAvailable: false,
          createdAt: new Date()
        },

        // Employment
        {
          key: 'right_to_work',
          title: 'Right to Work Checks',
          description: 'Documentation proving all employees have right to work in UK',
          category: 'Employment',
          businessTypes: ['all'],
          required: true,
          hasExpiry: false,
          priority: 1,
          templateAvailable: true,
          createdAt: new Date()
        },
        {
          key: 'employment_contracts',
          title: 'Employment Contracts',
          description: 'Written contracts for all employees',
          category: 'Employment',
          businessTypes: ['all'],
          required: true,
          hasExpiry: false,
          priority: 2,
          templateAvailable: true,
          createdAt: new Date()
        },
      ];

      await db.collection('compliance_requirements').insertMany(requirements);
    }

    // Seed some sample documents for the business
    const now = new Date();
    const sampleDocs = [
      {
        businessId,
        requirementKey: 'business_insurance',
        requirementTitle: 'Business Insurance',
        filename: 'business_insurance_2024.pdf',
        fileUrl: '/documents/sample_insurance.pdf',
        fileType: 'application/pdf',
        fileSize: 245000,
        status: 'valid',
        expiryDate: new Date(now.getTime() + 180 * 24 * 60 * 60 * 1000), // 180 days
        uploadedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        uploadedBy: 'Manager',
        notes: 'Policy covers £5m public liability and £5m employer liability',
        verified: true,
        verifiedAt: new Date(now.getTime() - 9 * 24 * 60 * 60 * 1000),
        verifiedBy: 'Compliance Officer'
      },
      {
        businessId,
        requirementKey: 'food_hygiene_cert',
        requirementTitle: 'Food Hygiene Certificates',
        filename: 'manager_food_hygiene_level3.pdf',
        fileUrl: '/documents/sample_hygiene.pdf',
        fileType: 'application/pdf',
        fileSize: 156000,
        status: 'valid',
        expiryDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // 25 days - expiring soon!
        uploadedAt: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        uploadedBy: 'Manager',
        notes: 'Level 3 certificate for manager',
        verified: true,
        verifiedAt: new Date(now.getTime() - 59 * 24 * 60 * 60 * 1000),
        verifiedBy: 'Compliance Officer'
      }
    ];

    await db.collection('compliance_documents').insertMany(sampleDocs);

    return NextResponse.json({ 
      message: 'Compliance data seeded successfully',
      requirements: 13,
      sampleDocuments: 2
    });
  } catch (error) {
    console.error('Error seeding compliance data:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
