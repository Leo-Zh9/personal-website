// LinkedIn Profile Picture Service
// This service fetches the current LinkedIn profile picture for leozhang99

import { LINKEDIN_CONFIG } from './linkedin-config';

interface LinkedInProfileResponse {
  profileImageUrl: string;
  lastUpdated: string;
  fallback?: boolean;
  error?: string;
}

export class LinkedInProfileService {
  private static readonly CACHE_DURATION = LINKEDIN_CONFIG.updateInterval;
  private static cache: { data: LinkedInProfileResponse; timestamp: number } | null = null;

  /**
   * Fetches the LinkedIn profile picture URL
   * Uses caching to avoid excessive requests
   */
  static async getProfilePicture(): Promise<LinkedInProfileResponse> {
    // Check cache first
    if (this.cache && Date.now() - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.data;
    }

    try {
      // Use the configured profile picture URL
      const profileImageUrl = await this.fetchProfilePictureFromLinkedIn();
      
      const response: LinkedInProfileResponse = {
        profileImageUrl,
        lastUpdated: new Date().toISOString()
      };

      // Update cache
      this.cache = {
        data: response,
        timestamp: Date.now()
      };

      return response;
    } catch (error) {
      console.error('Error fetching LinkedIn profile picture:', error);
      
      // Return cached data if available, otherwise fallback
      if (this.cache) {
        return { ...this.cache.data, fallback: true, error: 'Using cached data due to error' };
      }
      
      return {
        profileImageUrl: LINKEDIN_CONFIG.fallbackImageUrl,
        lastUpdated: new Date().toISOString(),
        fallback: true,
        error: 'Failed to fetch LinkedIn profile'
      };
    }
  }

  /**
   * Fetches profile picture using the configured URL
   */
  private static async fetchProfilePictureFromLinkedIn(): Promise<string> {
    try {
      // Test if the configured LinkedIn profile picture URL is accessible
      const testResponse = await fetch(LINKEDIN_CONFIG.profilePictureUrl, { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      if (testResponse.ok) {
        return LINKEDIN_CONFIG.profilePictureUrl;
      } else {
        console.log('LinkedIn profile picture URL not accessible, using fallback');
        return LINKEDIN_CONFIG.fallbackImageUrl;
      }
    } catch (error) {
      console.log('Error testing LinkedIn profile picture URL:', error);
      return LINKEDIN_CONFIG.fallbackImageUrl;
    }
  }

  /**
   * Clears the cache (useful for testing or manual refresh)
   */
  static clearCache(): void {
    this.cache = null;
  }

  /**
   * Gets the current configuration
   */
  static getConfig() {
    return LINKEDIN_CONFIG;
  }
}
