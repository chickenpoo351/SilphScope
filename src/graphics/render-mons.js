import { PNG } from "pngjs";
import fs from "fs";
import { decode4bppTile } from "./decode-4bpp.js";
import { decodePalette } from "./decode-palette.js";
import { extract } from "./extract.js";

export function renderMon(monName, mons, assets) {
    return new Promise((resolve, reject) => {
        const mon = mons[monName];
        if (!mon) {
            console.warn(`Missing mon: ${monName}`);
            return resolve;
        }
        const gfxAsset = assets.find(a => a.name === mon.frontPics);
        const palAsset = assets.find(a => a.name === mon.normPalette);
        if (!gfxAsset || !palAsset) {
            console.warn(`Missing assets for: ${monName}`);
            return resolve;
        }
        const gfx = extract(gfxAsset);
        const pal = extract(palAsset);
        const tileSize = 32;
        const numTiles = gfx.data.length / tileSize;
        const width = 64;
        const height = 64;
        const tilesPerRow = width / 8;
        const palette = decodePalette(pal.data);
        const tiles = [];
        for (let i = 0; i < numTiles; i++) {
            const start = i * tileSize;
            const tileBytes = gfx.data.slice(start, start + tileSize);
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
        const stream = fs.createWriteStream(`./out/${monName}.png`);
        stream.on("finish", resolve);
        stream.on("error", reject);
        png.pack().pipe(stream);
    })
}