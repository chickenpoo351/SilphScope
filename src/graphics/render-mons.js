// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { PNG } from "pngjs";
import fs from "fs";
import { extract } from "./extract.js";
import { renderMonIcon } from "./render-mon-icon.js";
import { renderMonFoot } from "./render-mon-foot.js";
import { render4bppImage } from "./render-4bpp-image.js";

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
    const width = 64;
    const height = 64;

    const image = render4bppImage({
        tileData: monImageData, 
        paletteData: rawMonPalData, 
        width, 
        height, 
    });

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