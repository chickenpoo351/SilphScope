// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import fs from "fs";
import { runWithConcurrency } from "../run-with-concurrency.js";
import { validateRenderOptions } from "../validate-render-options.js";
import { renderMon } from "./mons/render-mons.js";
import { renderIcon } from "./icons/render-icons.js";
import { renderTrainer } from "./trainers/render-trainers.js";
import { RomReader } from "../rom-reader.js";
import { getRomConfig } from "../get-rom-config.js";
import { runWithWorker } from "../run-with-worker.js";
import { renderMove } from "./moves/render-moves.js";
import { renderBall } from "./balls/render-balls.js";
import mons from "../../mon-data/monData.json" with { type: "json" };
import icons from "../../item-data/itemData.json" with { type: "json" };
import trainers from "../../trainer-data/trainerData.json" with { type: "json" };
import trainersBack from "../../trainer-data/trainerBackData.json" with { type: "json" };
import moves from "../../move-data/moveData.json" with { type: "json" };
import balls from "../../ball-data/ballData.json" with { type: "json" };

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

    validateRenderOptions("renderAllMons", {
        concurrency,
        filterType: pngFilterType,
        compressionLevel: pngCompressionLevel,
    });

    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;
/**
    await runWithConcurrency(Object.keys(providedMons), concurrency, async (monName) => {
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
*/
    await runWithWorker(Object.keys(providedMons), concurrency, "renderMon", rom, config, { // so erm hopefully this works?
        side: ["front", "back"],
        variant: ["normal", "shiny"],
        icon,
        footprint,
        pngFilterType,
        pngCompressionLevel,
        returnFileBuffer,
        outputDir,
    }, async (renderMonData, monName) => {
        if (verboseLogs) {
            console.log(`Done: ${monName}`);
        }
        if (!renderMonData) {
            console.log("No renderMonData!", monName);
        }
        if (typeof renderMonData?.fullFileCount !== "number") {
            console.log("Bad fullFileCount", monName, renderMonData);
        }
        totalFileCount += renderMonData.fullFileCount;
        if (returnFileBuffer && renderMonData?.results) {
            finalResults.push(...renderMonData.results);
        }
    });

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

    validateRenderOptions("renderAllIcons", {
        concurrency,
        filterType: pngFilterType,
        compressionLevel: pngCompressionLevel,
    });


    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    await runWithConcurrency(Object.keys(providedIcons), concurrency, async (itemName) => {
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
            finalResults.push(...renderIconData.results);
        }
    });

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

    validateRenderOptions("renderAllTrainers", {
        concurrency,
        filterType: pngFilterType,
        compressionLevel: pngCompressionLevel,
    });


    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    await runWithConcurrency(Object.keys(providedTrainers), concurrency, async (trainerName) => {
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

    validateRenderOptions("renderAllMoves", {
        concurrency,
        filterType: pngFilterType,
        compressionLevel: pngCompressionLevel,
    });


    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    await runWithConcurrency(Object.keys(providedMoves), concurrency, async (moveName) => {
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

    validateRenderOptions("renderAllBalls", {
        concurrency,
        filterType: pngFilterType,
        compressionLevel: pngCompressionLevel,
    });


    if (outputDir) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const config = getRomConfig(rom);
    const reader = new RomReader(rom, config);
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    await runWithConcurrency(Object.keys(providedBalls), concurrency, async (ballName) => {
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
    });

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

    const sharedOptions = {
        concurrency,
        pngFilterType,
        pngCompressionLevel,
        verboseLogs,
        showSummary,
        returnFileBuffer,
    }
    let totalFileCount = 0;
    const finalResults = returnFileBuffer? [] : null;

    validateRenderOptions("renderAllGraphics", {
        concurrency,
        filterType: pngFilterType,
        compressionLevel: pngCompressionLevel,
    });


    const renderAllMonsData = await renderAllMons(rom, {
        ...sharedOptions,
        outputDir: outputMonDir,
        icon: true,
        footprint: true,
    });

    const renderAllIconsData = await renderAllIcons(rom, {
        ...sharedOptions,
        outputDir: outputIconDir,
    });

    const renderAllTrainersData = await renderAllTrainers(rom, {
        ...sharedOptions,
        outputDir: outputTrainerDir,
        trainerBackPics: true,
    });

    const renderAllMovesData = await renderAllMoves(rom, {
        ...sharedOptions,
        outputDir: outputMoveDir,
        renderMasterImage: true,
        sortUnused: sortUnusedMoves,
    });

    const renderAllBallsData = await renderAllBalls(rom, {
        ...sharedOptions,
        outputDir: outputBallDir,
        ballParticles: true,
        renderMasterBallImage: true,
        renderMasterBallParticleImage: true,
    });

    const results = [
        renderAllMonsData,
        renderAllIconsData,
        renderAllTrainersData,
        renderAllMovesData,
        renderAllBallsData,
    ];

    if (returnFileBuffer) {
        finalResults.push(...results.flatMap(result => result.finalResults));
    }
    totalFileCount += results.reduce(
        (sum, result) => sum + result.totalFileCount,
        0
    );

    return {
        ...(returnFileBuffer && { finalResults }),
        totalFileCount,
    }
}