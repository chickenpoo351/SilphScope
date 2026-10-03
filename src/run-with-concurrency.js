// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { RomReader } from "./rom-reader";
import { functions } from "./run-task";

export async function runWithConcurrency(items, concurrency, taskName, rom, config, options, onResult) { // I hope this works... in theory it should and it seems quite simple... it's just that I am garbage at async thingies...
    if (!functions[taskName] ||
        !functions[taskName].func ||
        !functions[taskName].data
    ) {
        throw new Error(`Unknown function: ${taskName}`);
    }

    const func = functions[taskName].func;
    const jsonData = functions[taskName].data;
    const reader = new RomReader(rom, config);
    let index = 0;

    async function worker() {
        while (true) {
            const current = index++;
            if (current >= items.length) return;
            const objectName = items[current];
            const result = await func(objectName, ...jsonData, reader, rom, {
                ...options
            });
            await onResult(result, objectName);
        }
    }
    await Promise.all(
        Array.from(
            { length: Math.min(concurrency, items.length) },
            worker
        )
    );
}