// Simple script to generate placeholder PWA icons
// In production, replace with actual branded icons

const fs = require('fs');
const path = require('path');

// Create SVG content
const createSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#0ea5e9"/>
  <text 
    x="50%" 
    y="50%" 
    dominant-baseline="middle" 
    text-anchor="middle" 
    font-family="Arial, sans-serif" 
    font-size="${size * 0.4}" 
    font-weight="bold" 
    fill="white"
  >TS</text>
</svg>`;

// Generate icons
const sizes = [192, 512];
const publicDir = path.join(__dirname, '..', 'public');

sizes.forEach((size) => {
  const svg = createSVG(size);
  const filename = `icon-${size}.svg`;
  fs.writeFileSync(path.join(publicDir, filename), svg);
  console.log(`Generated ${filename}`);
});

// Create a simple PNG notice file
const pngNotice = `
PWA Icon Generation
===================

For production, replace the SVG placeholder icons with proper PNG icons:

1. Create high-quality PNG icons at 192x192 and 512x512 pixels
2. Use a tool like https://realfavicongenerator.net/ to generate all sizes
3. Replace the icon-192.svg and icon-512.svg files with .png versions
4. Update manifest.webmanifest if needed

Current icons are SVG placeholders with "TS" text.
`;

fs.writeFileSync(path.join(publicDir, 'ICONS-README.txt'), pngNotice);
console.log('Icon generation complete!');
