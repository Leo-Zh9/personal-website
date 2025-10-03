const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Configure AWS S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME;

// Files to upload from public folder
const filesToUpload = [
  'about-me-picture.jpg',
  'preppin.png',
  'incendium-academy.png',
  'propeller-hat.png',
  'spotify-wrapped.JPG',
  'Leo_Zhang_Resume_External.pdf'
];

async function uploadFile(fileName) {
  try {
    const filePath = path.join(__dirname, '..', 'public', fileName);
    
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${fileName}`);
      return;
    }

    const fileContent = fs.readFileSync(filePath);
    
    // Determine content type based on file extension
    const getContentType = (filename) => {
      const ext = path.extname(filename).toLowerCase();
      const types = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf'
      };
      return types[ext] || 'application/octet-stream';
    };

    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ContentType: getContentType(fileName),
      ACL: 'public-read', // Make files publicly accessible
    };

    const command = new PutObjectCommand(uploadParams);
    await s3Client.send(command);
    
    console.log(`✅ Uploaded: ${fileName}`);
  } catch (error) {
    console.error(`❌ Error uploading ${fileName}:`, error.message);
  }
}

async function uploadAllFiles() {
  console.log('🚀 Starting S3 upload...');
  console.log(`Bucket: ${BUCKET_NAME}`);
  
  if (!BUCKET_NAME) {
    console.error('❌ S3_BUCKET_NAME environment variable is required');
    process.exit(1);
  }

  for (const fileName of filesToUpload) {
    await uploadFile(fileName);
  }
  
  console.log('✨ Upload complete!');
}

uploadAllFiles().catch(console.error);
