// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { PNG } from "pngjs";
import { extract } from "./extract.js";
import { decode1bppTile } from "./decode-1bpp.js";
import fs from "fs";

export function renderMonFoot(monName, mons, assets) {
    return new Promise((resolve, reject) => {
        const mon = mons[monName];
        const footAsset = assets.find(a => a.name === mon.footprintPics);
        if (!footAsset) {
            console.log(`Missing mon foot from mon: ${monName}`);
            return resolve();
        }
        const footData = extract(footAsset);
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
        const dir = `./out/${monName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const fileName = `${dir}/footprint.png`;
        const stream = fs.createWriteStream(fileName);
        stream.on("finish", resolve);
        stream.on("error", reject);
        png.pack().pipe(stream);
    })
}