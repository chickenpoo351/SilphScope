import { Worker } from "worker_threads";

export class PoolWorker {
    constructor(path) {
        this.worker = new Worker(path);
        this.readyResolver = null;
        this.nextId = 0; // hopefully i don't forget this... but eventually I need to come back and see if sending a mound of data in a single message is faster than sending a message each time we need to render something... hence the need for an id/map system
        this.pending = new Map();

        this.worker.on("message", (message) => {
            switch(message.type) {
                case "ready":
                    this.readyResolver?.();
                    this.readyResolver = null;
                    break;
                case "result":
                    const pending = this.pending.get(message.id);
                    if (!pending) return;
                    pending.resolve(message.result);
                    this.pending.delete(message.id);
                    break;
                case "error":
                    const pending2 = this.pending.get(message.id);
                    if (!pending2) return;
                    pending2.reject(new Error(message.error));
                    this.pending.delete(message.id);
                    break;
            }
        });
    }
    init(rom, config) {
        return new Promise((resolve) => {
            this.readyResolver = resolve;
            this.worker.postMessage({
                type: "init",
                rom,
                config,
            });
        });

    }
    run(taskName, objectName, options) {
        return new Promise((resolve, reject) => {
            const id = this.nextId++;
            this.pending.set(id, {
                resolve,
                reject,
            });
            this.worker.postMessage({
                id,
                taskName,
                objectName,
                options,
            });
        });
    }
    terminate() {
        return this.worker.terminate();
    }
}