// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export async function mapLimit(items, limit, mapper) { // I hope this works... in theory it should and it seems quite simple... it's just that I am garbage at async thingies...
    const results = new Array(items.length);
    let index = 0;

    async function worker() {
        while (true) {
            const current = index++;

            if (index >= items.length) return;

            results[current] = await mapper(items[current], current);
        }
    }
    await Promise.all(
        Array.from(
            { length: Math.min(limit, items.length) },
            worker
        )
    );

    return results;
}