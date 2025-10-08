// LinkedIn Profile Configuration
// Update this file whenever you change your LinkedIn profile picture

export const LINKEDIN_CONFIG = {
  // Your LinkedIn profile URL
  profileUrl: 'https://www.linkedin.com/in/leozhang99',
  
  // Your current LinkedIn profile picture URL
  // To get this URL:
  // 1. Go to your LinkedIn profile
  // 2. Right-click on your profile picture
  // 3. Select "Copy image address" or "Copy image URL"
  // 4. Paste that URL here
  profilePictureUrl: 'https://media.licdn.com/dms/image/v2/D4E03AQH9ULonRQ3BaQ/profile-displayphoto-crop_800_800/B4EZks.kuEKQAI-/0/1757396225470?e=1762992000&v=beta&t=E4xl-wHiR4zxWfk7_vHtr86JF--jEb2sfClYzdKRdl0',
  
  // Fallback image (your current S3 image)
  fallbackImageUrl: '/about-me-picture.jpg',
  
  // How often to check for updates (in milliseconds)
  // 24 hours = 24 * 60 * 60 * 1000
  updateInterval: 24 * 60 * 60 * 1000,
  
  // Whether to show update information
  showUpdateInfo: true,
  
  // Whether to show error information
  showErrorInfo: true
};

// Instructions for updating your profile picture:
/*
1. Go to your LinkedIn profile: https://www.linkedin.com/in/leozhang99
2. Click on your profile picture to edit it
3. Upload your new picture
4. Save the changes
5. Right-click on your new profile picture
6. Select "Copy image address" or "Copy image URL"
7. Update the profilePictureUrl above with the new URL
8. Deploy your changes

The website will automatically use the new picture on the next page load.
*/
