// like electron IPC but worse... kinda :o

import { parentPort } from "worker_threads";
import { renderMon } from "./graphics/mons/render-mons.js";
import { renderIcon } from "./graphics/icons/render-icons.js";
import { renderTrainer } from "./graphics/trainers/render-trainers.js";
import { renderMove } from "./graphics/moves/render-moves.js";
import { renderBall } from "./graphics/balls/render-balls.js";
import mons from "../mon-data/monData.json" with { type: "json" };
import icons from "../item-data/itemData.json" with { type: "json" };
import trainers from "../trainer-data/trainerData.json" with { type: "json" };
import trainersBack from "../trainer-data/trainerBackData.json" with { type: "json" };
import moves from "../move-data/moveData.json" with { type: "json" };
import balls from "../ball-data/ballData.json" with { type: "json" };
import { RomReader } from "./rom-reader.js";

const functions = {
    renderMon,
    renderIcon,
    renderTrainer,
    renderMove,
    renderBall,
}

const functionData = {
    renderMon: [
        mons
    ],
    renderIcon: [
        icons
    ],
    renderTrainer: [
        trainers,
        trainersBack,
    ],
    renderMove: [
        moves
    ],
    renderBall: [
        balls
    ]
}

let reader;
let rom;

parentPort.on("message", async (task) => { // I don't really know what I am doing... but roll with it!
    if (task.type === "init") {
        rom = new Uint8Array(task.rom) // so usually this wouldn't work... but I think if I am reading the docs for SharedArrayBuffer correctly... then if I correctly initialize the rom into the shared array this should work... if not then erm we might have to make a few hacks for this to work :p
        reader = new RomReader(rom, task.config);
        parentPort.postMessage({
            type: "ready"
        });
        return;
    }
    // so now after the init this should work I think? hopefully? like I said I don't know what I am doing lmao
    const functionType = functions[task.taskName]; // naming this const "function" would be so much more accurate but you know function is a reserved word :p
    const functionJSONData = functionData[task.taskName]
    if (!functionType) {
        return parentPort.postMessage({
            type: "error",
            id: task.id,
            error: `Unknown function: ${task.taskName}`
        });
    }

    try {
        const result = await functionType(task.objectName, ...functionJSONData, reader, rom, {
            ...task.options,
        }); // ok so that should handle the functions... if only we could pass cb's through workers but oh well :p
        console.log(task.objectName, result);
        parentPort.postMessage({
            type: "result",
            id: task.id,
            objectName: task.objectName,
            result
        })
        return;
    } catch (err) {
        parentPort.postMessage({
            type: "error",
            id: task.id,
            error: err.stack ?? err.message,
        });
    }
})