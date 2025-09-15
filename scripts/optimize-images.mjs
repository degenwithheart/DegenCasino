import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImageOptimizer {
  constructor(inputDir = 'public', outputDir = 'public/webp') {
    this.inputDir = path.resolve(process.cwd(), inputDir);
    this.outputDir = path.resolve(process.cwd(), outputDir);
    console.log('📁 Input dir:', this.inputDir);
    console.log('📁 Output dir:', this.outputDir);
  }

  async convertToWebP(imageName, quality = 80) {
    const inputPath = path.join(this.inputDir, imageName);
    const webpName = imageName.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    const outputPath = path.join(this.outputDir, webpName);
    
    // Ensure output directory exists
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
    
    try {
      const info = await sharp(inputPath)
        .webp({ quality, effort: 6 })
        .toFile(outputPath);
      
      const originalSize = (await fs.promises.stat(inputPath)).size;
      const newSize = info.size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${imageName}: ${this.formatSize(originalSize)} → ${this.formatSize(newSize)} (${savings}% saved)`);
      return outputPath;
    } catch (error) {
      console.error(`❌ Failed to convert ${imageName}:`, error.message);
      throw error;
    }
  }

  async optimizeLargeImages() {
    const largeImages = [
      'casino.png', 
      'pfp.png',
      'user.png',
      'overlay-glow.png',
      'seo.png',
      'icon-512.png',
      'icon-192.png',
      'favicon.png',
      'stuff.png',
      'fakemoney.png'
    ];

    console.log('🚀 Starting WebP conversion for large images...');
    
    let totalOriginal = 0;
    let totalWebP = 0;
    
    for (const image of largeImages) {
      const imagePath = path.join(this.inputDir, image);
      if (fs.existsSync(imagePath)) {
        try {
          const originalSize = (await fs.promises.stat(imagePath)).size;
          await this.convertToWebP(image);
          const webpPath = path.join(this.outputDir, image.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
          const webpSize = (await fs.promises.stat(webpPath)).size;
          
          totalOriginal += originalSize;
          totalWebP += webpSize;
        } catch (error) {
          console.warn(`⚠️ Skipping ${image}: ${error.message}`);
        }
      } else {
        console.warn(`⚠️ Image not found: ${image}`);
      }
    }
    
    const totalSavings = ((totalOriginal - totalWebP) / totalOriginal * 100).toFixed(1);
    console.log(`✨ WebP conversion completed!`);
    console.log(`📊 Total savings: ${this.formatSize(totalOriginal)} → ${this.formatSize(totalWebP)} (${totalSavings}% saved)`);
  }

  formatSize(bytes) {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }
}

// Run the optimization
const optimizer = new ImageOptimizer();
optimizer.optimizeLargeImages().catch(console.error);
