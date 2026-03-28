// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { lz77Decompress } from "./lz77-decompress.js";
// import { rom } from "I will add this variable once I figure out the UX..."

export function extract(asset) { // since well I havent actually tested this... I have no idea if it works or not... but eh that time will come eventually...
    const start = asset.offset;
    if (rom[start] === 0x10) {
        const slice = rom.slice(start);
        const data = lz77Decompress(slice);
        return { ...asset, data, compressed: true };
    }
    const slice = rom.slice(start, start + asset.size);
    return { ...asset, data: slice, compressed: false };
}