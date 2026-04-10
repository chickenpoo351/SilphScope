// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { extract } from "../extract.js";
import { PNG } from "pngjs";
import fs from "fs";
import { render4bppImage } from "../render-4bpp-image.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderIcon(itemName, items, assets, rom, options = {}) {
    const { outputDir = null } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderIcon(..., rom) requires a ROM Buffer/Uint8Array");
    }

    const item = items[itemName];
    if (!item) {
        throw new Error(`Missing Item: ${itemName}`);
    }

    const iconPal = assets.find(a => a.name === item.palette);
    const iconPic = assets.find(a => a.name === item.icon);
    if (!iconPal || !iconPic) {
        throw new Error(`Missing assets for: ${itemName}`);
    }

    const iconImageData = extract(iconPic, rom);
    const rawIconPalData = extract(iconPal, rom);
    const width = 24;
    const height = 24;

    const image = render4bppImage({
        tileData: iconImageData, 
        paletteData: rawIconPalData, 
        width, 
        height
    });

    const png = new PNG({ width, height });
    png.data = image;
    const pngBuffer = await streamToBuffer(png.pack());

    if (outputDir) {
        const dir = `${outputDir}/${itemName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fileName = `${dir}/icon.png`;
        fs.writeFileSync(fileName, pngBuffer);
    }

    return pngBuffer;
}