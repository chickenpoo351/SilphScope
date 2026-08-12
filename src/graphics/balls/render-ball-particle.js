// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import fs from "fs";
import { PNG } from "pngjs";
import { extract } from "../extract.js";
import { render4bppImage } from "../render-4bpp-image.js";
import { resolveBallParticlePic } from "./resolvers/ball-particle-resolver.js";
import { resolveBallParticlePal } from "./resolvers/ball-particle-palette-resolver.js";

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

export async function renderBallParticle(ballName, balls, reader, rom, options = {}) {
    const {
        pngFilterType = null,
        pngCompressionLevel = null,
        returnFileBuffer = false,
        outputDir = null,
        renderMasterBallParticleImage = false,
    } = options;
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderBallParticle(..., rom) requires a ROM Buffer/Uint8Array");
    }

    let fullFileCount = 0;
    const results = returnFileBuffer ? [] : null;
    const ball = balls[ballName];
    if (!ball) {
        throw new Error(`Missing Ball: ${ballName}`);
    }
    const particlePic = resolveBallParticlePic(ball, reader, ballName);
    const particlePal = resolveBallParticlePal(ball, reader, ballName);

    if (!particlePic || !particlePal) {
        throw new Error(`Missing assets for: ${ballName}`);
    }

    const particleImageData = extract(particlePic, rom);
    const rawParticlePalData = extract(particlePal, rom);
    const width = 8; // so actually the "particle image" is one image that just contains all of the particles used for the balls upon opening later on I will split the ones actually used by each ball so we aren't exporting a full redundant image :p
    const height = 64;

    const image = render4bppImage({
        tileData: particleImageData.data,
        paletteData: rawParticlePalData.data,
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
    if (renderMasterBallParticleImage) {
        if (outputDir) {
            await fs.promises.writeFile(`${dir}/master-particle.png`, pngBuffer);
            fullFileCount += 1;
        }
        if (returnFileBuffer) {
            results.push({
                name: `${ballName}`,
                id: `${ballName}-particle-full-sprite`,
                category: "ball",
                asset: "sprite",
                path: `out/balls/${ballName}/master-particle`,
                buffer: pngBuffer,
                meta: {
                    particleOrBall: "particle",
                },
            });
        }
    }
    for (let i = 0; i < ball.particleFrames.length; i++) {
        const frame = ball.particleFrames[i];
        const frameImageData = extractFrameFromImage(image, width, frame);

        const png = new PNG({ width: frame.width, height: frame.height });
        png.data = frameImageData;
        const pngFrameBuffer = PNG.sync.write(png, {
            filterType: pngFilterType,
            deflateLevel: pngCompressionLevel,
        });

        if (outputDir) {
            const fileName = `${dir}/particle-${i}.png`;
            fs.writeFileSync(fileName, pngFrameBuffer);
            fullFileCount += 1;
        }
        if (returnFileBuffer) {
            results.push({
                name: `${ballName}`,
                id: `${ballName}-particle-frame${i}`,
                category: "ball",
                asset: "frame",
                path: `out/balls/${ballName}/particle-${i}`,
                buffer: pngFrameBuffer,
                meta: {
                    frame: i,
                    particleOrBall: "particle",
                },
            });
        }
    }

    return {
        ...(returnFileBuffer && { results }),
        fullFileCount,
    };
}