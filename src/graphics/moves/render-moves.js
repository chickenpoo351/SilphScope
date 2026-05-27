// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { extract } from "../extract.js";
import { render4bppImage } from "../render-4bpp-image.js";
import { resolveMovePic } from "./resolvers/move-pic-resolver.js";
import { resolveMovePal } from "./resolvers/move-pal-resolver.js";
import fs from "fs";
import { PNG } from "pngjs";

// let's see if I remember how to throw one of these together...

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderMove(moveName, moves, reader, rom, options = {}) {
    const {
        outputDir = null
    } = options;
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderMove(..., rom) requires a ROM Buffer/Uint8Array");
    }

    const move = moves[moveName];
    if (!move) {
        throw new Error(`Missing move: ${moveName}`)
    }

    const movePic = resolveMovePic(move, reader, moveName);
    const movePal = resolveMovePal(move, reader, moveName);
    if (!movePal || !movePic) {
        throw new Error(`Missing assets for: ${moveName}`);
    }

    const moveImageData = extract(movePic, rom);
    const rawMovePalData = extract(movePal, rom);
    const width = move.imageWidth;
    const height = move.imageHeight;

    const image = render4bppImage({
        tileData: moveImageData.data,
        paletteData: rawMovePalData.data,
        width,
        height,
    });

    const png = new PNG({ width, height });
    png.data = image;
    const pngBuffer = await streamToBuffer(png.pack());

    if (outputDir) {
        const dir = `${outputDir}/${moveName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fileName = `${dir}/move.png`;
        fs.writeFileSync(fileName, pngBuffer);
    }
}