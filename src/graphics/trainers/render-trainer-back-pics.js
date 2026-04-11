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
    const frame2 = image.slice(frameSize, frameSize * 2);
    const frame3 = image.slice(frameSize, frameSize * 3);
    const frame4 = image.slice(frameSize, frameSize * 4);
    const frame5 = (trainerName === "RED" || trainerName === "LEAF")
        ? image.slice(frameSize, frameSize * 5)
        : null;
    const pngFrame1 = new PNG({ width, height: frameHeight });
    pngFrame1.data = frame1;
    const pngFrame2 = new PNG({ width, height: frameHeight });
    pngFrame2.data = frame2;
    const pngFrame3 = new PNG({ width, height: frameHeight });
    pngFrame3.data = frame3;
    const pngFrame4 = new PNG({ width, height: frameHeight });
    pngFrame4.data = frame4;
    const buffer1 = await streamToBuffer(pngFrame1.pack());
    const buffer2 = await streamToBuffer(pngFrame2.pack());
    const buffer3 = await streamToBuffer(pngFrame3.pack());
    const buffer4 = await streamToBuffer(pngFrame4.pack());
    let buffer5

    if (outputDir) {
        const dir = `${outputDir}/${trainerName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(`${dir}/trainer_back_frame_1.png`, buffer1);
        fs.writeFileSync(`${dir}/trainer_back_frame_2.png`, buffer2);
        fs.writeFileSync(`${dir}/trainer_back_frame_3.png`, buffer3);
        fs.writeFileSync(`${dir}/trainer_back_frame_4.png`, buffer4);
        if (frame5) {
            const pngFrame5 = new PNG({ width, height: frameHeight });
            pngFrame5.data = frame5;
            buffer5 = await streamToBuffer(pngFrame5.pack());
            fs.writeFileSync(`${dir}/trainer_back_frame_5.png`, buffer5);
        }
    }

    return {
        frame1: buffer1,
        frame2: buffer2,
        frame3: buffer3,
        frame4: buffer4,
        frame5: buffer5,
    };
}