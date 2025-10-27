import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      businessType,
      businessName,
      ownerName,
      email,
      password,
      address,
      postcode,
      phone,
    } = body;

    // Validation
    if (!businessType || !businessName || !ownerName || !email || !password || !address || !postcode || !phone) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('aumvia');

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userResult = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      name: ownerName,
      role: 'business',
      businessType,
      createdAt: new Date(),
    });

    // Create business profile
    await db.collection('businesses').insertOne({
      userId: userResult.insertedId,
      businessName,
      businessType,
      address,
      postcode,
      phone,
      complianceScore: 0,
      staff: [],
      settings: {},
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Business registered successfully', userId: userResult.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
