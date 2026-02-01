import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Like } from '@/models';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get('ideaId');
    
    if (!ideaId) {
      return NextResponse.json(
        { error: 'ideaId is required' },
        { status: 400 }
      );
    }
    
    const likes = await Like.find({ ideaId });
    
    return NextResponse.json(likes);
    
  } catch (error: any) {
    console.error('Get likes error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
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
    
    const body = await request.json();
    const { ideaId } = body;
    
    if (!ideaId) {
      return NextResponse.json(
        { error: 'ideaId is required' },
        { status: 400 }
      );
    }
    
    const existingLike = await Like.findOne({
      ideaId,
      _ownerId: user.userId,
    });
    
    if (existingLike) {
      return NextResponse.json(
        { error: 'Already liked' },
        { status: 409 }
      );
    }
    
    const like = await Like.create({
      ideaId,
      _ownerId: user.userId,
    });
    
    return NextResponse.json(like, { status: 201 });
    
  } catch (error: any) {
    console.error('Create like error:', error);
    return NextResponse.json(
      { error: 'Failed to create like' },
      { status: 500 }
    );
  }
}
