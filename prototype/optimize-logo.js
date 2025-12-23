const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'public/assets/logos/srs-logo-1024px-backup.png');
const outputPath = path.join(__dirname, 'public/assets/logos/srs-logo.png');

async function optimizeLogo() {
  try {
    console.log('Starting logo optimization...');
    console.log('Input:', inputPath);

    // Get original file size
    const originalStats = fs.statSync(inputPath);
    console.log(`Original size: ${(originalStats.size / 1024 / 1024).toFixed(2)}MB at 1024x1024px`);

    // Resize to 512x512 with high-quality settings and aggressive optimization
    const buffer = await sharp(inputPath)
      .resize(512, 512, {
        kernel: 'lanczos3', // Highest quality resampling
        fit: 'inside'
      })
      .png({
        quality: 85, // Balance between quality and file size
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: true, // Use indexed palette for better compression
        colors: 128, // Reduce color palette slightly
        effort: 10 // Maximum effort for compression
      })
      .toBuffer();

    // Write the optimized buffer
    fs.writeFileSync(outputPath, buffer);

    // Get new file size
    const newStats = fs.statSync(outputPath);
    const newSizeKB = (newStats.size / 1024).toFixed(2);
    const compressionRatio = ((1 - newStats.size / originalStats.size) * 100).toFixed(1);

    console.log(`\nOptimization complete!`);
    console.log(`New size: ${newSizeKB}KB at 512x512px`);
    console.log(`Compression: ${compressionRatio}% reduction from original`);
    console.log(`Target met: ${newStats.size < 100 * 1024 ? 'YES ✓' : 'NO ✗'} (under 100KB)`);

    // Get image metadata
    const metadata = await sharp(outputPath).metadata();
    console.log(`\nImage details:`);
    console.log(`- Dimensions: ${metadata.width}x${metadata.height}px`);
    console.log(`- Format: ${metadata.format}`);
    console.log(`- Channels: ${metadata.channels}`);
    console.log(`- Has alpha: ${metadata.hasAlpha}`);

  } catch (error) {
    console.error('Error optimizing logo:', error);
    process.exit(1);
  }
}

optimizeLogo();
