//src/app/api/test-submission/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Submission from '@/lib/models/Submission';
import { randomUUID } from 'crypto';

export async function POST(request: Request) {
  try {
    await dbConnect();
    
    const { inputText } = await request.json();
    
    const submission = await Submission.create({
      inputText,
      correlationId: randomUUID(),
      source: 'web',
      status: 'pending'
    });
    
    return NextResponse.json({ 
      success: true, 
      submission 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    
    const submissions = await Submission.find().sort({ createdAt: -1 }).limit(10);
    
    return NextResponse.json({ 
      success: true, 
      count: submissions.length,
      submissions 
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}