# LinkedIn Profile Picture Integration

This project automatically displays your current LinkedIn profile picture on your personal website. The system is designed to update automatically when you change your LinkedIn profile picture.

## How It Works

1. **Configuration**: Your LinkedIn profile picture URL is stored in `lib/linkedin-config.ts`
2. **Automatic Updates**: The system checks for updates every 24 hours via a Vercel cron job
3. **Fallback**: If the LinkedIn URL is not accessible, it falls back to your local profile picture
4. **Caching**: Profile pictures are cached for 24 hours to improve performance

## How to Update Your LinkedIn Profile Picture

### Step 1: Update Your LinkedIn Profile
1. Go to your LinkedIn profile: https://www.linkedin.com/in/leozhang99
2. Click on your profile picture to edit it
3. Upload your new picture
4. Save the changes

### Step 2: Get the New Profile Picture URL
1. Right-click on your new profile picture on LinkedIn
2. Select "Copy image address" or "Copy image URL"
3. The URL will look something like: `https://media.licdn.com/dms/image/C4E03AQF8QZQZQZQZQZQ/profile-displayphoto-shrink_400_400/0/1234567890?e=1234567890&v=beta&t=1234567890`

### Step 3: Update the Configuration
1. Open `lib/linkedin-config.ts`
2. Update the `profilePictureUrl` field with your new URL
3. Save the file

### Step 4: Deploy Your Changes
1. Commit your changes to git
2. Push to your main branch
3. The website will automatically use the new picture on the next page load

## Configuration Options

In `lib/linkedin-config.ts`, you can customize:

- `profilePictureUrl`: Your current LinkedIn profile picture URL
- `fallbackImageUrl`: The image to show if LinkedIn URL is not accessible
- `updateInterval`: How often to check for updates (default: 24 hours)
- `showUpdateInfo`: Whether to show "Last updated" information
- `showErrorInfo`: Whether to show error messages

## API Endpoints

- `/api/linkedin-profile`: Returns your current LinkedIn profile picture data
- `/api/update-profile`: Manually triggers a profile picture update (used by cron job)

## Troubleshooting

### Profile Picture Not Updating
1. Check that the URL in `linkedin-config.ts` is correct
2. Verify the URL is accessible by opening it in a browser
3. Check the browser console for any error messages

### Fallback Image Showing
- This means the LinkedIn URL is not accessible
- Check your LinkedIn profile privacy settings
- Ensure the URL is correct and hasn't expired

### Manual Refresh
- You can manually trigger an update by calling `/api/update-profile`
- Or clear the cache by restarting your development server

## Technical Details

- **Caching**: Profile pictures are cached for 24 hours to reduce API calls
- **Error Handling**: Graceful fallback to local image if LinkedIn URL fails
- **Performance**: Uses Next.js Image component for optimized loading
- **Security**: No sensitive data is stored or transmitted

## Future Improvements

- Integration with LinkedIn's official API (requires LinkedIn Developer account)
- Automatic URL detection using web scraping
- Multiple fallback sources
- Image optimization and resizing
