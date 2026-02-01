import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Profile } from '@/models';
import { authenticateRequest } from '@/lib/auth';
import { profileSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const _ownerId = searchParams.get('_ownerId');
    
    if (!_ownerId) {
      return NextResponse.json(
        { error: '_ownerId is required' },
        { status: 400 }
      );
    }
    
    const profile = await Profile.findOne({ _ownerId });
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
    
  } catch (error: any) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const existingProfile = await Profile.findOne({ _ownerId: user.userId });
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Profile already exists' },
        { status: 409 }
      );
    }
    
    const body = await request.json();
    
    const validation = profileSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const profile = await Profile.create({
      ...validation.data,
      email: user.email,
      _ownerId: user.userId,
    });
    
    return NextResponse.json(profile, { status: 201 });
    
  } catch (error: any) {
    console.error('Create profile error:', error);
    return NextResponse.json(
      { error: 'Failed to create profile' },
      { status: 500 }
    );
  }
}
