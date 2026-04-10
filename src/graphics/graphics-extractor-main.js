// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderMon } from "./render-mons.js";
import { renderIcon } from "./icons/render-icons.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));

function loadDefaultJson(relativePath) {
    const absolutePath = path.join(currentDir, "..", relativePath);
    return JSON.parse(fs.readFileSync(absolutePath, "utf-8"));
}

const assets = loadDefaultJson("../graphics-maps/fr-graphic-map.json");
const mons = loadDefaultJson("../mon-data/monData.json");
const icons = loadDefaultJson("../item-data/itemData.json");

export async function renderAllMons(rom, options = {}) {
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllMons(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        assets: providedAssets = assets,
        mons: providedMons = mons,
        outputDir = "./out",
        icon = true,
        footprint = true,
    } = options;

    fs.mkdirSync(outputDir, { recursive: true });

    for (const monName of Object.keys(providedMons)) {
        await renderMon(monName, providedMons, providedAssets, rom, {
            side: "front",
            variant: "normal",
            icon,
            footprint,
            outputDir,
        });
        await renderMon(monName, providedMons, providedAssets, rom, {
            side: "front",
            variant: "shiny",
            icon: false,
            footprint: false,
            outputDir,
        });
        await renderMon(monName, providedMons, providedAssets, rom, {
            side: "back",
            variant: "normal",
            icon: false,
            footprint: false,
            outputDir,
        });
        await renderMon(monName, providedMons, providedAssets, rom, {
            side: "back",
            variant: "shiny",
            icon: false,
            footprint: false,
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
        assets: providedAssets = assets,
        icons: providedIcons = icons,
        outputDir = "./out",
    } = options;

    fs.mkdirSync(outputDir, { recursive: true });

    for (const itemName of Object.keys(providedIcons)) {
        await renderIcon(itemName, providedIcons, providedAssets, rom, { outputDir });
        console.log(`Done: ${itemName}`);
    }
}

export async function renderAllGraphics(rom, options = {}) { // eventually I will speed this up instead of doing it sequentially :p but for now its fine I guess
    if (!rom || !(rom instanceof Uint8Array || Buffer.isBuffer(rom))) {
        throw new TypeError("renderAllGraphics(rom, options) requires rom Buffer/Uint8Array as first argument");
    }

    const {
        outputMonDir = "./out/mons",
        outputIconDir = "./out/icons",
    } = options;

    await renderAllMons(rom, {
        outputDir: outputMonDir,
        icon: true,
        footprint: true,
    });
    
    await renderAllIcons(rom, {
        outputDir: outputIconDir,
    });
}

export function loadDefaultRom() {
    const romPath = path.resolve(process.cwd(), "../../pokefirered.gba");
    return fs.readFileSync(romPath);
}