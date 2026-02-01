import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Comment } from '@/models';
import { authenticateRequest } from '@/lib/auth';
import { commentSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get('ideaId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '4');
    
    if (!ideaId) {
      return NextResponse.json(
        { error: 'ideaId is required' },
        { status: 400 }
      );
    }
    
    const skip = (page - 1) * pageSize;
    
    const comments = await Comment.find({ ideaId })
      .sort({ _createdOn: -1 })
      .skip(skip)
      .limit(pageSize);
    
    const totalCount = await Comment.countDocuments({ ideaId });
    
    return NextResponse.json({
      comments,
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    });
    
  } catch (error: any) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
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
    
    const validation = commentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const comment = await Comment.create({
      ...validation.data,
      email: user.email,
      _ownerId: user.userId,
    });
    
    return NextResponse.json(comment, { status: 201 });
    
  } catch (error: any) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
