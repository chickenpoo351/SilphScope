import { PoolWorker } from "./pool-worker.js";


export async function runWithWorker(items, concurrency, taskName, rom, config, options, onResult) {
    const sharedRom = new SharedArrayBuffer(rom.byteLength); // actually wasn't too hard :p of course though thats only if I did this right lol
    new Uint8Array(sharedRom).set(rom);
    
    const workers = Array.from(
        { length: Math.min(concurrency, items.length) },
        () => new PoolWorker(new URL("./render-worker.js", import.meta.url)),
    );

    try {
        await Promise.all(
            workers.map(worker => worker.init(sharedRom, config)),
        );

        let nextIndex = 0;
        async function work(worker) {
            while (true) {
                const current = nextIndex++;
                if (current >= items.length) return;
                const objectName = items[current];
                const result = await worker.run(taskName, objectName, options);

                await onResult(result, objectName);
            }
        }
        await Promise.all(
            workers.map(work),
        );
    } finally {
        await Promise.all(
            workers.map(worker => worker.terminate()),
        );
    }
}