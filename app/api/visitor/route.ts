import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// API endpoint to track and retrieve visitor count
export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('personalWebsite');
    const collection = db.collection('visitors');
    
    // Increment the visitor count and return the new count
    const result = await collection.findOneAndUpdate(
      { _id: 'visitorCounter' },
      { 
        $inc: { count: 1 },
        $set: { lastVisit: new Date() }
      },
      { 
        upsert: true,
        returnDocument: 'after'
      }
    );
    
    const visitorNumber = result?.count || 1;
    
    return NextResponse.json(
      { 
        success: true, 
        visitorNumber,
        totalVisitors: visitorNumber
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json(
      { error: 'Failed to track visitor' },
      { status: 500 }
    );
  }
}

// Get current visitor count without incrementing
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('personalWebsite');
    const collection = db.collection('visitors');
    
    const counter = await collection.findOne({ _id: 'visitorCounter' });
    const totalVisitors = counter?.count || 0;
    
    return NextResponse.json(
      { 
        success: true, 
        totalVisitors
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return NextResponse.json(
      { error: 'Failed to get visitor count' },
      { status: 500 }
    );
  }
}

