// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { PNG } from "pngjs";
import fs from "fs";
import { decode4bppTile } from "./decode-4bpp.js";
import { decodePalette } from "./decode-palette.js";
import { extract } from "./extract.js";
import { renderMonIcon } from "./render-mon-icon.js";
import { renderMonFoot } from "./render-mon-foot.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderMon(monName, mons, assets, rom, options = {}) {
    const {
        side = "front",
        variant = "normal",
        icon = false,
        footprint = false,
        outputDir = null,
    } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderMon(..., rom) requires a ROM Buffer/Uint8Array");
    }

    if (icon === true) {
        const comboPal = assets.find(a => a.name === "gMonIconPalettes");
        if (!comboPal) throw new Error("Missing gMonIconPalettes asset");
        await renderMonIcon(monName, mons, assets, comboPal, rom, { outputDir });
    }
    if (footprint === true) {
        await renderMonFoot(monName, mons, assets, rom, { outputDir });
    }

    const mon = mons[monName];
    if (!mon) {
        throw new Error(`Missing mon: ${monName}`);
    }

    const picName = side === "back" ? mon.backPics : mon.frontPics;
    const monPic = assets.find(a => a.name === picName);
    const palType = variant === "shiny" ? mon.shinyPalette : mon.normPalette;
    const monPal = assets.find(a => a.name === palType);

    if (!monPic || !monPal) {
        throw new Error(`Missing assets for: ${monName}`);
    }

    const monImageData = extract(monPic, rom);
    const rawMonPalData = extract(monPal, rom);
    const tileSize = 32;
    const numTiles = monImageData.data.length / tileSize;
    const width = 64;
    const height = 64;
    const tilesPerRow = width / 8;
    const monPalData = decodePalette(rawMonPalData.data);

    const tiles = [];
    for (let i = 0; i < numTiles; i++) {
        const start = i * tileSize;
        const tileBytes = monImageData.data.slice(start, start + tileSize);
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
                const [r, g, b] = monPalData[colorIndex] || [0, 0, 0];
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
        const fileName = `${dir}/${side}${variant === "shiny" ? "_shiny" : ""}.png`;
        fs.writeFileSync(fileName, pngBuffer);
    }

    return pngBuffer;
}