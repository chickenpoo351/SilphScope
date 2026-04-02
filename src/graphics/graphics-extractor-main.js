// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import fs from "fs";
import { renderMon } from "./render-mons.js";

const mainIndex = fs.readFileSync("../../graphics-maps/fr-graphic-map.json", "utf-8");
const monIndex = fs.readFileSync("../../mon-data/monData.json", "utf-8");
const assets = JSON.parse(mainIndex);
const mons = JSON.parse(monIndex);

fs.mkdirSync("./out", { recursive: true });

async function runBatch() {
    for (const monName of Object.keys(mons)) {
        await renderMon(monName, mons, assets, "front", "normal", true, true);
        await renderMon(monName, mons, assets, "front", "shiny", false, false);
        await renderMon(monName, mons, assets, "back", "normal", false, false);
        await renderMon(monName, mons, assets, "back", "shiny", false, false);
        console.log(`Done: ${monName}`);
    }
}

runBatch();