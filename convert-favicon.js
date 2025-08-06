const sharp = require('sharp');
const fs = require('fs');

// Read the SVG file
const svgBuffer = fs.readFileSync('public/favicon.svg');

// Convert SVG to PNG with different sizes
async function convertFavicon() {
  try {
    // Convert to 32x32 PNG
    await sharp(svgBuffer)
      .resize(32, 32)
      .png()
      .toFile('public/favicon.png');
    
    console.log('Favicon converted successfully!');
  } catch (error) {
    console.error('Error converting favicon:', error);
  }
}

convertFavicon(); 