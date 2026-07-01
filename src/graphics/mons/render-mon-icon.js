// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { extract } from "../extract.js";
import { PNG } from "pngjs";
import fs from "fs";
import { render4bppImage } from "../render-4bpp-image.js";
import { resolveMonIcon } from "./resolvers/mon-icon-resolver.js";
import { resolveMonIconPalette } from "./resolvers/mon-icon-palette-resolver.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderMonIcon(monName, mons, reader, rom, options = {}) {
    const {
        pngFilterType = null,
        pngCompressionLevel = null,
        returnFileBuffer = false,
        outputDir = null
    } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderMonIcon(..., rom) requires a ROM Buffer/Uint8Array");
    }

    let fullFileCount = 0;
    const results = returnFileBuffer? [] : null;
    const mon = mons[monName];
    if (!mon) {
        throw new Error(`Missing mon entry for ${monName}`);
    }

    const iconAsset = resolveMonIcon(mon, reader, monName);
    const iconPalette = resolveMonIconPalette(mon, reader, monName);
    if (!iconAsset || !iconPalette) throw new Error(`Missing icon asset for ${monName}`);

    const iconData = extract(iconAsset, rom);
    const rawIconPalData = extract(iconPalette, rom);
    const width = 32;
    const height = 64;

    const image = render4bppImage({
        tileData: iconData.data,
        paletteData: rawIconPalData.data,
        width,
        height,
    });

    const frameHeight = 32;
    const frameSize = width * frameHeight * 4;
    const frame1 = image.slice(0, frameSize);
    const frame2 = image.slice(frameSize, frameSize * 2);
    const pngFrame1 = new PNG({ width, height: frameHeight });
    pngFrame1.data = frame1;
    const pngFrame2 = new PNG({ width, height: frameHeight });
    pngFrame2.data = frame2;
    const buffer1 = PNG.sync.write(pngFrame1, {
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel,
    });
    const buffer2 = PNG.sync.write(pngFrame2, {
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel,
    });

    if (outputDir) {
        const dir = `${outputDir}/${monName}`;
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(`${dir}/icon_frame1.png`, buffer1);
        await fs.promises.writeFile(`${dir}/icon_frame2.png`, buffer2);
        fullFileCount += 2;
    }
    if (returnFileBuffer) {
        results.push({
            name: `${monName}-icon-frame1`,
            category: "mon",
            asset: "icon",
            path: `out/mons/${monName}/icon_frame1`,
            buffer: buffer1,
            meta: {
                frame: 1,
            }
        });
        results.push({
            name: `${monName}-icon-frame2`,
            category: "mon",
            asset: "icon",
            path: `out/mons/${monName}/icon_frame2`,
            buffer: buffer2,
            meta: {
                frame: 2,
            },
        });
    }
    return {
        ...(returnFileBuffer && { results }),
        fullFileCount,
    };
}