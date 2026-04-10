// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { decode4bppTile } from "./decode-4bpp.js";
import { decodePalette } from "./decode-palette.js";

export function render4bppImage({ tileData, paletteData, width, height, paletteOffset = 0, paletteSize = null }) {
    const tileSize = 32;
    const numTiles = tileData.length / tileSize;
    const tilesPerRow = width / 8;
    let finalPaletteData = paletteData;
    if (paletteSize !== null) {
        finalPaletteData = paletteData.slice(
            paletteOffset,
            paletteOffset + paletteSize
        );
    }
    const palette = decodePalette(finalPaletteData);
    const tiles = [];
    for (let i = 0; i < numTiles; i++) {
        const start = i * tileSize;
        const tileBytes = tileData.slice(start, start + tileSize);
        tiles.push(decode4bppTile(tileBytes));
    }
    const image = new Uint8ClampedArray(width * height * 4);
    for (let t = 0; t < tiles.length; t++) {
        const tile = tiles[t];
        const tileX = t % tilesPerRow;
        const tileY = Math.floor(t / tilesPerRow);
        for (let py = 0; py < 8; py++) {
            for (let px = 0; px < 8; px++) {
                const pixelIndex = py * 8 + px;
                const colorIndex = tile[pixelIndex];
                const x = tileX * 8 + px;
                const y = tileY * 8 + py;
                const outIndex = (y * width + x) * 4;
                const [r, g, b] = palette[colorIndex] || [0, 0, 0];
                image[outIndex] = r;
                image[outIndex + 1] = g;
                image[outIndex + 2] = b;
                image[outIndex + 3] = colorIndex === 0 ? 0 : 255;
            }
        }
    }
    return image;
}