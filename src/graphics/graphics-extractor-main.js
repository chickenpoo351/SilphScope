// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderMon } from "./mons/render-mons.js";
import { renderIcon } from "./icons/render-icons.js";
import { renderTrainer } from "./trainers/render-trainers.js";
import { RomReader } from "../rom-reader.js";
import { getRomConfig } from "../get-rom-config.js";
import { renderMove } from "./moves/render-moves.js";

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

export async function renderAllMons(rom, options = {}) {
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllMons(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        mons: providedMons = mons,
        outputDir = "./out",
        icon = true,
        footprint = true,
    } = options;

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    for (const monName of Object.keys(providedMons)) {
        await renderMon(monName, providedMons, reader, rom, { // hopefully this is faster since we are no longer calling the function 4 times lol
            side: ["front", "back"],
            variant: ["normal", "shiny"],
            icon,
            footprint,
            outputDir,
        });
        console.log(`Done: ${monName}`);
    }
}

export async function renderAllIcons(rom, options = {}) {
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllIcons(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        icons: providedIcons = icons,
        outputDir = "./out",
    } = options;

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    for (const itemName of Object.keys(providedIcons)) {
        await renderIcon(itemName, providedIcons, reader, rom, { outputDir });
        console.log(`Done: ${itemName}`);
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
        outputDir = "./out",
    } = options;

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    for (const trainerName of Object.keys(providedTrainers)) {
        await renderTrainer(trainerName, providedTrainers, providedBackTrainers, reader, rom, {
            trainerBackPics, 
            outputDir 
        });
        console.log(`Done: ${trainerName}`);
    }
}

export async function renderAllMoves(rom, options = {}) {
    const {
        moves: providedMoves = moves,
        outputDir = "./out",
    } = options;

    fs.mkdirSync(outputDir, { recursive: true });

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);

    for (const moveName of Object.keys(providedMoves)) {
        await renderMove(moveName, providedMoves, reader, rom, { outputDir });
        console.log(`Done: ${moveName}`);
    }
}

export async function renderAllGraphics(rom, options = {}) { // eventually I will speed this up instead of doing it sequentially :p but for now its fine I guess
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllGraphics(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        outputMonDir = "./out/mons",
        outputIconDir = "./out/icons",
        outputTrainerDir = "./out/trainers",
        outputMoveDir = "./out/moves"
    } = options;

    await renderAllMons(rom, {
        outputDir: outputMonDir,
        icon: true,
        footprint: true,
    });
    
    await renderAllIcons(rom, {
        outputDir: outputIconDir,
    });

    await renderAllTrainers(rom, {
        outputDir: outputTrainerDir,
        trainerBackPics: true,
    });

    await renderAllMoves(rom, {
        outputDir: outputMoveDir,
    })
}

export function loadDefaultRom() {
    const romPath = path.resolve(process.cwd(), "../../pokefirered.gba");
    return fs.readFileSync(romPath);
}