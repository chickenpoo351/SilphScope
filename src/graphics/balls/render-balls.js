// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import fs from "fs";
import { PNG } from "pngjs";
import { extract } from "../extract.js";
import { render4bppImage } from "../render-4bpp-image.js";
import { resolveBallSpritePal } from "./resolvers/ball-sprite-palette-resolver.js";
import { resolveBallSpritePic } from "./resolvers/ball-sprite-resolver.js";
import { renderBallParticle } from "./render-ball-particle.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
})

const extractFrameFromImage = (imageData, fullWidth, frameData) => {
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

export async function renderBall(ballName, balls, reader, rom, options = {}) {
    const {
        pngFilterType = null,
        pngCompressionLevel = null,
        returnFileBuffer = false,
        outputDir = null,
        ballParticles = false,
        renderMasterBallImage = false,
        renderMasterBallParticleImage = false,
    } = options;
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderBall(..., rom) requires a ROM Buffer/Uint8Array");
    }

    let fullFileCount = 0;
    const results = returnFileBuffer ? [] : null;
    const ball = balls[ballName];
    if (!ball) {
        throw new Error(`Missing Ball: ${ballName}`);
    }
    if (ballParticles) {
        const renderBallParticleData = await renderBallParticle(ballName, balls, reader, rom, {
            pngFilterType,
            pngCompressionLevel,
            returnFileBuffer,
            outputDir,
            renderMasterBallParticleImage,
        });
        fullFileCount += renderBallParticleData.fullFileCount;
        if (returnFileBuffer) {
            results.push(...renderBallParticleData.results);
        }
    }
    const ballPal = resolveBallSpritePal(ball, reader, ballName);
    const ballPic = resolveBallSpritePic(ball, reader, ballName);
    if (!ballPal || !ballPic) {
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
    const pngBuffer = PNG.sync.write(png, {
        filterType: pngFilterType,
        deflateLevel: pngCompressionLevel,
    });

    const dir = `${outputDir}/${ballName}`;
    if (outputDir) {
        await fs.promises.mkdir(dir, { recursive: true });
    }
    if (renderMasterBallImage) {
        if (outputDir) {
            await fs.promises.writeFile(`${dir}/master-image.png`, pngBuffer)
            fullFileCount += 1;
        }
        if (returnFileBuffer) {
            results.push({
                name: `${ballName}-full-sprite`,
                category: "ball",
                asset: "sprite",
                path: `out/balls/${ballName}/master-image`,
                buffer: pngBuffer,
                meta: {
                    particleOrBall: "ball",
                },
            });
        }
    }

    for (let i = 0; i < ball.frames.length; i++) {
        const frame = ball.frames[i];
        const frameImageData = extractFrameFromImage(image, width, frame);

        const png = new PNG({ width: frame.width, height: frame.height });
        png.data = frameImageData;
        const pngFrameBuffer = PNG.sync.write(png, {
            filterType: pngFilterType,
            deflateLevel: pngCompressionLevel,
        });

        if (outputDir) {
            const fileName = `${dir}/frame-${i}.png`;
            await fs.promises.writeFile(fileName, pngFrameBuffer);
            fullFileCount += 1;
        }
        if (returnFileBuffer) {
            results.push({
                name: `${ballName}-frame${1}`,
                category: "ball",
                asset: "frame",
                path: `out/balls/${ballName}/frame-${i}`,
                buffer: pngFrameBuffer,
                meta: {
                    particleOrBall: "ball",
                },
            });
        }
    }

    return {
        ...(returnFileBuffer && { results }),
        fullFileCount,
    };
}