const fs = require('fs');
const path = require('path');

const mapping = require('../cloudinary_mapping.json');
const srcDir = path.join(__dirname, '../../courier-medicine/src');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      walkDir(dirPath, callback);
    } else {
      callback(dirPath);
    }
  });
}

console.log('🔄 Starting replacement of local image URLs with Cloudinary URLs in frontend files...');

let modifiedFilesCount = 0;

walkDir(srcDir, filePath => {
  const ext = path.extname(filePath).toLowerCase();
  if (['.jsx', '.js', '.css', '.html'].includes(ext)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    Object.keys(mapping).forEach(imageName => {
      // Replace absolute public paths like "/imageName" with the Cloudinary URL
      const withSlash = `/${imageName}`;
      if (content.includes(withSlash)) {
        content = content.split(withSlash).join(mapping[imageName]);
        console.log(`   Replacing ${withSlash} in ${path.basename(filePath)}`);
      }
    });

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${path.relative(srcDir, filePath)}`);
      modifiedFilesCount++;
    }
  }
});

console.log(`\n🎉 Completed! Replaced image URLs in ${modifiedFilesCount} files.`);
