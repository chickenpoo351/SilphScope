// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { decode4bppTile } from "./decode-4bpp.js";
import { decodePalette } from "./decode-palette.js";
import { extract } from "./extract.js";
import { PNG } from "pngjs";
import fs from "fs";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderMonIcon(monName, mons, assets, iconPalettes, rom, options = {}) {
    const { outputDir = null } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderMonIcon(..., rom) requires a ROM Buffer/Uint8Array");
    }

    const mon = mons[monName];
    if (!mon) {
        throw new Error(`Missing mon entry for ${monName}`);
    }

    const iconAsset = assets.find(a => a.name === mon.Icon);
    if (!iconAsset) throw new Error(`Missing icon asset for ${monName}`);

    const iconData = extract(iconAsset, rom);
    const palIndex = Number(mon.iconPalIndex);
    const palSize = 32;
    const palStart = palIndex * palSize;
    const palEnd = palStart + palSize;
    const rawIconPalData = extract(iconPalettes, rom);
    const slicedPalData = rawIconPalData.data.slice(palStart, palEnd);
    const palette = decodePalette(slicedPalData);

    const tileSize = 32;
    const numTiles = iconData.data.length / tileSize;
    const width = 32;
    const height = 64;
    const tilesPerRow = width / 8;

    const tiles = [];
    for (let i = 0; i < numTiles; i++) {
        const start = i * tileSize;
        const tileBytes = iconData.data.slice(start, start + tileSize);
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

    const png = new PNG({ width, height });
    png.data = image;
    const pngBuffer = await streamToBuffer(png.pack());

    if (outputDir) {
        const dir = `${outputDir}/${monName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fileName = `${dir}/icon.png`;
        fs.writeFileSync(fileName, pngBuffer);
    }

    return pngBuffer;
}