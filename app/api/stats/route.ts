import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// API endpoint to get site statistics
export async function GET() {
  try {
    // Get song recommendation count from MongoDB
    const client = await clientPromise;
    const db = client.db('personalWebsite');
    const songsCollection = db.collection('songRecommendations');
    const totalSongs = await songsCollection.countDocuments();
    
    return NextResponse.json(
      { 
        success: true,
        totalSongRecommendations: totalSongs
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: 'Failed to get stats', totalSongRecommendations: 0 },
      { status: 200 }
    );
  }
}

