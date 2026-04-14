// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { lz77Decompress } from "./lz77-decompress.js";

export function extract(asset, rom) {
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("extract(asset, rom) requires a ROM Buffer/Uint8Array as second argument");
    }

    const start = asset.offset;
    if (rom[start] === 0x10) {
        try {
            const slice = rom.slice(start);
            const data = lz77Decompress(slice);
            return { ...asset, data, compressed: true };
        } catch (e) {
            console.warn(`lz77 failed for ${asset.name}... treating as raw :p`);
        }
    }
    if (!asset.size) {
        throw new Error(`Attempted to read ${asset.name} however it is missing a size attribute`);
    }
    const slice = rom.slice(start, start + asset.size);
    return { ...asset, data: slice, compressed: false };
}