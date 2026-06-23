// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { mapLimit } from "../map-limit.js";
import { renderMon } from "./mons/render-mons.js";
import { renderIcon } from "./icons/render-icons.js";
import { renderTrainer } from "./trainers/render-trainers.js";
import { RomReader } from "../rom-reader.js";
import { getRomConfig } from "../get-rom-config.js";
import { renderMove } from "./moves/render-moves.js";
import { renderBall } from "./balls/render-balls.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function loadDefaultJson(relativePath) {
    const absolutePath = path.join(currentDir, "..", relativePath);
    return JSON.parse(fs.readFileSync(absolutePath, "utf-8"));
}

const mons = loadDefaultJson("../mon-data/monData.json");
const icons = loadDefaultJson("../item-data/itemData.json");
const trainers = loadDefaultJson("../trainer-data/trainerData.json");
const trainersBack = loadDefaultJson("../trainer-data/trainerBackData.json");
const moves = loadDefaultJson("../move-data/moveData.json");
const balls = loadDefaultJson("../ball-data/ballData.json");

function isValidFilterType(filterTypeValue) {
    if (Number.isInteger(filterTypeValue)) {
        return filterTypeValue >= -1 && filterTypeValue <= 4;
    }
    if (Array.isArray(filterTypeValue)) {
        return filterTypeValue.length > 0 && filterTypeValue.every(entry => 
            Number.isInteger(entry) && entry >= 0 && entry <= 4
        );
    }

    return false;
}

