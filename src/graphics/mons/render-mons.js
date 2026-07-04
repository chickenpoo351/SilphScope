// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { PNG } from "pngjs";
import fs from "fs";
import { extract } from "../extract.js";
import { renderMonIcon } from "./render-mon-icon.js";
import { renderMonFoot } from "./render-mon-foot.js";
import { render4bppImage } from "../render-4bpp-image.js";
import { resolveMonSprite } from "./resolvers/mon-sprite-resolver.js";
import { resolveMonPalette } from "./resolvers/mon-sprite-palette-resolver.js";

const streamToBuffer = (stream) => new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", chunk => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
});

export async function renderMon(monName, mons, reader, rom, options = {}) {
    const {
        side = "front",
        variant = "normal",
        icon = false,
        footprint = false,
        pngFilterType = null,
        pngCompressionLevel = null,
        returnFileBuffer = false,
        outputDir = null,
    } = options;

    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderMon(..., rom) requires a ROM Buffer/Uint8Array");
    }

    let fullFileCount = 0;
    const sides = Array.isArray(side) ? side : [side];
    const variants = Array.isArray(variant) ? variant : [variant];
    const results = returnFileBuffer? [] : null;

    if (icon === true) {
        const monIconData = await renderMonIcon(monName, mons, reader, rom, {
            pngFilterType,
            pngCompressionLevel,
            returnFileBuffer,
            outputDir,
        });
        fullFileCount += monIconData.fullFileCount;
        if (returnFileBuffer) {
            results.push(...monIconData.results);
        }
    }
    if (footprint === true) {
        const monFootData = await renderMonFoot(monName, mons, reader, rom, {
            pngFilterType,
            pngCompressionLevel,
            returnFileBuffer,
            outputDir,
        });
        fullFileCount += monFootData.fullFileCount;
        if (returnFileBuffer && monFootData.results) {
            results.push(...monFootData.results);
        }
    }

    const mon = mons[monName];
    if (!mon) {
        throw new Error(`Missing mon: ${monName}`);
    }

    const picCache = {};
    const palCache = {};
    for (const side of sides) {
        const monPic = resolveMonSprite(mon, reader, monName, side);
        if (!monPic) throw new Error(`Missing sprite data for: ${monName} ${side}`);
        picCache[side] = extract(monPic, rom).data;
    }
    for (const variant of variants) {
        const monPal = resolveMonPalette(mon, reader, monName, variant);
        if (!monPal) throw new Error(`Missing palette data for: ${monName} ${variant}`);
        palCache[variant] = extract(monPal, rom).data;
    }

    const width = 64;
    const height = 64;
    if (outputDir) {
        const dir = `${outputDir}/${monName}`; // why do I forget the simplest things...
        await fs.promises.mkdir(dir, { recursive: true }); // why was I using existsSync... eh well "fixed?" now I guess... also I moved this out of the loop as you can see so it only has to run... 440 times now... instead of 4x that number :p
    }
    for (const side of sides) {
        for (const variant of variants) {
            const image = render4bppImage({
                tileData: picCache[side],
                paletteData: palCache[variant],
                width,
                height,
            });

            const png = new PNG({ width, height });
            png.data = image;
            const pngBuffer = PNG.sync.write(png, {
                filterType: pngFilterType,
                deflateLevel: pngCompressionLevel,
            });

            if (outputDir) {
                const dir = `${outputDir}/${monName}`;
                const fileName = `${dir}/${side}${variant === "shiny" ? "_shiny" : ""}.png`;
                await fs.promises.writeFile(fileName, pngBuffer);
                fullFileCount += 1;
            }

            if (returnFileBuffer) {
                results.push({
                    name: `${monName}-${variant === "shiny"? "shiny" : "normal"}-${side}-sprite`,
                    category: "mon",
                    asset: "sprite",
                    path: `out/mons/${monName}/${side}_${variant === "shiny"? "shiny" : "normal"}`,
                    buffer: pngBuffer,
                    meta: {
                        side: side,
                        variant: variant,
                    },
                });
            }
        }
    }

    return { 
        ...(returnFileBuffer && { results }),
        fullFileCount,
    }
}