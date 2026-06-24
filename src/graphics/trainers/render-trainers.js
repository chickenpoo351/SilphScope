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
                results.push({
                    name: `${trainerName}-back-frame1`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/${trainerName}/back_frame_1`,
                    buffer: trainerBackPicData.frame1,
                    meta: { },
                });
                results.push({
                    name: `${trainerName}-back-frame2`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/${trainerName}/back_frame_2`,
                    buffer: trainerBackPicData.frame2,
                    meta: { },
                });
                results.push({
                    name: `${trainerName}-back-frame3`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/${trainerName}/back_frame_3`,
                    buffer: trainerBackPicData.frame3,
                    meta: { },
                });
                results.push({
                    name: `${trainerName}-back-frame4`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/${trainerName}/back_frame_4`,
                    buffer: trainerBackPicData.frame4,
                    meta: { },
                });
                if (trainerBackPicData?.frame5) {
                    results.push({
                        name: `${trainerName}-back-frame5`,
                        category: "trainer",
                        asset: "frame",
                        path: `out/trainers/${trainerName}/back_frame_5`,
                        buffer: trainerBackPicData.frame5,
                        meta: { },
                    });
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
                results.push({
                    name: `OLDMAN-back-frame1`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/OLDMAN/back_frame_1`,
                    buffer: trainerBackPicData.frame1,
                    meta: { },
                });
                results.push({
                    name: `OLDMAN-back-frame2`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/OLDMAN/back_frame_2`,
                    buffer: trainerBackPicData.frame2,
                    meta: { },
                });
                results.push({
                    name: `OLDMAN-back-frame3`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/OLDMAN/back_frame_3`,
                    buffer: trainerBackPicData.frame3,
                    meta: { },
                });
                results.push({
                    name: `OLDMAN-back-frame4`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/OLDMAN/back_frame_4`,
                    buffer: trainerBackPicData.frame4,
                    meta: { },
                });
            }
            const trainerBackPicData2 = await renderTrainerBackPic("POKEDUDE", backTrainers, reader, rom, { 
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
            });
            fullFileCount += trainerBackPicData2.fileCount;
            if (returnFileBuffer) {
                results.push({
                    name: `POKEDUDE-back-frame1`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/POKEDUDE/back_frame_1`,
                    buffer: trainerBackPicData.frame1,
                    meta: { },
                });
                results.push({
                    name: `POKEDUDE-back-frame2`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/POKEDUDE/back_frame_2`,
                    buffer: trainerBackPicData.frame2,
                    meta: { },
                });
                results.push({
                    name: `POKEDUDE-back-frame3`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/POKEDUDE/back_frame_3`,
                    buffer: trainerBackPicData.frame3,
                    meta: { },
                });
                results.push({
                    name: `POKEDUDE-back-frame4`,
                    category: "trainer",
                    asset: "frame",
                    path: `out/trainers/POKEDUDE/back_frame_4`,
                    buffer: trainerBackPicData.frame4,
                    meta: { },
                }); // I have to think of a way to make this shorter... but thats for later I guess :p
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
        results.push({
            name: `${trainerName}-front-sprite`,
            category: "trainer",
            asset: "sprite",
            path: `out/trainers/${trainerName}/front`,
            buffer: pngBuffer,
            meta: {
                side: "front" // now some of you may be wondering why I added this... well it's because eventually I want you to be able to make a master image of the back sprites so we need to be able to differentiate the buffers here... anyway that was a long explanation :p
            },
        });
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