import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createGzip, createBrotliCompress, constants } from 'zlib';
import os from 'os';
import { compressWithGzipper, validateCombos } from './gzipper.mjs';

const pipe = promisify(pipeline);

function parseArgs() {
  const args = { dir: 'dist', minSize: 0, concurrency: Math.max(1, os.cpus().length - 1), force: false, brotliQuality: 11, useGzipper: false, dryRun: false, attempts: 4, poolSize: null, combosFile: null };
  for (const raw of process.argv.slice(2)) {
    const arg = raw.replace(/^--/, '');
    if (arg === 'force') { args.force = true; continue; }
    if (arg === 'gzipper') { args.useGzipper = true; continue; }
    if (arg === 'dry-run') { args.dryRun = true; continue; }
    const [k, v] = arg.split('=');
    if (k === 'dir') args.dir = v || 'dist';
    if (k === 'min-size') args.minSize = Number(v) || 0;
    if (k === 'concurrency') args.concurrency = Math.max(1, Number(v) || args.concurrency);
    if (k === 'brotli-quality') args.brotliQuality = Math.min(11, Math.max(0, Number(v) || args.brotliQuality));
    if (k === 'attempts') args.attempts = Math.max(1, Math.min(10, Number(v) || args.attempts));
    if (k === 'pool-size') args.poolSize = Math.max(1, Number(v) || args.poolSize);
    if (k === 'combos-file') args.combosFile = v || null;
  }
  return args;
}

class BuildCompressor {
  constructor(options = {}) {
    this.dir = path.resolve(process.cwd(), options.dir || 'dist');
    this.minSize = Number(options.minSize ?? 0);
    this.concurrency = Number(options.concurrency ?? Math.max(1, os.cpus().length - 1));
    this.force = Boolean(options.force);
    this.brotliQuality = Number(options.brotliQuality ?? 11);
    this.useGzipper = Boolean(options.useGzipper);
    this.dryRun = Boolean(options.dryRun);
    this.attempts = Number(options.attempts ?? 4);
    this.poolSize = options.poolSize ? Number(options.poolSize) : null;
    this.combosFile = options.combosFile || null;

    this.extensions = new Set(['.js', '.css', '.html', '.json', '.svg', '.txt', '.xml', '.woff', '.woff2', '.ttf', '.eot']);
    this.summary = { files: 0, skipped: 0, errors: 0, totalOriginal: 0, totalGzipZlib: 0, totalGzipGzipper: 0, totalBrotli: 0 };

    console.log('🗜️  Build compressor (max-quality mode available)');
    console.log('📁 Target directory:', this.dir);
    console.log(`⚙️  Options: minSize=${this.minSize} concurrency=${this.concurrency} force=${this.force} brotliQuality=${this.brotliQuality} useGzipper=${this.useGzipper}\n`);
  }

