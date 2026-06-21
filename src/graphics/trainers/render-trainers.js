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
        outputDir = null,
    } = options;
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderTrainer(..., rom) requires a ROM Buffer/Uint8Array");
    }

    const trainer = trainers[trainerName];
    if (!trainer) {
        throw new Error(`Missing Trainer: ${trainerName}`);
    }
    if (trainerBackPics) {
        const backTrainerName = backTrainers[trainerName]
            ? trainerName
            : false;
        if (backTrainerName) {
            await renderTrainerBackPic(backTrainerName, backTrainers, reader, rom, { outputDir }); // that could have been bad lol I forgot to add await :p
        }
        else if (backTrainerName === false && trainerName === "PAINTER") {
            await renderTrainerBackPic("OLDMAN", backTrainers, reader, rom, { outputDir });
            await renderTrainerBackPic("POKEDUDE", backTrainers, reader, rom, { outputDir });
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
    const pngBuffer = PNG.sync.write(png, { filterType: 0 });

    if (outputDir) {
        const dir = `${outputDir}/${trainerName}`;
        await fs.promises.mkdir(dir, { recursive: true });
        const fileName = `${dir}/trainer_front.png`;
        await fs.promises.writeFile(fileName, pngBuffer);
    }

    return pngBuffer;
}