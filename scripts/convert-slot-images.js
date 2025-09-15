import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const slotsDir = 'src/games/Slots/assets';

async function convertSlotImages() {
  try {
    const files = fs.readdirSync(slotsDir);
    const pngFiles = files.filter(file => file.endsWith('.png'));

    console.log('🎰 Converting slot symbols to WebP...');

    for (const file of pngFiles) {
      const inputPath = path.join(slotsDir, file);
      const outputPath = path.join(slotsDir, file.replace('.png', '.webp'));

      try {
        const info = await sharp(inputPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);

        const originalSize = fs.statSync(inputPath).size;
        const reduction = ((originalSize - info.size) / originalSize * 100).toFixed(1);

        console.log('✅', file, '→', file.replace('.png', '.webp'));
        console.log('   📦 Size:', (originalSize/1024).toFixed(1), 'KB →', (info.size/1024).toFixed(1), 'KB');
        console.log('   💾 Saved:', reduction + '%');
      } catch (err) {
        console.error('❌ Error converting', file, ':', err.message);
      }
    }

    console.log('🎉 All slot symbols converted!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

convertSlotImages();
