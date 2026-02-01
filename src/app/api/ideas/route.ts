import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { Idea, User } from '@/models';
import { authenticateRequest } from '@/lib/auth';
import { ideaSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const load = searchParams.get('load');
    
    let query: any = {};
    if (category) {
      query.category = category;
    }
    
    let ideas = await Idea.find(query).sort({ _createdOn: -1 });
    
    if (load === 'author') {
      ideas = await Promise.all(
        ideas.map(async (idea) => {
          const author = await User.findById(idea._ownerId).select('email');
          return {
            ...idea.toObject(),
            author: author ? { email: author.email, _id: author._id } : null,
          };
        })
      );
    }
    
    return NextResponse.json(ideas);
    
  } catch (error: any) {
    console.error('Get ideas error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ideas' },
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
    
    const validation = ideaSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const idea = await Idea.create({
      ...validation.data,
      _ownerId: user.userId,
    });
    
    return NextResponse.json(idea, { status: 201 });
    
  } catch (error: any) {
    console.error('Create idea error:', error);
    return NextResponse.json(
      { error: 'Failed to create idea' },
      { status: 500 }
    );
  }
}
