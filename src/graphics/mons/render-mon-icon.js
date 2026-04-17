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
    const { outputDir = null } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderMonIcon(..., rom) requires a ROM Buffer/Uint8Array");
    }

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
    const buffer1 = await streamToBuffer(pngFrame1.pack());
    const buffer2 = await streamToBuffer(pngFrame2.pack());

    if (outputDir) {
        const dir = `${outputDir}/${monName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/icon_frame1.png`, buffer1);
        fs.writeFileSync(`${dir}/icon_frame2.png`, buffer2);
    }

    return {
        frame1: buffer1,
        frame2: buffer2,
    };
}