export async function renderAllMons(rom, options = {}) {
    const start = performance.now();
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllMons(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        mons: providedMons = mons,
        outputDir = "./out",
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        verboseLogs = true,
        showSummary = true,
        returnFileBuffer = false,
        icon = true,
        footprint = true,
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllMons(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (!isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllMons(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllMons(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedMons), concurrency, async (monName) => { // so in theory we should be running the function 4 times concurrently now...
            const renderMonData = await renderMon(monName, providedMons, reader, rom, {
                side: ["front", "back"],
                variant: ["normal", "shiny"],
                icon,
                footprint,
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
            });
            if (verboseLogs) {
                console.log(`Done: ${monName}`);
            }
            totalFileCount += renderMonData.fullFileCount;
            if (returnFileBuffer && renderMonData?.results) {
                finalResults.push(...renderMonData.results);
            }
        });
    } else {
        for (const monName of Object.keys(providedMons)) {
            const renderMonData = await renderMon(monName, providedMons, reader, rom, {
                side: ["front", "back"],
                variant: ["normal", "shiny"],
                icon,
                footprint,
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
            });
            if (verboseLogs) {
                console.log(`Done: ${monName}`);
            }
            totalFileCount += renderMonData.fullFileCount;
            if (returnFileBuffer) {
                finalResults.push(...renderMonData.results);
            }
        }
    }

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    if (showSummary) {
        console.log(`
renderAllMons() Output Summary:
Rendered ${Object.keys(providedMons).length} Mons amounting to:
${totalFileCount} Files written
Done in ${elapsed}s with SilphScope`);
    }

    return {
        totalFileCount,
        ...(returnFileBuffer && { finalResults }),
    };
}

export async function renderAllIcons(rom, options = {}) {
    const start = performance.now();
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllIcons(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        icons: providedIcons = icons,
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        verboseLogs = true,
        showSummary = true,
        returnFileBuffer = false,
        outputDir = "./out",
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllIcons(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (!isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllIcons(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllIcons(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedIcons), concurrency, async (itemName) => {
            const renderIconData = await renderIcon(itemName, providedIcons, reader, rom, { 
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
            });
            if (verboseLogs) {
                console.log(`Done: ${itemName}`);
            }
            totalFileCount += renderIconData.fullFileCount;
            if (returnFileBuffer && renderIconData?.pngBuffer) {
                finalResults.push(renderIconData.pngBuffer);
            }
        });
    } else {
        for (const itemName of Object.keys(providedIcons)) {
            const renderIconData = await renderIcon(itemName, providedIcons, reader, rom, { 
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
            });
            if (verboseLogs) {
                console.log(`Done: ${itemName}`);
            }
            totalFileCount += renderIconData.fullFileCount;
            if (returnFileBuffer && renderIconData?.pngBuffer) {
                finalResults.push(renderIconData.pngBuffer);
            }
        }
    }

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    if (showSummary) {
        console.log(`
renderAllIcons() Output Summary:
Rendered ${Object.keys(providedIcons).length} Icons amounting to:
${totalFileCount} Files written
Done in ${elapsed}s with SilphScope`);
    }

    return {
        totalFileCount,
        ...(returnFileBuffer && { finalResults }),
    };
}

export async function renderAllTrainers(rom, options = {}) {
    const start = performance.now();
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllTrainers(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        trainers: providedTrainers = trainers,
        trainersBack: providedBackTrainers = trainersBack,
        trainerBackPics = true,
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        verboseLogs = true,
        showSummary = true,
        returnFileBuffer = false,
        outputDir = "./out",
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllTrainers(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (!isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllTrainers(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllTrainers(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedTrainers), concurrency, async (trainerName) => {
            const renderTrainerData = await renderTrainer(trainerName, providedTrainers, providedBackTrainers, reader, rom, {
                trainerBackPics,
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir
            });
            if (verboseLogs) {
                console.log(`Done: ${trainerName}`);
            }
            totalFileCount += renderTrainerData.fullFileCount;
            if (returnFileBuffer && renderTrainerData?.results) {
                finalResults.push(...renderTrainerData.results);
            }
        });
    } else {
        for (const trainerName of Object.keys(providedTrainers)) {
            const renderTrainerData = await renderTrainer(trainerName, providedTrainers, providedBackTrainers, reader, rom, {
                trainerBackPics,
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir
            });
            if (verboseLogs) {
                console.log(`Done: ${trainerName}`);
            }
            totalFileCount += renderTrainerData.fullFileCount;
            if (returnFileBuffer && renderTrainerData?.results) {
                finalResults.push(...renderTrainerData.results);
            }
        }
    }

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    if (showSummary) {
        console.log(`
renderAllTrainers() Output Summary:
Rendered ${Object.keys(providedTrainers).length} Trainers amounting to:
${totalFileCount} Files written
Done in ${elapsed}s with SilphScope`);
    }

    return {
        ...(returnFileBuffer && { finalResults }),
        totalFileCount,
    };
}

export async function renderAllMoves(rom, options = {}) {
    const start = performance.now();
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllMoves(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        moves: providedMoves = moves,
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        verboseLogs = true,
        showSummary = true,
        returnFileBuffer = false,
        outputDir = "./out",
        renderMasterImage = true,
        sortUnused = true,
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllMoves(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (!isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllMoves(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllMoves(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedMoves), concurrency, async (moveName) => {
            const renderMoveData = await renderMove(moveName, providedMoves, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
                renderMasterImage,
                sortUnused,
            });
            if (verboseLogs) {
                console.log(`Done: ${moveName}`);
            }
            totalFileCount += renderMoveData.fullFileCount;
            if (returnFileBuffer && renderMoveData?.results) {
                finalResults.push(...renderMoveData.results);
            }
        });
    } else {
        for (const moveName of Object.keys(providedMoves)) {
            const renderMoveData = await renderMove(moveName, providedMoves, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
                renderMasterImage,
                sortUnused,
            });
            if (verboseLogs) {
                console.log(`Done: ${moveName}`);
            }
            totalFileCount += renderMoveData.fullFileCount;
            if (returnFileBuffer && renderMoveData?.results) {
                finalResults.push(...renderMoveData.results);
            }
        }
    }

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    if (showSummary) {
        console.log(`
renderAllMoves() Output Summary:
Rendered ${Object.keys(providedMoves).length} Moves amounting to:
${totalFileCount} Files written
Done in ${elapsed}s with SilphScope`);
    }

    return {
        ...(returnFileBuffer && { finalResults }),
        totalFileCount,
    }
}

export async function renderAllBalls(rom, options = {}) {
    const start = performance.now();
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllBalls(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        balls: providedBalls = balls,
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        verboseLogs = true,
        showSummary = true,
        returnFileBuffer = false,
        outputDir = "./out",
        ballParticles = true,
        renderMasterBallImage = true,
        renderMasterBallParticleImage = true,
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllBalls(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (!isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllBalls(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllBalls(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedBalls), concurrency, async (ballName) => {
            const renderBallData = await renderBall(ballName, providedBalls, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
                ballParticles,
                renderMasterBallImage,
                renderMasterBallParticleImage,
            });
            if (verboseLogs) {
                console.log(`Done: ${ballName}`);
            }
            totalFileCount += renderBallData.fullFileCount;
            if (returnFileBuffer) {
                finalResults.push(...renderBallData.results);
            }
        })
    } else {
        for (const ballName of Object.keys(providedBalls)) {
            const renderBallData = await renderBall(ballName, providedBalls, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                returnFileBuffer,
                outputDir,
                ballParticles,
                renderMasterBallImage,
                renderMasterBallParticleImage,
            });
            if (verboseLogs) {
                console.log(`Done: ${ballName}`);
            }
            totalFileCount += renderBallData.fullFileCount;
            if (returnFileBuffer) {
                finalResults.push(...renderBallData.results);
            }
        }
    }

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);

    if (showSummary) {
        console.log(`
renderAllBalls() Output Summary:
Rendered ${Object.keys(providedBalls).length} Balls amounting to:
${totalFileCount} Files written
Done in ${elapsed}s with SilphScope`);
    }

    return {
        ...(returnFileBuffer && { finalResults }),
        totalFileCount,
    };
}

export async function renderAllGraphics(rom, options = {}) { // eventually I will speed this up instead of doing it sequentially :p but for now its fine I guess
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllGraphics(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        verboseLogs = true,
        showSummary = true,
        returnFileBuffer = false,
        outputMonDir = "./out/mons",
        outputIconDir = "./out/icons",
        outputTrainerDir = "./out/trainers",
        outputMoveDir = "./out/moves",
        sortUnusedMoves = true,
        outputBallDir = "./out/balls",
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllGraphics(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (!isValidFilterType(pngFilterType)) {
        throw new Error(`renderAllGraphics(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new Error(`renderAllGraphics(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    await renderAllMons(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        verboseLogs,
        showSummary,
        returnFileBuffer,
        outputDir: outputMonDir,
        icon: true,
        footprint: true,
    });

    await renderAllIcons(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        verboseLogs,
        showSummary,
        returnFileBuffer,
        outputDir: outputIconDir,
    });

    await renderAllTrainers(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        verboseLogs,
        showSummary,
        returnFileBuffer,
        outputDir: outputTrainerDir,
        trainerBackPics: true,
    });

    await renderAllMoves(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        verboseLogs,
        showSummary,
        returnFileBuffer,
        outputDir: outputMoveDir,
        renderMasterImage: true,
        sortUnused: sortUnusedMoves,
    });

    await renderAllBalls(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        verboseLogs,
        showSummary,
        returnFileBuffer,
        outputDir: outputBallDir,
        ballParticles: true,
        renderMasterBallImage: true,
        renderMasterBallParticleImage: true,
    });
}

export function loadDefaultRom() {
    const romPath = path.resolve(process.cwd(), "../../pokefirered.gba");
    return fs.readFileSync(romPath);
}