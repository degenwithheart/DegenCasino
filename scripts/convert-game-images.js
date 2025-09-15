import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const gamesDir = 'public/png/games';
const webpDir = 'public/webp/games';

console.log('🎮 Converting game images to WebP...');

async function convertImages() {
  try {
    const files = fs.readdirSync(gamesDir);
    const pngFiles = files.filter(file => file.endsWith('.png'));
    
    for (const file of pngFiles) {
      const inputPath = path.join(gamesDir, file);
      const outputPath = path.join(webpDir, file.replace('.png', '.webp'));
      
      try {
        const info = await sharp(inputPath)
          .webp({ quality: 85, effort: 6 })
          .toFile(outputPath);
          
        const originalSize = fs.statSync(inputPath).size;
        const reduction = ((originalSize - info.size) / originalSize * 100).toFixed(1);
        
        console.log('✅', file, '→', file.replace('.png', '.webp'));
        console.log('   📦 Size:', (originalSize/1024/1024).toFixed(2), 'MB →', (info.size/1024).toFixed(1), 'KB');
        console.log('   💾 Saved:', reduction + '%');
      } catch (err) {
        console.error('❌ Error converting', file, ':', err.message);
      }
    }
    
    console.log('🎉 All game images converted!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

convertImages();
