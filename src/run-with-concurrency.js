// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { mapLimit } from "./map-limit.js";

export async function runWithConcurrency(items, concurrency, callback) { // this seems simple... but I have no idea if this will do what I am thinking it will do... (don't be a dum dum like me who decided to code kids!)
    if (concurrency <= 1) {
        for (const item of items) {
            await callback(item);
        }

        return;
    }
    await mapLimit(items, concurrency, callback);
}