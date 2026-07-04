// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { extract } from "../extract.js";
import { PNG } from "pngjs";
import fs from "fs";
import { render4bppImage } from "../render-4bpp-image.js";
import { resolveItemIconObject } from "./resolvers/item-icons-resolver.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderIcon(itemName, items, reader, rom, options = {}) {
    const {
        pngFilterType = null,
        pngCompressionLevel = null, 
        returnFileBuffer = false,
        outputDir = null 
    } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderIcon(..., rom) requires a ROM Buffer/Uint8Array");
    }

    let fullFileCount = 0;
    const results = returnFileBuffer? [] : null;
    const item = items[itemName];
    if (!item) {
        throw new Error(`Missing Item: ${itemName}`);
    }

    const iconPal = resolveItemIconObject(item, reader, itemName, "pal");
    const iconPic = resolveItemIconObject(item, reader, itemName, "gfx");
    if (!iconPal || !iconPic) {
        throw new Error(`Missing assets for: ${itemName}`);
    }

    const iconImageData = extract(iconPic, rom);
    const rawIconPalData = extract(iconPal, rom);
    const width = 24;
    const height = 24;

    const image = render4bppImage({
        tileData: iconImageData.data, 
        paletteData: rawIconPalData.data, 
        width, 
        height
    });

    const png = new PNG({ width, height });
    png.data = image;
    const pngBuffer = PNG.sync.write(png, { 
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel, 
    });

    if (outputDir) {
        const dir = `${outputDir}/${itemName}`;
        await fs.promises.mkdir(dir, { recursive: true });
        const fileName = `${dir}/icon.png`;
        await fs.promises.writeFile(fileName, pngBuffer);
        fullFileCount += 1;
    }
    if (returnFileBuffer) {
        results.push({
            name: `${itemName}-sprite`,
            category: "icon",
            asset: "sprite",
            path: `out/icons/${itemName}/icon`,
            buffer: pngBuffer,
            meta: {},
        });
    }
    return {
        ...(returnFileBuffer && { results }),
        fullFileCount,
    };
}