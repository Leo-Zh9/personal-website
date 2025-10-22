import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// API endpoint to save song recommendations to MongoDB
export async function POST(request: Request) {
  try {
    const { song } = await request.json();
    
    if (!song || typeof song !== 'string' || song.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid song recommendation' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('personalWebsite');
    const collection = db.collection('songRecommendations');
    
    // Create document to insert
    const recommendation = {
      song: song.trim(),
      timestamp: new Date(),
      createdAt: new Date().toISOString(),
    };
    
    // Insert the recommendation
    await collection.insertOne(recommendation);
    
    return NextResponse.json(
      { success: true, message: 'Song recommendation saved!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving song recommendation:', error);
    return NextResponse.json(
      { error: 'Failed to save recommendation' },
      { status: 500 }
    );
  }
}

