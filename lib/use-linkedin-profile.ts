import { useState, useEffect } from 'react';

interface LinkedInProfileData {
  profileImageUrl: string;
  lastUpdated: string;
  fallback?: boolean;
  error?: string;
}

export function useLinkedInProfile() {
  const [profileData, setProfileData] = useState<LinkedInProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfilePicture = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/linkedin-profile');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data: LinkedInProfileData = await response.json();
      setProfileData(data);
      
      if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error fetching LinkedIn profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
      
      // Set fallback data
      setProfileData({
        profileImageUrl: '/about-me-picture.jpg',
        lastUpdated: new Date().toISOString(),
        fallback: true,
        error: 'Failed to fetch LinkedIn profile'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfilePicture();
    
    // Set up automatic refresh every 24 hours
    const interval = setInterval(fetchProfilePicture, 24 * 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    profileData,
    loading,
    error,
    refetch: fetchProfilePicture
  };
}
