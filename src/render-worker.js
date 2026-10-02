// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

// like electron IPC but worse... kinda :o

import { parentPort } from "worker_threads";
import { RomReader } from "./rom-reader.js";
import { functions } from "./run-task.js";

let reader;
let rom;

parentPort.on("message", async (task) => { // I don't really know what I am doing... but roll with it!
    if (task.type === "init") {
        rom = new Uint8Array(task.rom) // so usually this wouldn't work... but I think if I am reading the docs for SharedArrayBuffer correctly... then if I correctly initialize the rom into the shared array this should work... if not then erm we might have to make a few hacks for this to work :p
        reader = new RomReader(rom, task.config);
        parentPort.postMessage({
            type: "ready"
        });
        return;
    }
    // so now after the init this should work I think? hopefully? like I said I don't know what I am doing lmao
    if (!functions[task.taskName] ||
        !functions[task.taskName].func ||
        !functions[task.taskName].data
    ) {
        return parentPort.postMessage({
            type: "error",
            id: task.id,
            error: `Unknown function: ${task.taskName}`
        });
    }
    const func = functions[task.taskName].func; // naming this const "function" would be so much more accurate but you know function is a reserved word :p
    const jsonData = functions[task.taskName].data;

    try {
        const result = await func(task.objectName, ...jsonData, reader, rom, {
            ...task.options,
        }); // ok so that should handle the functions... if only we could pass cb's through workers but oh well :p
        parentPort.postMessage({
            type: "result",
            id: task.id,
            objectName: task.objectName,
            result
        })
        return;
    } catch (err) {
        parentPort.postMessage({
            type: "error",
            id: task.id,
            error: err.stack ?? err.message,
        });
    }
})