require('dotenv').config();
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// Check env credentials
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('❌ Error: Cloudinary credentials are not set in the backend .env file.');
  console.log('Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file first.');
  process.exit(1);
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Relative path to frontend public folder
const publicDir = path.join(__dirname, '../../courier-medicine/public');
const mappingFile = path.join(__dirname, '../cloudinary_mapping.json');

async function migrate() {
  try {
    if (!fs.existsSync(publicDir)) {
      console.error(`❌ Public directory not found at: ${publicDir}`);
      return;
    }

    const files = fs.readdirSync(publicDir);
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
    const imageFiles = files.filter(file => imageExtensions.includes(path.extname(file).toLowerCase()));

    console.log(`🚀 Found ${imageFiles.length} images in frontend public directory. Starting migration to Cloudinary...`);

    const mapping = {};

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const filePath = path.join(publicDir, file);
      
      console.log(`[${i + 1}/${imageFiles.length}] Uploading ${file}...`);
      
      try {
        const result = await cloudinary.uploader.upload(filePath, {
          folder: 'courier-medicine-static',
          use_filename: true,
          unique_filename: false
        });

        mapping[file] = result.secure_url;
        console.log(`✅ Success: ${file} -> ${result.secure_url}`);
      } catch (err) {
        console.error(`❌ Failed uploading ${file}:`, err.message);
      }
    }

    fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
    console.log(`\n🎉 Migration complete! Mapping file saved to: ${mappingFile}`);
    console.log('You can now replace the local image paths in your frontend components with these Cloudinary URLs.');

  } catch (error) {
    console.error('❌ Migration script failed:', error);
  }
}

migrate();
