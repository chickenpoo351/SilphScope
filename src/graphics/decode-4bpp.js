// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export function decode4bppTile(tileBytes) {
    const pixels = new Uint8Array(64);
    for (let i = 0; i < 32; i++) {
        const byte = tileBytes[i];
        const p1 = byte & 0xF;
        const p2 = byte >> 4;
        const pixelIndex = i * 2;
        pixels[pixelIndex] = p1;
        pixels[pixelIndex + 1] = p2;
    }
    return pixels;
}