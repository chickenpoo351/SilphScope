// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { extract } from "../extract.js";
import { render4bppImage } from "../render-4bpp-image.js";
import { PNG } from "pngjs";
import fs from "fs";
import { renderTrainerBackPic } from "./render-trainer-back-pics.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderTrainer(trainerName, trainers, assets, rom, options = {}) {
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
        renderTrainerBackPic(trainerName, trainers, assets, rom, { outputDir });
    }
    if (trainer === "OLDMAN" || trainer === "POKEDUDE") {
        return;
    }
    const trainerPal = assets.find(a => a.name === trainer.Palette);
    const trainerPic = assets.find(a => a.name === trainer.Pic);

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
    const pngBuffer = await streamToBuffer(png.pack());

    if (outputDir) {
        const dir = `${outputDir}/${trainerName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fileName = `${dir}/trainer_front.png`;
        fs.writeFileSync(fileName, pngBuffer);
    }

    return pngBuffer;
}