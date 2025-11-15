import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      password,
      phone,
      postcode,
      radius,
      skills,
      availability,
    } = body;

    // Validation
    if (!name || !email || !password || !phone || !postcode || !radius || !skills || !availability) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (skills.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one skill' },
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
      name,
      role: 'jobseeker',
      createdAt: new Date(),
    });

    // Create job seeker profile
    await db.collection('jobseekers').insertOne({
      userId: userResult.insertedId,
      name,
      phone,
      location: {
        postcode,
        radius: parseInt(radius),
        // TODO: Add geocoding to get lat/lng from postcode
        lat: null,
        lng: null,
      },
      skills,
      availability,
      applications: [],
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: 'Job seeker registered successfully', userId: userResult.insertedId },
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
