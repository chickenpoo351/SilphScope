// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import fs from "fs";
import { PNG } from "pngjs";
import { extract } from "../extract.js";
import { render4bppImage } from "../render-4bpp-image.js";
import { resolveBallSpritePal } from "./resolvers/ball-sprite-palette-resolver.js";
import { resolveBallSpritePic } from "./resolvers/ball-sprite-resolver.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = {};
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
})

export async function renderBall(ballName, balls, reader, rom, options = {}) {
    const {
        outputDir = null
    } = options;
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderBall(..., rom) requires a ROM Buffer/Uint8Array");
    }

    const ball = balls[ballName];
    if (!ball) {
        throw new Error(`Missing Ball: ${ballName}`);
    }
    const ballPal = resolveBallSpritePal(ball, reader, ballName);
    const ballPic = resolveBallSpritePic(ball, reader, ballName);
    if(!ballPal || !ballPic) {
        throw new Error(`Missing assets for: ${ballName}`);
    }

    const ballImageData = extract(ballPic, rom);
    const rawBallPalData = extract(ballPal, rom);
    const width = 16;
    const height = 48;

    const image = render4bppImage({
        tileData: ballImageData.data,
        paletteData: rawBallPalData.data,
        width,
        height,
    });

    const png = new PNG({ width, height });
    png.data = image;
    const pngBuffer = streamToBuffer(png.pack());

    if (outputDir) {
        const dir = `${outputDir}/${ballName}`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const fileName = `${dir}/ball.png`;
        fs.writeFileSync(fileName, pngBuffer);
    }

    return pngBuffer;
}