import { promisify } from 'util';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { pipeline } from 'stream';
import { createGzip, constants } from 'zlib';
import path from 'path';
import os from 'os';
import { Worker } from 'worker_threads';
import { runAttemptsWithPool } from './gzipper-pool.mjs';

const pipe = promisify(pipeline);

// Default combos tried by gzipper (tuned for good compression)
const COMBOS = [
    { level: 9, memLevel: 9, strategy: constants.Z_DEFAULT_STRATEGY },
    { level: 9, memLevel: 9, strategy: constants.Z_FILTERED },
    { level: 9, memLevel: 8, strategy: constants.Z_DEFAULT_STRATEGY },
    { level: 9, memLevel: 9, strategy: constants.Z_HUFFMAN_ONLY }
];

// Validate combos array: each item should be an object with numeric level (0-9),
// numeric memLevel (1-9), and numeric strategy (zlib strategy constants 0..3).
export function validateCombos(combos) {
    if (!Array.isArray(combos) || combos.length === 0) return { ok: false, reason: 'combos must be a non-empty array' };
    for (let i = 0; i < combos.length; i++) {
        const c = combos[i];
        if (typeof c !== 'object' || c === null) return { ok: false, reason: `combo[${i}] must be an object` };
        const level = Number(c.level);
        if (!Number.isInteger(level) || level < 0 || level > 9) return { ok: false, reason: `combo[${i}].level must be integer 0..9` };
        const memLevel = Number(c.memLevel);
        if (!Number.isInteger(memLevel) || memLevel < 1 || memLevel > 9) return { ok: false, reason: `combo[${i}].memLevel must be integer 1..9` };
        const strategy = Number(c.strategy);
        if (!Number.isInteger(strategy) || strategy < 0 || strategy > 3) return { ok: false, reason: `combo[${i}].strategy must be integer 0..3` };
    }
    return { ok: true };
}

// Helper: run a single attempt in the main thread (fallback)
async function runAttemptMainThread(srcPath, tmpPath, opt) {
    try {
        const read = fs.createReadStream(srcPath);
        const gz = createGzip(opt);
        const write = fs.createWriteStream(tmpPath);
        await pipe(read, gz, write);
        const st = await fsPromises.stat(tmpPath);
        return { path: tmpPath, size: st.size };
    } catch (err) {
        await fsPromises.unlink(tmpPath).catch(() => { });
        throw err;
    }
}

// Worker-based attempt: spawn a worker that performs a single gzip attempt.
function runAttemptWorker(srcPath, tmpPath, opt) {
    return new Promise((resolve, reject) => {
        const workerFile = new URL('./gzipper-worker.mjs', import.meta.url).pathname;
        const w = new Worker(workerFile, { workerData: { srcPath, tmpPath, opt } });
        const cleanup = () => { w.removeAllListeners(); };
        w.on('message', (msg) => {
            cleanup();
            if (msg && msg.ok) resolve({ path: tmpPath, size: msg.size });
            else reject(new Error(msg && msg.error ? msg.error : 'worker failed'));
        });
        w.on('error', (err) => { cleanup(); reject(err); });
        w.on('exit', (code) => { if (code !== 0) { cleanup(); /* worker likely already reported error */ } });
    });
}

// Custom gzipper: try several gzip parameter combos (using worker threads when
// available), each writing to its own temporary file, then pick the smallest output.
export async function compressWithGzipper(srcPath, outTmpPath, { attempts = 4, combos: customCombos = null, poolSize = null } = {}) {
    const combos = (customCombos && Array.isArray(customCombos) && customCombos.length > 0) ? customCombos : COMBOS.slice(0, Math.max(1, Math.min(attempts, COMBOS.length)));
    const tmpPaths = combos.map((_, i) => `${outTmpPath}.attempt-${i}.tmp-${process.pid}`);

    const results = [];

    // If a pool size is provided, use the pool helper which uses workers
    const requestedPoolSize = (typeof poolSize === 'number' && poolSize > 0) ? poolSize : Math.max(1, Math.min(combos.length, Math.max(1, os.cpus().length - 1)));
    try {
        const tasks = combos.map((opt, i) => ({ srcPath, tmpPath: tmpPaths[i], opt }));
        const poolResults = await runAttemptsWithPool(tasks, { poolSize: requestedPoolSize });
        for (const r of poolResults) results.push(r);
    } catch (err) {
        // If pool failed entirely, fallback to sequential main-thread attempts
        for (let i = 0; i < combos.length; i++) {
            const opt = combos[i];
            const tmp = tmpPaths[i];
            try {
                const res = await runAttemptMainThread(srcPath, tmp, opt);
                results.push(res);
            } catch (err2) {
                // ignore
            }
        }
    }

    if (results.length === 0) {
        // Clean leftovers
        for (const p of tmpPaths) await fsPromises.unlink(p).catch(() => { });
        throw new Error('gzipper: all compression attempts failed');
    }

    // Pick smallest
    results.sort((a, b) => a.size - b.size);
    const best = results[0];

    // Move best to outTmpPath atomically, remove others
    await fsPromises.rename(best.path, outTmpPath);
    for (const r of results) {
        if (r.path !== best.path) await fsPromises.unlink(r.path).catch(() => { });
    }

    // Clean up any leftover tmp files from other (failed) attempts
    for (const p of tmpPaths) {
        if (p === best.path) continue;
        await fsPromises.unlink(p).catch(() => { });
    }

    return best.size;
}

export default { compressWithGzipper };
