import { NextRequest, NextResponse } from 'next/server';
import { LinkedInProfileService } from '../../../lib/linkedin-profile-service';

// This endpoint can be called by Vercel Cron Jobs to update the profile picture
export async function POST(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron (optional security check)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Clear the cache to force a fresh fetch
    LinkedInProfileService.clearCache();
    
    // Fetch the latest profile picture
    const profileData = await LinkedInProfileService.getProfilePicture();
    
    return NextResponse.json({
      success: true,
      profileData,
      message: 'Profile picture updated successfully'
    });
    
  } catch (error) {
    console.error('Error in profile update cron job:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to update profile picture'
    }, { status: 500 });
  }
}

// Also support GET for manual testing
export async function GET(request: NextRequest) {
  return POST(request);
}
