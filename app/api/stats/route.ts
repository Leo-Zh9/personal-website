import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

// API endpoint to get site statistics
export async function GET() {
  try {
    // Get pageviews from Vercel Analytics
    let totalVisitors = 0;
    try {
      const analyticsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/vercel-analytics`);
      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        totalVisitors = analyticsData.totalPageviews || 0;
      }
    } catch (analyticsError) {
      console.error('Failed to fetch Vercel Analytics, using fallback:', analyticsError);
    }
    
    // Get song recommendation count from MongoDB
    const client = await clientPromise;
    const db = client.db('personalWebsite');
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
      { error: 'Failed to get stats', totalVisitors: 0, totalSongRecommendations: 0 },
      { status: 200 }
    );
  }
}

