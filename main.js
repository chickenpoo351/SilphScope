// anyway so for anyone reading this don't use any of these functions lol er well I should be more specific... don't use any functions other than the high-level stuff because everything else I haven't gotten around to writing the typings for as well as that they aren't ready for public use yet (mostly due to documentation and their highly unopinionated default options) but once they are complete you guys should be able to do some cool stuff with these! (provided you know stuff about GBA roms...)

// low level stuff:
import { extract } from "./src/graphics/extract.js";
import { lz77Decompress } from "./src/graphics/lz77-decompress.js";
import { RomReader } from "./src/rom-reader.js";
import { getRomConfig } from "./src/get-rom-config.js";
import { render4bppImage } from "./src/graphics/render-4bpp-image.js";
import { decode4bppTile } from "./src/graphics/decode-4bpp.js";
import { decode1bppTile } from "./src/graphics/decode-1bpp.js";
import { decodePalette } from "./src/graphics/decode-palette.js";

export { extract, lz77Decompress, RomReader, getRomConfig, render4bppImage, decode4bppTile, decode1bppTile, decodePalette };

// mon related (mid-level? is that even a term?) stuff:
import { renderMon as garbagePublicOptionsRenderMon } from "./src/graphics/mons/render-mons.js";
import { renderMonIcon as garbagePublicOptionsRenderMonIcon } from "./src/graphics/mons/render-mon-icon.js";
import { renderMonFoot as garbagePublicOptionsRenderMonFoot } from "./src/graphics/mons/render-mon-foot.js";
import monData from "./mon-data/monData.json" with { type: "json" };

async function renderMon(monName, mons, reader, rom, options = {}) { // so yes I could have set renderMon to just have these default options... but I kinda like it when the renderX functions default to nothing :p (let me enjoy my slightly useless code)
    return garbagePublicOptionsRenderMon(monName, mons, reader, rom, {
        pngFilterType: 0,
        pngCompressionLevel: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        side: ["front", "back"],
        variant: ["normal", "shiny"],
        icon: true,
        footprint: true,
        ...options,
    });
}

async function renderMonIcon(monName, mons, reader, rom, options = {}) {
    return garbagePublicOptionsRenderMonIcon(monName, mons, reader, rom, {
        pngFilterType: 0,
        pngCompressionLevel: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        ...options,
    });
}

async function renderMonFoot(monName, mons, reader, rom, options = {}) {
    return garbagePublicOptionsRenderMonFoot(monName, mons, reader, rom, {
        pngFilterType: 0,
        pngCompressionLevel: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        ...options,
    });
}

export { renderMon, renderMonIcon, renderMonFoot, monData };

// icon related (I feel like mid level is a term but it isn't exactly mid level...) stuff:
import { renderIcon as garbagePublicOptionsRenderIcon } from "./src/graphics/icons/render-icons.js";
import itemData from "./item-data/itemData.json" with { type: "json" };

async function renderIcon(itemName, items, reader, rom, options = {}) {
    return garbagePublicOptionsRenderIcon(itemName, items, reader, rom, {
        pngFilterType: 0,
        pngCompressionType: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        ...options, 
    });
}

export { renderIcon, itemData };

// trainer related (maybe I should search the term...) stuff:
import { renderTrainer as garbagePublicOptionsRenderTrainer } from "./src/graphics/trainers/render-trainers.js";
import { renderTrainerBackPic as garbagePublicOptionsRenderTrainerBackPic } from "./src/graphics/trainers/render-trainer-back-pics.js";
import trainerData from "./trainer-data/trainerData.json" with { type: "json" };
import trainerBackData from "./trainer-data/trainerBackData.json" with { type: "json" };

async function renderTrainer(trainerName, trainers, backTrainers, reader, rom, options = {}) {
    return garbagePublicOptionsRenderTrainer(trainerName, trainers, backTrainers, reader, rom, {
        pngFilterType: 0,
        pngCompressionLevel: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        trainerBackPics: true,
        ...options,
    });
}

async function renderTrainerBackPic(trainerName, trainers, reader, rom, options = {}) {
    return garbagePublicOptionsRenderTrainerBackPic(trainerName, trainers, reader, rom, {
        pngFilterType: 0,
        pngCompressionLevel: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        ...options,
    });
}

export { renderTrainer, renderTrainerBackPic, trainerData, trainerBackData };

// move related mid level (turns out it is a term :o) stuff:
import { renderMove as garbagePublicOptionsRenderMove } from "./src/graphics/moves/render-moves.js";
import moveData from "./move-data/moveData.json" with { type: "json" };

async function renderMove(moveName, moves, reader, rom, options = {}) {
    return garbagePublicOptionsRenderMove(moveName, moves, reader, rom, {
        pngFilterType: 0,
        pngCompressionLevel: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        renderMasterImage: true,
        sortUnused: true,
        ...options,
    });
}

export { renderMove, moveData };

// ball related mid level stuff:
import { renderBall as garbagePublicOptionsRenderBall } from "./src/graphics/balls/render-balls.js";
import { renderBallParticle as garbagePublicOptionsRenderBallParticle } from "./src/graphics/balls/render-ball-particle.js";
import ballData from "./ball-data/ballData.json" with { type: "json" };

async function renderBall(ballName, balls, reader, rom, options = {}) {
    return garbagePublicOptionsRenderBall(ballName, balls, reader, rom, {
        pngFilterType: 0,
        pngCompressionLevel: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        ballParticles: true,
        renderMasterBallImage: true,
        renderMasterBallParticleImage: true,
        ...options,
    });
}

async function renderBallParticle(ballName, balls, reader, rom, options = {}) {
    return garbagePublicOptionsRenderBallParticle(ballName, balls, reader, rom, {
        pngFilterType: 0,
        pngCompressionLevel: 4,
        returnFileBuffer: false,
        outputDir: "./out",
        renderMasterBallParticleImage: true,
        ...options,
    });
}

export { renderBall, renderBallParticle, ballData }; // wait a second... oh well I have to redo this now... because these functions are highly unopinionated so if you don't change literally every option the defaults will just make the function do well nothing :p 

// high level batch rendering thingies that is enough for most people :p
import { renderAllMons, renderAllIcons, renderAllTrainers, renderAllMoves, renderAllBalls, renderAllGraphics } from "./src/graphics/graphics-extractor-main.js";
export { renderAllMons, renderAllIcons, renderAllTrainers, renderAllMoves, renderAllBalls, renderAllGraphics };