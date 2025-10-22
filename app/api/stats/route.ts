import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// API endpoint to get site statistics
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('personalWebsite');
    
    // Get visitor count
    const visitorsCollection = db.collection<{ _id: string; count: number }>('visitors');
    const visitorCounter = await visitorsCollection.findOne({ _id: 'visitorCounter' });
    const totalVisitors = visitorCounter?.count || 0;
    
    // Get song recommendation count
    const songsCollection = db.collection('songRecommendations');
    const totalSongs = await songsCollection.countDocuments();
    
    return NextResponse.json(
      { 
        success: true, 
        totalVisitors,
        totalSongRecommendations: totalSongs
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error getting stats:', error);
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    );
  }
}

