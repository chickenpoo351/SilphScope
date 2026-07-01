// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { PNG } from "pngjs";
import fs from "fs";
import { extract } from "../extract.js";
import { render4bppImage } from "../render-4bpp-image.js";
import { resolveTrainerBackPic } from "./resolvers/trainer-back-pic-resolver.js";
import { resolveTrainerBackPicPal } from "./resolvers/trainer-back-pic-pal-resolver.js"

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderTrainerBackPic(trainerName, trainers, reader, rom, options = {}) {
    const { 
        pngFilterType = null,
        pngCompressionLevel = null,
        returnFileBuffer = false,
        outputDir = null 
    } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderTrainerBackPic(..., rom) requires a ROM Buffer/Uint8Array");
    }

    let fullFileCount = 0;
    const results = returnFileBuffer? [] : null;
    const trainer = trainers[trainerName];
    if (!trainer) {
        throw new Error(`Missing trainer entry for ${trainerName}`);
    }

    const trainerBackPic = resolveTrainerBackPic(trainer, reader, trainerName);
    const trainerBackPal = resolveTrainerBackPicPal(trainer, reader, trainerName);
    if (!trainerBackPic || !trainerBackPal) {
        throw new Error(`Missing assets for: ${trainerName}`);
    }

    const trainerBackImageData = extract(trainerBackPic, rom);
    const rawTrainerBackPalData = extract(trainerBackPal, rom);
    const width = 64;
    let height;
    if (trainerName === "RED" || trainerName === "LEAF") {
        height = 320;
    } else {
        height = 256;
    }

    const image = render4bppImage({
        tileData: trainerBackImageData.data,
        paletteData: rawTrainerBackPalData.data,
        width,
        height,
    });

    const frameHeight = 64;
    const frameSize = width * frameHeight * 4;
    const frame1 = image.slice(0, frameSize);
    const frame2 = image.slice(frameSize * 1, frameSize * 2);
    const frame3 = image.slice(frameSize * 2, frameSize * 3);
    const frame4 = image.slice(frameSize * 3, frameSize * 4);
    const frame5 = (trainerName === "RED" || trainerName === "LEAF")
        ? image.slice(frameSize * 4, frameSize * 5)
        : null;
    const pngFrame1 = new PNG({ width, height: frameHeight });
    pngFrame1.data = frame1;
    const pngFrame2 = new PNG({ width, height: frameHeight });
    pngFrame2.data = frame2;
    const pngFrame3 = new PNG({ width, height: frameHeight });
    pngFrame3.data = frame3;
    const pngFrame4 = new PNG({ width, height: frameHeight });
    pngFrame4.data = frame4;
    const buffer1 = PNG.sync.write(pngFrame1, { 
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel,
    });
    const buffer2 = PNG.sync.write(pngFrame2, { 
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel,
    });
    const buffer3 = PNG.sync.write(pngFrame3, { 
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel,
    });
    const buffer4 = PNG.sync.write(pngFrame4, { 
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel,
    });
    let buffer5 = null;

    if (outputDir) {
        const dir = `${outputDir}/${trainerName}`;
        await fs.promises.mkdir(dir, { recursive: true });
        await fs.promises.writeFile(`${dir}/trainer_back_frame_1.png`, buffer1);
        await fs.promises.writeFile(`${dir}/trainer_back_frame_2.png`, buffer2);
        await fs.promises.writeFile(`${dir}/trainer_back_frame_3.png`, buffer3);
        await fs.promises.writeFile(`${dir}/trainer_back_frame_4.png`, buffer4);
        fullFileCount += 4;
        if (frame5) {
            const pngFrame5 = new PNG({ width, height: frameHeight });
            pngFrame5.data = frame5;
            buffer5 = PNG.sync.write(pngFrame5, { 
                filterType: pngFilterType,
                deflateLevel: pngCompressionLevel,
            });
            await fs.promises.writeFile(`${dir}/trainer_back_frame_5.png`, buffer5);
            fullFileCount += 1;
        }
    }

    if (returnFileBuffer) {
        results.push({
            name: `${trainerName}-back-frame1`,
            category: "trainer",
            asset: "frame",
            path: `out/trainers/${trainerName}/back_frame_1`,
            buffer: buffer1,
            meta: {},
        });
        results.push({
            name: `${trainerName}-back-frame2`,
            category: "trainer",
            asset: "frame",
            path: `out/trainers/${trainerName}/back_frame_2`,
            buffer: buffer2,
            meta: {},
        });
        results.push({
            name: `${trainerName}-back-frame3`,
            category: "trainer",
            asset: "frame",
            path: `out/trainers/${trainerName}/back_frame_3`,
            buffer: buffer3,
            meta: {},
        });
        results.push({
            name: `${trainerName}-back-frame4`,
            category: "trainer",
            asset: "frame",
            path: `out/trainers/${trainerName}/back_frame_4`,
            buffer: buffer4,
            meta: {},
        });
        if (frame5) {
            results.push({
                name: `${trainerName}-back-frame5`,
                category: "trainer",
                asset: "frame",
                path: `out/trainers/${trainerName}/back_frame_5`,
                buffer: buffer5,
                meta: {},
            });
        }
    }

    return {
        ...(returnFileBuffer && { results }),
        fullFileCount,
    };
}