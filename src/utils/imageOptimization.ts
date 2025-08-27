import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Image optimization utility with WebP conversion
export class ImageOptimizer {
  private inputDir: string;
  private outputDir: string;

  constructor(inputDir: string = 'public', outputDir: string = 'public/webp') {
    this.inputDir = inputDir;
    this.outputDir = outputDir;
  }

  async convertToWebP(imagePath: string, quality: number = 80): Promise<string> {
    const inputPath = path.join(this.inputDir, imagePath);
    const outputPath = path.join(this.outputDir, imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
    
    // Ensure output directory exists
    await fs.promises.mkdir(path.dirname(outputPath), { recursive: true });
    
    try {
      const info = await sharp(inputPath)
        .webp({ quality, effort: 6 })
        .toFile(outputPath);
      
      const originalSize = (await fs.promises.stat(inputPath)).size;
      const newSize = info.size;
      const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${imagePath}: ${this.formatSize(originalSize)} → ${this.formatSize(newSize)} (${savings}% saved)`);
      return outputPath;
    } catch (error) {
      console.error(`❌ Failed to convert ${imagePath}:`, error);
      throw error;
    }
  }

  async optimizeLargeImages(): Promise<void> {
    const largeImages = [
      '$DGHRT.png',
      'casino.png', 
      'pfp.png',
      'user.png',
      'overlay-glow.png',
      'seo.png',
      'icon-512.png',
      'icon-192.png'
    ];

    console.log('🚀 Starting WebP conversion for large images...');
    
    for (const image of largeImages) {
      const imagePath = path.join(this.inputDir, image);
      if (fs.existsSync(imagePath)) {
        await this.convertToWebP(image);
      } else {
        console.warn(`⚠️ Image not found: ${image}`);
      }
    }
    
    console.log('✨ WebP conversion completed!');
  }

  private formatSize(bytes: number): string {
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  }

  // Generate fallback img tags with WebP support
  static generateResponsiveImg(src: string, alt: string, className?: string): string {
    const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    return `
      <picture${className ? ` class="${className}"` : ''}>
        <source srcset="/webp/${webpSrc}" type="image/webp">
        <img src="${src}" alt="${alt}" loading="lazy" decoding="async">
      </picture>
    `;
  }
}

// Vite plugin for automatic WebP generation
export function createWebPPlugin() {
  return {
    name: 'webp-generator',
    buildStart() {
      console.log('🔄 Generating WebP images...');
    },
    async generateBundle() {
      const optimizer = new ImageOptimizer();
      try {
        await optimizer.optimizeLargeImages();
      } catch (error) {
        console.warn('⚠️ WebP generation failed:', error);
      }
    }
  };
}
