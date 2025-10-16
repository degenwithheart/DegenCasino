import { parentPort, workerData } from 'worker_threads';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { createGzip } from 'zlib';

const pipe = promisify(pipeline);

async function run() {
    const { srcPath, tmpPath, opt } = workerData;
    try {
        const read = fs.createReadStream(srcPath);
        const gz = createGzip(opt);
        const write = fs.createWriteStream(tmpPath);
        await pipe(read, gz, write);
        const st = await fsPromises.stat(tmpPath);
        parentPort.postMessage({ ok: true, size: st.size });
    } catch (err) {
        // Ensure partial file removed
        await fsPromises.unlink(tmpPath).catch(() => { });
        parentPort.postMessage({ ok: false, error: err && err.message ? err.message : String(err) });
    }
}

run();
