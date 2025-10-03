import { S3Client } from '@aws-sdk/client-s3';

// AWS S3 Configuration
export const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || '';
export const S3_BUCKET_URL = `https://${S3_BUCKET_NAME}.s3.amazonaws.com`;

// Image URLs for your portfolio
export const IMAGE_URLS = {
  aboutMe: `${S3_BUCKET_URL}/about-me-picture.jpg`,
  preppin: `${S3_BUCKET_URL}/preppin.png`,
  incendiumAcademy: `${S3_BUCKET_URL}/incendium-academy.png`,
  propellerHat: `${S3_BUCKET_URL}/propeller-hat.png`,
  spotifyWrapped: `${S3_BUCKET_URL}/spotify-wrapped.JPG`,
  resume: `${S3_BUCKET_URL}/Leo_Zhang_Resume_External.pdf`,
};
