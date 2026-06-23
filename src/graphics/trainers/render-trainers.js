// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { extract } from "../extract.js";
import { render4bppImage } from "../render-4bpp-image.js";
import { PNG } from "pngjs";
import fs from "fs";
import { renderTrainerBackPic } from "./render-trainer-back-pics.js";
import { resolveTrainerFrontPic } from "./resolvers/trainer-front-pic-resolver.js";
import { resolveTrainerFrontPicPal } from "./resolvers/trainer-front-pic-pal-resolver.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderTrainer(trainerName, trainers, backTrainers, reader, rom, options = {}) {
    const {
        trainerBackPics = false,
        pngFilterType = null,
        pngCompressionLevel = null,
        returnFileBuffer = false,
        outputDir = null,
    } = options;
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderTrainer(..., rom) requires a ROM Buffer/Uint8Array");
    }

    let fullFileCount = 0;
    let results = returnFileBuffer? [] : null;
    const trainer = trainers[trainerName];
    if (!trainer) {
        throw new Error(`Missing Trainer: ${trainerName}`);
    }
    if (trainerBackPics) {
        const backTrainerName = backTrainers[trainerName]
            ? trainerName
            : false;
        if (backTrainerName) {
            const trainerBackPicData = await renderTrainerBackPic(backTrainerName, backTrainers, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
            });
            fullFileCount += trainerBackPicData.fileCount;
            if (returnFileBuffer) {
                results.push(trainerBackPicData.frame1);
                results.push(trainerBackPicData.frame2);
                results.push(trainerBackPicData.frame3);
                results.push(trainerBackPicData.frame4);
                if (trainerBackPicData?.frame5) {
                    results.push(trainerBackPicData.frame5);
                }
            }
        }
        else if (backTrainerName === false && trainerName === "PAINTER") {
            const trainerBackPicData = await renderTrainerBackPic("OLDMAN", backTrainers, reader, rom, { 
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
            });
            fullFileCount += trainerBackPicData.fileCount;
            if (returnFileBuffer) {
                results.push(trainerBackPicData.frame1);
                results.push(trainerBackPicData.frame2);
                results.push(trainerBackPicData.frame3);
                results.push(trainerBackPicData.frame4);
            }
            const trainerBackPicData2 = await renderTrainerBackPic("POKEDUDE", backTrainers, reader, rom, { 
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
            });
            fullFileCount += trainerBackPicData2.fileCount;
            if (returnFileBuffer) {
                results.push(trainerBackPicData.frame1);
                results.push(trainerBackPicData.frame2);
                results.push(trainerBackPicData.frame3);
                results.push(trainerBackPicData.frame4);
            }
        }
    }
    const trainerPal = resolveTrainerFrontPicPal(trainer, reader, trainerName);
    const trainerPic = resolveTrainerFrontPic(trainer, reader, trainerName);

    if (!trainerPal || !trainerPic) {
        throw new Error(`Missing assets for: ${trainerName}`);
    }

    const trainerImageData = extract(trainerPic, rom);
    const rawTrainerPalData = extract(trainerPal, rom);
    const width = 64;
    const height = 64;

    const image = render4bppImage({
        tileData: trainerImageData.data,
        paletteData: rawTrainerPalData.data,
        width,
        height
    });

    const png = new PNG({ width, height });
    png.data = image;
    const pngBuffer = PNG.sync.write(png, { 
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel, 
    });

    if (returnFileBuffer) {
        results.push(pngBuffer);
    }

    if (outputDir) {
        const dir = `${outputDir}/${trainerName}`;
        await fs.promises.mkdir(dir, { recursive: true });
        const fileName = `${dir}/trainer_front.png`;
        await fs.promises.writeFile(fileName, pngBuffer);
        fullFileCount += 1;
    }

    return {
        ...(returnFileBuffer && { results }),
        fullFileCount,
    };
}