// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export function decode1bppTile(tileBytes) {
    const pixels = new Uint8Array(64);
    for (let i = 0; i < 8; i++) {
        const byte = tileBytes[i];
        for (let bit = 0; bit < 8; bit++) {
            const pixelIndex = i * 8 + bit;
            const pixel = (byte >> bit) & 1;
            pixels[pixelIndex] = pixel;
        }
    }
    return pixels;
}