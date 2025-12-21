const sharp = require('sharp');
const path = require('path');

async function generateOGImage() {
  const width = 1200;
  const height = 630;
  const navy = '#1a2332';

  // Logo dimensions and positioning
  const logoSize = 200; // Reduced from potentially larger
  const logoY = 80; // Position in upper third, more space from top

  // Text positioning with better vertical rhythm
  const titleY = logoY + logoSize + 60; // 60px gap after logo
  const taglineY = titleY + 85; // 85px gap after title
  const subtitleY = taglineY + 55; // 55px gap after tagline

  try {
    // Load and resize logo
    const logo = await sharp(
      path.join(__dirname, '../public/assets/logos/srs-logo-1024px-backup.png')
    )
      .resize(logoSize, logoSize, { fit: 'contain' })
      .toBuffer();

    // Create SVG with text elements
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#f0d77a;stop-opacity:1" />
          </linearGradient>
        </defs>

        <!-- Title with gold gradient -->
        <text
          x="50%"
          y="${titleY}"
          font-family="Arial, sans-serif"
          font-size="62"
          font-weight="700"
          fill="url(#goldGradient)"
          text-anchor="middle"
          letter-spacing="1">
          Southwest Resume Services
        </text>

        <!-- Tagline -->
        <text
          x="50%"
          y="${taglineY}"
          font-family="Arial, sans-serif"
          font-size="36"
          font-weight="300"
          fill="#ffffff"
          text-anchor="middle"
          letter-spacing="0.5">
          Your Career, Elevated.
        </text>

        <!-- Subtitle -->
        <text
          x="50%"
          y="${subtitleY}"
          font-family="Arial, sans-serif"
          font-size="24"
          font-weight="400"
          fill="#9ca3af"
          text-anchor="middle"
          letter-spacing="0.3">
          Premium Resume Writing | Arizona-Based | Research-Driven Results
        </text>
      </svg>
    `;

    // Create base image with navy background
    const base = await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: navy
      }
    })
      .png()
      .toBuffer();

    // Composite logo and text onto base
    await sharp(base)
      .composite([
        {
          input: logo,
          top: logoY,
          left: Math.round((width - logoSize) / 2) // Center horizontally
        },
        {
          input: Buffer.from(svg),
          top: 0,
          left: 0
        }
      ])
      .jpeg({ quality: 85 })
      .toFile(path.join(__dirname, '../public/og-image.jpg'));

    console.log('✓ OG image generated successfully at public/og-image.jpg');

    // Check file size
    const fs = require('fs');
    const stats = fs.statSync(path.join(__dirname, '../public/og-image.jpg'));
    const fileSizeKB = Math.round(stats.size / 1024);
    console.log(`✓ File size: ${fileSizeKB}KB ${fileSizeKB < 300 ? '(within limit)' : '(exceeds 300KB limit)'}`);

  } catch (error) {
    console.error('Error generating OG image:', error);
    process.exit(1);
  }
}

generateOGImage();
