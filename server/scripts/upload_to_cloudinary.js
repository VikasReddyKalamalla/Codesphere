require('dotenv').config({ path: __dirname + '/../.env' });
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const uploadAllToCloudinary = async () => {
  const SOURCE_DIR = path.join(__dirname, '../../notes(resources)');
  
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error('Source directory not found.');
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith('.pdf'));
  console.log(`Found ${files.length} PDFs to upload.`);

  for (const file of files) {
    const srcPath = path.join(SOURCE_DIR, file);
    try {
      console.log(`Uploading ${file}...`);
      const result = await cloudinary.uploader.upload(srcPath, {
        folder: 'codesphere/resource',
        resource_type: 'auto',
      });
      console.log(`Success! URL: ${result.secure_url}`);
    } catch (err) {
      console.error(`Failed to upload ${file}:`, err);
    }
  }
  
  console.log('Finished uploading all resources.');
  process.exit(0);
};

uploadAllToCloudinary();
