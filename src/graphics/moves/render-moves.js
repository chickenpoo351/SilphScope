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

const extractFrameFromImage = (imageData, fullWidth, frameData) => { // in theory should work...
    const { x, y, width, height } = frameData;
    const frameImage = new Uint8ClampedArray(width * height * 4);

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const srcIndex = ((y + row) * fullWidth + (x + col)) * 4;
            const dstIndex = (row * width + col) * 4;
            frameImage[dstIndex] = imageData[srcIndex];
            frameImage[dstIndex + 1] = imageData[srcIndex + 1];
            frameImage[dstIndex + 2] = imageData[srcIndex + 2];
            frameImage[dstIndex + 3] = imageData[srcIndex + 3];
        }
    }

    return frameImage;
};

export async function renderMove(moveName, moves, reader, rom, options = {}) {
    const {
        pngFilterType = null,
        pngCompressionLevel = null,
        returnFileBuffer = false,
        outputDir = null,
        renderMasterImage = false,
        sortUnused = false,
    } = options;
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderMove(..., rom) requires a ROM Buffer/Uint8Array");
    }

    let fullFileCount = 0;
    const results = returnFileBuffer ? [] : null;
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
    const pngBuffer = PNG.sync.write(png, {
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel,
    });

    const rootDir = (sortUnused && move?.unused === true) ? `${outputDir}/unused` : `${outputDir}` // yes this could become null if outputDir is null (who would have thought :p) but since nothing uses this unless outputDir is true then it isn't really an issue... although it is a bit messy...
    const dir = `${rootDir}/${moveName}`;

    if (renderMasterImage) {
        if (outputDir) {
            await fs.promises.writeFile(`${dir}/master.png`, pngBuffer);
            fullFileCount += 1;
        }
        if (returnFileBuffer) {
            results.push({
                name: `${moveName}-full-sprite`,
                category: "move",
                asset: "sprite",
                path: `out/moves/${(sortUnused && move?.unused) === true? `unused/${moveName}` : `${moveName}`}/master`,
                buffer: pngBuffer,
                meta: { },
            });
        }
    }

    if (outputDir) { // I will update this later but in theory it should also work... eventually though it will need a split inside to handle full image generation :p
        await fs.promises.mkdir(dir, { recursive: true });
    }
    for (let i = 0; i < move.frames.length; i++) {
        const frame = move.frames[i];
        const frameImageData = extractFrameFromImage(image, width, frame);

        const png = new PNG({ width: frame.width, height: frame.height });
        png.data = frameImageData;
        const pngBuffer = PNG.sync.write(png, {
            filterType: pngFilterType,
            deflateLevel: pngCompressionLevel,
        });

        if (outputDir) {
            const fileName = `${dir}/frame-${i}.png`;
            await fs.promises.writeFile(fileName, pngBuffer);
            fullFileCount += 1;
        }
        if (returnFileBuffer) {
            results.push({
                name: `${moveName}-frame${i}`,
                category: "move",
                asset: "frame",
                path: `out/moves/${(sortUnused && move?.unused) === true ? `unused/${moveName}` : `${moveName}`}/frame-${i}`,
                buffer: pngBuffer,
                meta: {
                    frame: i,
                },
            });
        }
    }


    return {
        ...(returnFileBuffer && { results }),
        fullFileCount,
    };
}