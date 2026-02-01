import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Idea, User } from '@/models';
import { authenticateRequest } from '@/lib/auth';
import { ideaSchema } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const load = searchParams.get('load');
    
    const idea = await Idea.findById(id);
    
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    let result: any = idea.toObject();
    
    if (load === 'author') {
      const author = await User.findById(idea._ownerId).select('email');
      result.author = author ? { email: author.email, _id: author._id } : null;
    }
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Get idea error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idea' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { id } = await params;
    const idea = await Idea.findById(id);
    
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    if (idea._ownerId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    const validation = ideaSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    Object.assign(idea, validation.data);
    await idea.save();
    
    return NextResponse.json(idea);
    
  } catch (error: any) {
    console.error('Update idea error:', error);
    return NextResponse.json(
      { error: 'Failed to update idea' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = authenticateRequest(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    await connectDB();
    
    const { id } = await params;
    const idea = await Idea.findById(id);
    
    if (!idea) {
      return NextResponse.json(
        { error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    if (idea._ownerId.toString() !== user.userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }
    
    await Idea.findByIdAndDelete(id);
    
    return NextResponse.json({ message: 'Idea deleted successfully' });
    
  } catch (error: any) {
    console.error('Delete idea error:', error);
    return NextResponse.json(
      { error: 'Failed to delete idea' },
      { status: 500 }
    );
  }
}