  async getFilesToCompress() {
    const results = [];
    const walk = async (dir) => {
      let entries;
      try { entries = await fsPromises.readdir(dir, { withFileTypes: true }); } catch (err) { return; }
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) { await walk(full); }
        else if (ent.isFile()) {
          try {
            const stat = await fsPromises.stat(full);
            if (stat.size < this.minSize) continue;
            if (!this.extensions.has(path.extname(full).toLowerCase())) continue;
            results.push({ path: full, size: stat.size, mtimeMs: stat.mtimeMs });
          } catch (err) { /* ignore */ }
        }
      }
    };
    await walk(this.dir);
    return results;
  }

  async compressAll() {
    const files = await this.getFilesToCompress();
    if (files.length === 0) { console.log('ℹ️  No files found to compress'); return; }
    console.log(`📝 Found ${files.length} files to consider\n`);

    let running = 0;
    const queue = [...files];
    const next = () => { if (queue.length === 0) return null; if (running >= this.concurrency) return null; const f = queue.shift(); running++; return this.compressFile(f).finally(() => { running--; }); };
    const workers = Array.from({ length: this.concurrency }, async () => { while (true) { const job = next(); if (!job) break; await job; } });
    await Promise.all(workers);

    console.log('\n📊 Compression Summary:');
    console.log(`   🔁 Files processed: ${this.summary.files}`);
    console.log(`   ⏭️  Skipped (up-to-date): ${this.summary.skipped}`);
    console.log(`   ⚠️  Errors: ${this.summary.errors}`);
    if (this.summary.totalOriginal > 0) {
      console.log(`   📦 Total Original: ${this.formatSize(this.summary.totalOriginal)}`);
      if (this.summary.totalGzipGzipper > 0) console.log(`   🟦 Gzip (gzipper): ${this.formatSize(this.summary.totalGzipGzipper)} (${((1 - this.summary.totalGzipGzipper / this.summary.totalOriginal) * 100).toFixed(1)}% saved)`);
      if (this.summary.totalGzipZlib > 0) console.log(`   � Gzip (zlib): ${this.formatSize(this.summary.totalGzipZlib)} (${((1 - this.summary.totalGzipZlib / this.summary.totalOriginal) * 100).toFixed(1)}% saved)`);
      if (this.summary.totalBrotli > 0) console.log(`   🔥 Brotli: ${this.formatSize(this.summary.totalBrotli)} (${((1 - this.summary.totalBrotli / this.summary.totalOriginal) * 100).toFixed(1)}% saved)`);
    }
    console.log('\n🎉 Build compression completed!');
  }

  async compressFile(file) {
    const src = file.path;
    const rel = path.relative(this.dir, src);
    const gzipPath = `${src}.gz`;
    const brotliPath = `${src}.br`;

    try {
      if (!this.force) {
        const [gzStat, brStat] = await Promise.all([
          fsPromises.stat(gzipPath).catch(() => null),
          fsPromises.stat(brotliPath).catch(() => null),
        ]);
        if (gzStat && gzStat.mtimeMs >= file.mtimeMs && brStat && brStat.mtimeMs >= file.mtimeMs) { this.summary.skipped++; return; }
      }

      const tmpGz = `${gzipPath}.tmp-${process.pid}`;
      const tmpBr = `${brotliPath}.tmp-${process.pid}`;

      await pipe(
        fs.createReadStream(src),
        createBrotliCompress({ params: { [constants.BROTLI_PARAM_QUALITY]: this.brotliQuality, [constants.BROTLI_PARAM_LGWIN]: 22, [constants.BROTLI_PARAM_MODE]: constants.BROTLI_MODE_TEXT, [constants.BROTLI_PARAM_SIZE_HINT]: file.size } }),
        fs.createWriteStream(tmpBr),
      );
      await fsPromises.rename(tmpBr, brotliPath);

      // Produce a zlib gzip tmp file first (streaming). Then, if gzipper is enabled,
      // produce its tmp file and pick the smaller of the two outputs.
      const tmpGzipZlib = `${gzipPath}.tmp-zlib-${process.pid}`;
      const tmpGzipGzipper = `${gzipPath}.tmp-gzipper-${process.pid}`;
      let usedGzipper = false;
      let chosenTmp = null;

      // Always try zlib gzip first (fast, reliable)
      try {
        await pipe(fs.createReadStream(src), createGzip({ level: 9, memLevel: 9 }), fs.createWriteStream(tmpGzipZlib));
      } catch (err) {
        // if zlib gzip fails, we'll still attempt gzipper if available
        await fsPromises.unlink(tmpGzipZlib).catch(() => { });
      }

      // If gzipper requested, run it to create its candidate
      if (this.useGzipper) {
        try {
          let combos = null;
          if (this.combosFile) {
            try {
              const raw = await fsPromises.readFile(this.combosFile, 'utf8');
              const parsed = JSON.parse(raw);
              const v = validateCombos(parsed);
              if (!v.ok) {
                console.error(`❌ Invalid combos file ${this.combosFile}: ${v.reason}`);
                console.error('   Expected an array of objects like: { "level":9, "memLevel":9, "strategy":0 }');
                console.error('   Falling back to default combos.');
              } else {
                combos = parsed;
              }
            } catch (err) {
              console.error(`❌ Could not read/parse combos file ${this.combosFile}: ${err.message}`);
              console.error('   Ensure the file is valid JSON and follows the expected combo schema. Falling back to default combos.');
            }
          }
          await compressWithGzipper(src, tmpGzipGzipper, { attempts: this.attempts ?? 4, combos, poolSize: this.poolSize });
        } catch (err) {
          // gzipper failed; ensure tmp removed
          await fsPromises.unlink(tmpGzipGzipper).catch(() => { });
        }
      }

      // Decide which gzip to keep: prefer smallest successful candidate
      const candidates = [];
      try { const s = await fsPromises.stat(tmpGzipZlib); candidates.push({ path: tmpGzipZlib, size: s.size, type: 'zlib' }); } catch (e) { }
      try { const s = await fsPromises.stat(tmpGzipGzipper); candidates.push({ path: tmpGzipGzipper, size: s.size, type: 'gzipper' }); } catch (e) { }

      if (candidates.length === 0) {
        // No gzip output produced; throw
        throw new Error('No gzip output produced (zlib and gzipper failed)');
      }

      candidates.sort((a, b) => a.size - b.size);
      chosenTmp = candidates[0].path;
      usedGzipper = candidates[0].type === 'gzipper';

      if (this.dryRun) {
        // If dry-run, report the candidate sizes and remove tmps
        console.log(`   (dry-run) gzip candidates:`);
        for (const c of candidates) console.log(`      - ${path.basename(c.path)}: ${this.formatSize(c.size)} (${c.type})`);
        // Clean up tmp files
        await fsPromises.unlink(tmpGzipZlib).catch(() => { });
        await fsPromises.unlink(tmpGzipGzipper).catch(() => { });
        return; // stop further processing for this file in dry-run mode
      } else {
        // Move chosen tmp to final gzipPath and cleanup the other
        await fsPromises.rename(chosenTmp, gzipPath);
        for (const c of candidates) {
          if (c.path !== chosenTmp) await fsPromises.unlink(c.path).catch(() => { });
        }
      }

      try {
        const s = await fsPromises.stat(src);
        await fsPromises.utimes(gzipPath, s.atime, s.mtime);
        await fsPromises.utimes(brotliPath, s.atime, s.mtime);
      } catch (err) { /* non-fatal */ }

      try {
        const [origStat, gzStat, brStat] = await Promise.all([
          fsPromises.stat(src),
          fsPromises.stat(gzipPath),
          fsPromises.stat(brotliPath),
        ]);

        this.summary.files++;
        this.summary.totalOriginal += origStat.size;

        if (gzStat) {
          if (usedGzipper) this.summary.totalGzipGzipper += gzStat.size;
          else this.summary.totalGzipZlib += gzStat.size;
        }

        if (brStat) this.summary.totalBrotli += brStat.size;

        const gzipSize = gzStat ? gzStat.size : 0;
        const gzipRatio = gzStat ? ((1 - gzipSize / origStat.size) * 100).toFixed(1) : null;
        const brotliRatio = brStat ? ((1 - brStat.size / origStat.size) * 100).toFixed(1) : null;

        console.log(`✅ ${rel}`);
        console.log(`   📦 Original: ${this.formatSize(origStat.size)}`);
        if (gzStat) {
          const label = usedGzipper ? 'Gzip (gzipper)' : 'Gzip (zlib)';
          console.log(`   🟦 ${label}: ${this.formatSize(gzipSize)} (${gzipRatio}% saved)`);
        } else {
          console.log(`   🟦 Gzip: n/a`);
        }
        if (brStat) console.log(`   🔥 Brotli: ${this.formatSize(brStat.size)} (${brotliRatio}% saved)`); else console.log(`   🔥 Brotli: n/a`);
      } catch (err) {
        this.summary.files++;
        console.log(`✅ ${rel} (compressed)`);
      }
    } catch (err) {
      this.summary.errors++;
      console.error(`❌ Failed to compress ${rel}: ${err.message}`);
    }
  }

  formatSize(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

const args = parseArgs();
const compressor = new BuildCompressor(args);
compressor.compressAll().catch((err) => { console.error('Fatal error:', err); process.exitCode = 1; });
