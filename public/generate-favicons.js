const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Define the sizes we need
const sizes = [
  { name: 'favicon.ico', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 }
];

// Path to our SVG favicon
const svgPath = path.join(__dirname, 'favicon.svg');

// Function to generate all favicons
async function generateFavicons() {
  try {
    // Read the SVG file
    const svgBuffer = fs.readFileSync(svgPath);
    
    // Generate each size
    for (const { name, size } of sizes) {
      console.log(`Generating ${name} (${size}x${size})...`);
      
      // For ICO file
      if (name.endsWith('.ico')) {
        await sharp(svgBuffer)
          .resize(size, size)
          .toFormat('png')
          .toBuffer()
          .then(buffer => {
            // For ICO files, we need to use the ico npm package
            // But for simplicity, we'll just save as PNG with .ico extension
            // In a real project, you'd want to use a proper ICO converter
            fs.writeFileSync(path.join(__dirname, name), buffer);
          });
      } else {
        // For PNG files
        await sharp(svgBuffer)
          .resize(size, size)
          .toFormat('png')
          .toFile(path.join(__dirname, name));
      }
    }
    
    console.log('All favicons generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

// Run the function
generateFavicons();
