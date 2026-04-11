// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { PNG } from "pngjs";
import fs from "fs";
import { extract } from "../extract.js";
import { render4bppImage } from "../render-4bpp-image.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderTrainerBackPic(trainerName, trainers, assets, rom, options = {}) {
    const { outputDir = null } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderTrainerBackPic(..., rom) requires a ROM Buffer/Uint8Array");
    }

    const trainer = trainers[trainerName];
    if (!trainer) {
        throw new Error(`Missing trainer entry for ${trainerName}`);
    }

    if (trainerName !== "OLDMAN" &&
        trainerName !== "POKEDUDE" &&
        trainerName !== "RS_BRENDAN_1" &&
        trainerName !== "RS_BRENDAN_2" &&
        trainerName !== "RS_MAY_1" &&
        trainerName !== "RS_MAY_2" && // I wonder if there is a more compact way to write this without using a array and `.includes` 
        trainerName !== "RED" &&
        trainerName !== "LEAF"
    ) {
        return;
    }

    const trainerBackPic = assets.find(a => a.name === trainer.BackPic);
    const trainerBackPal = assets.find(a => a.name === trainer.BackPal);
    if (!trainerBackPic || !trainerBackPal) {
        throw new Error(`Missing assets for: ${trainerName}`);
    }

    const trainerBackImageData = extract(trainerBackPic, rom);
    const rawTrainerBackPalData = extract(trainerBackPal, rom);
    const width = 64;
    let height;
    if (trainer === "RED" || trainer === "LEAF") {
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

    const png = new PNG({ width, height });
    png.data = image;
    const pngBuffer = await streamToBuffer(png.pack());

    if (outputDir) {
        const dir = `${outputDir}/${trainerName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fileName = `${dir}/trainer_back.png`;
        fs.writeFileSync(fileName, pngBuffer);
    }

    return pngBuffer;
}