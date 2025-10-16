import { Worker } from 'worker_threads';
import os from 'os';

// Run attempts using worker threads with a concurrency-limited pool.
// tasks: array of { srcPath, tmpPath, opt }
export async function runAttemptsWithPool(tasks, { poolSize = Math.max(1, os.cpus().length - 1) } = {}) {
    const results = [];
    let idx = 0;
    let inflight = 0;

    return await new Promise((resolve) => {
        const next = () => {
            while (inflight < poolSize && idx < tasks.length) {
                const t = tasks[idx++];
                inflight++;
                const workerFile = new URL('./gzipper-worker.mjs', import.meta.url).pathname;
                const w = new Worker(workerFile, { workerData: { srcPath: t.srcPath, tmpPath: t.tmpPath, opt: t.opt } });
                const onFinish = (msg) => {
                    inflight--;
                    if (msg && msg.ok) results.push({ path: t.tmpPath, size: msg.size });
                    // else ignore failure
                    w.removeAllListeners();
                    if (inflight === 0 && idx >= tasks.length) resolve(results);
                    else next();
                };
                w.once('message', onFinish);
                w.once('error', (err) => { inflight--; w.removeAllListeners(); if (inflight === 0 && idx >= tasks.length) resolve(results); else next(); });
                w.once('exit', () => { /* noop; message or error handles result */ });
            }
            if (inflight === 0 && idx >= tasks.length) resolve(results);
        };
        next();
    });
}

export default { runAttemptsWithPool };
