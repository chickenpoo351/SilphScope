// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { PNG } from "pngjs";
import { extract } from "../extract.js";
import { decode1bppTile } from "../decode-1bpp.js";
import fs from "fs";
import { resolveMonFootprint } from "./resolvers/mon-footprint-sprite-resolver.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderMonFoot(monName, mons, reader, rom, options = {}) {
    const { outputDir = null } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderMonFoot(..., rom) requires a ROM Buffer/Uint8Array");
    }

    const mon = mons[monName];
    if (!mon) {
        throw new Error(`Missing mon entry for ${monName}`);
    }

    if (monName.includes("UNOWN")) return;

    const footAsset = resolveMonFootprint(mon, reader, monName); // possibly the easiest change ive had to do if it works first try :o
    if (!footAsset) {
        throw new Error(`Missing foot asset for ${monName}`);
    }

    const footData = extract(footAsset, rom);
    const tiles = [];
    const tileSize = 8;
    const numTiles = footData.data.length / tileSize;
    const width = 16;
    const height = 16;
    const tilesPerRow = width / 8;

    for (let i = 0; i < numTiles; i++) {
        const start = i * tileSize;
        const tileBytes = footData.data.slice(start, start + tileSize);
        tiles.push(decode1bppTile(tileBytes));
    }

    const image = new Uint8ClampedArray(width * height * 4);
    for (let t = 0; t < tiles.length; t++) {
        const tile = tiles[t];
        const tileX = t % tilesPerRow;
        const tileY = Math.floor(t / tilesPerRow);
        for (let py = 0; py < 8; py++) {
            for (let px = 0; px < 8; px++) {
                const pixelIndex = py * 8 + px;
                const value = tile[pixelIndex];
                const x = tileX * 8 + px;
                const y = tileY * 8 + py;
                const outIndex = (y * width + x) * 4;
                const color = value ? 0 : 255;
                image[outIndex] = color;
                image[outIndex + 1] = color;
                image[outIndex + 2] = color;
                image[outIndex + 3] = value ? 255 : 0;
            }
        }
    }

    const png = new PNG({ width, height });
    png.data = image;
    const pngBuffer = await streamToBuffer(png.pack());

    if (outputDir) {
        const dir = `${outputDir}/${monName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fileName = `${dir}/footprint.png`;
        fs.writeFileSync(fileName, pngBuffer);
    }

    return pngBuffer;
}