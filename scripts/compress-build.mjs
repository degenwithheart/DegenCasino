import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { gzip, brotliCompress, constants } from 'zlib';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const gzipAsync = promisify(gzip);
const brotliAsync = promisify(brotliCompress);

class BuildCompressor {
  constructor(distDir = 'dist') {
    this.distDir = path.resolve(process.cwd(), distDir);
    console.log('🗜️  Starting build compression...');
    console.log('📁 Target directory:', this.distDir);
  }

  async getFilesToCompress() {
    const files = [];

    const walk = (dir) => {
      const items = fs.readdirSync(dir);

      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          walk(fullPath);
        } else if (this.shouldCompress(fullPath, stat.size)) {
          files.push(fullPath);
        }
      }
    };

    walk(this.distDir);
    return files;
  }

  shouldCompress(filePath, size) {
    // Only compress files larger than 1KB
    if (size < 1024) return false;

    const ext = path.extname(filePath).toLowerCase();
    const compressibleExtensions = [
      '.js', '.css', '.html', '.json', '.svg', '.txt', '.xml',
      '.woff', '.woff2', '.ttf', '.eot'
    ];

    return compressibleExtensions.includes(ext);
  }

  async compressFile(filePath) {
    try {
      const content = fs.readFileSync(filePath);
      const originalSize = content.length;

      // Generate gzip
      const gzipContent = await gzipAsync(content, { level: 9 });
      const gzipPath = `${filePath}.gz`;
      fs.writeFileSync(gzipPath, gzipContent);

      // Generate brotli
      const brotliContent = await brotliAsync(content, {
        params: {
          [constants.BROTLI_PARAM_QUALITY]: 11,
          [constants.BROTLI_PARAM_SIZE_HINT]: originalSize
        }
      });
      const brotliPath = `${filePath}.br`;
      fs.writeFileSync(brotliPath, brotliContent);

      const relativePath = path.relative(this.distDir, filePath);
      const gzipRatio = ((1 - gzipContent.length / originalSize) * 100).toFixed(1);
      const brotliRatio = ((1 - brotliContent.length / originalSize) * 100).toFixed(1);

      console.log(`✅ ${relativePath}`);
      console.log(`   📦 Original: ${this.formatSize(originalSize)}`);
      console.log(`   🗜️  Gzip: ${this.formatSize(gzipContent.length)} (${gzipRatio}% saved)`);
      console.log(`   🔥 Brotli: ${this.formatSize(brotliContent.length)} (${brotliRatio}% saved)`);

      return {
        original: originalSize,
        gzip: gzipContent.length,
        brotli: brotliContent.length
      };
    } catch (error) {
      console.error(`❌ Failed to compress ${filePath}:`, error.message);
      return null;
    }
  }

  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  async run() {
    console.log('🔍 Scanning for compressible files...');
    const files = await this.getFilesToCompress();

    if (files.length === 0) {
      console.log('ℹ️  No files found to compress');
      return;
    }

    console.log(`📝 Found ${files.length} files to compress\n`);

    let totalOriginal = 0;
    let totalGzip = 0;
    let totalBrotli = 0;

    for (const file of files) {
      const result = await this.compressFile(file);
      if (result) {
        totalOriginal += result.original;
        totalGzip += result.gzip;
        totalBrotli += result.brotli;
      }
      console.log(''); // Empty line for readability
    }

    console.log('📊 Compression Summary:');
    console.log(`   📦 Total Original: ${this.formatSize(totalOriginal)}`);
    console.log(`   🗜️  Total Gzip: ${this.formatSize(totalGzip)} (${((1 - totalGzip / totalOriginal) * 100).toFixed(1)}% saved)`);
    console.log(`   🔥 Total Brotli: ${this.formatSize(totalBrotli)} (${((1 - totalBrotli / totalOriginal) * 100).toFixed(1)}% saved)`);
    console.log('\n🎉 Build compression completed!');
  }
}

// Run the compressor
const compressor = new BuildCompressor();
compressor.run().catch(console.error);
