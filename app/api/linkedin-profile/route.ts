import { NextRequest, NextResponse } from 'next/server';
import { LinkedInProfileService } from '../../../lib/linkedin-profile-service';
import { LINKEDIN_CONFIG } from '../../../lib/linkedin-config';

export async function GET(request: NextRequest) {
  try {
    const profileData = await LinkedInProfileService.getProfilePicture();
    
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Error in LinkedIn profile API:', error);
    
    // Return fallback image on error
    return NextResponse.json({ 
      profileImageUrl: LINKEDIN_CONFIG.fallbackImageUrl,
      lastUpdated: new Date().toISOString(),
      error: 'Failed to fetch LinkedIn profile',
      fallback: true
    }, { status: 200 }); // Return 200 to prevent breaking the UI
  }
}
