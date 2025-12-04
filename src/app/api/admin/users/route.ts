import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role');

    const query: Record<string, string> = {};
    if (status) query.status = status;
    if (role) query.role = role;

    const users = await db.collection('users')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    const sanitizedUsers = users.map(user => ({
      ...user,
      password: undefined
    }));

    return NextResponse.json(sanitizedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();

    const existingUser = await db.collection('users').findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = body.password ? await bcrypt.hash(body.password, 12) : await bcrypt.hash('tempPassword123', 12);

    const user = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role || 'employee',
      businessType: body.businessType,
      status: body.status || 'active',
      verified: body.verified || true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('users').insertOne(user);
    const newUser = await db.collection('users').findOne({ _id: result.insertedId });

    await db.collection('audit_logs').insertOne({
      action: 'create_user',
      targetType: 'user',
      targetId: result.insertedId.toString(),
      details: `User created: ${user.email}`,
      performedBy: 'Admin',
      createdAt: new Date()
    });

    return NextResponse.json({ ...newUser, password: undefined });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();
    const { _id, action, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    updateData.updatedAt = new Date();

    if (action === 'verify') {
      updateData.verified = true;
      updateData.status = 'active';
      updateData.verifiedAt = new Date();
    } else if (action === 'suspend') {
      updateData.status = 'suspended';
      updateData.suspendedAt = new Date();
    } else if (action === 'activate') {
      updateData.status = 'active';
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    const updatedUser = await db.collection('users').findOne({ _id: new ObjectId(_id) });

    if (updatedUser) {
      await db.collection('audit_logs').insertOne({
        action: action || 'update_user',
        targetType: 'user',
        targetId: _id,
        details: `User ${action || 'updated'}: ${updatedUser.email}`,
        performedBy: 'Admin',
        createdAt: new Date()
      });

      return NextResponse.json({ ...updatedUser, password: undefined });
    }

    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    
    await db.collection('users').deleteOne({ _id: new ObjectId(id) });

    await db.collection('audit_logs').insertOne({
      action: 'delete_user',
      targetType: 'user',
      targetId: id,
      details: `User deleted: ${user?.email}`,
      performedBy: 'Admin',
      createdAt: new Date()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
