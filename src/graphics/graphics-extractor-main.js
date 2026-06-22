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
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllMons(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        mons: providedMons = mons,
        outputDir = "./out",
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        icon = true,
        footprint = true,
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllMons(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllMons(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllMons(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedMons), concurrency, async (monName) => { // so in theory we should be running the function 4 times concurrently now...
            await renderMon(monName, providedMons, reader, rom, {
                side: ["front", "back"],
                variant: ["normal", "shiny"],
                icon,
                footprint,
                pngFilterType,
                pngCompressionLevel,
                outputDir,
            });
            console.log(`Done: ${monName}`);
        });
    } else {
        for (const monName of Object.keys(providedMons)) {
            await renderMon(monName, providedMons, reader, rom, {
                side: ["front", "back"],
                variant: ["normal", "shiny"],
                icon,
                footprint,
                pngFilterType,
                pngCompressionLevel,
                outputDir,
            });
            console.log(`Done: ${monName}`);
        }
    }
}

export async function renderAllIcons(rom, options = {}) {
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllIcons(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        icons: providedIcons = icons,
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        outputDir = "./out",
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllIcons(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllIcons(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllIcons(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedIcons), concurrency, async (itemName) => {
            await renderIcon(itemName, providedIcons, reader, rom, { 
                pngFilterType,
                pngCompressionLevel,
                outputDir,
            });
            console.log(`Done: ${itemName}`);
        });
    } else {
        for (const itemName of Object.keys(providedIcons)) {
            await renderIcon(itemName, providedIcons, reader, rom, { 
                pngFilterType,
                pngCompressionLevel,
                outputDir,
            });
            console.log(`Done: ${itemName}`);
        }
    }
}

export async function renderAllTrainers(rom, options = {}) {
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
        outputDir = "./out",
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllTrainers(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllTrainers(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllTrainers(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedTrainers), concurrency, async (trainerName) => {
            await renderTrainer(trainerName, providedTrainers, providedBackTrainers, reader, rom, {
                trainerBackPics,
                pngFilterType,
                pngCompressionLevel,
                outputDir
            });
            console.log(`Done: ${trainerName}`);
        });
    } else {
        for (const trainerName of Object.keys(providedTrainers)) {
            await renderTrainer(trainerName, providedTrainers, providedBackTrainers, reader, rom, {
                trainerBackPics,
                pngFilterType,
                pngCompressionLevel,
                outputDir
            });
            console.log(`Done: ${trainerName}`);
        }
    }
}

export async function renderAllMoves(rom, options = {}) {
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllMoves(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        moves: providedMoves = moves,
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        outputDir = "./out",
        renderMasterImage = true,
        sortUnused = true,
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllMoves(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllMoves(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllMoves(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedMoves), concurrency, async (moveName) => {
            await renderMove(moveName, providedMoves, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                outputDir,
                renderMasterImage,
                sortUnused,
            });
            console.log(`Done: ${moveName}`);
        });
    } else {
        for (const moveName of Object.keys(providedMoves)) {
            await renderMove(moveName, providedMoves, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                outputDir,
                renderMasterImage,
                sortUnused,
            });
            console.log(`Done: ${moveName}`);
        }
    }
}

export async function renderAllBalls(rom, options = {}) {
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllBalls(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        balls: providedBalls = balls,
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
        outputDir = "./out",
        ballParticles = true,
        renderMasterBallImage = true,
        renderMasterBallParticleImage = true,
    } = options;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
        throw new TypeError(`renderAllBalls(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (recieved ${concurrency})`);
    }
    if (isValidFilterType(pngFilterType)) {
        throw new TypeError(`renderAllBalls(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new TypeError(`renderAllBalls(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    if (concurrency > 1) {
        await mapLimit(Object.keys(providedBalls), concurrency, async (ballName) => {
            await renderBall(ballName, providedBalls, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                outputDir,
                ballParticles,
                renderMasterBallImage,
                renderMasterBallParticleImage,
            });
            console.log(`Done: ${ballName}`);
        })
    } else {
        for (const ballName of Object.keys(providedBalls)) {
            await renderBall(ballName, providedBalls, reader, rom, {
                pngFilterType,
                pngCompressionLevel,
                outputDir,
                ballParticles,
                renderMasterBallImage,
                renderMasterBallParticleImage,
            });
            console.log(`Done: ${ballName}`);
        }
    }
}

export async function renderAllGraphics(rom, options = {}) { // eventually I will speed this up instead of doing it sequentially :p but for now its fine I guess
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllGraphics(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        concurrency = 4,
        pngFilterType = 0,
        pngCompressionLevel = 4,
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
    if (isValidFilterType(pngFilterType)) {
        throw new Error(`renderAllGraphics(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${pngFilterType})`)
    }
    if (!Number.isInteger(pngCompressionLevel) || pngCompressionLevel < 0 || pngCompressionLevel > 9) {
        throw new Error(`renderAllGraphics(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${pngCompressionLevel})`)
    }

    await renderAllMons(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        outputDir: outputMonDir,
        icon: true,
        footprint: true,
    });

    await renderAllIcons(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        outputDir: outputIconDir,
    });

    await renderAllTrainers(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        outputDir: outputTrainerDir,
        trainerBackPics: true,
    });

    await renderAllMoves(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        outputDir: outputMoveDir,
        renderMasterImage: true,
        sortUnused: sortUnusedMoves,
    });

    await renderAllBalls(rom, {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
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