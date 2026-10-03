// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { runWithConcurrency } from "./run-with-concurrency.js";
import { runWithWorker } from "./run-with-worker.js";
import { renderMon } from "./graphics/mons/render-mons.js";
import { renderIcon } from "./graphics/icons/render-icons.js";
import { renderTrainer } from "./graphics/trainers/render-trainers.js";
import { renderMove } from "./graphics/moves/render-moves.js";
import { renderBall } from "./graphics/balls/render-balls.js";
import mons from "../mon-data/monData.json" with { type: "json" };
import icons from "../item-data/itemData.json" with { type: "json" };
import trainers from "../trainer-data/trainerData.json" with { type: "json" };
import moves from "../move-data/moveData.json" with { type: "json" };
import balls from "../ball-data/ballData.json" with { type: "json" };
import { RomReader } from "./rom-reader.js";

export const functions = {
    renderMon: {
        func: renderMon,
        data: [ mons ],
    },
    renderIcon: {
        func: renderIcon,
        data: [ icons ],
    },
    renderTrainer: {
        func: renderTrainer,
        data: [ trainers ],
    },
    renderMove: {
        func: renderMove,
        data: [ moves ],
    },
    renderBall: {
        func: renderBall,
        data: [ balls ],
    },
};

export async function runTask(items, concurrency, taskName, rom, config, options, onResult) {
    if (concurrency < 0) {
        await runWithConcurrency(items, Math.abs(concurrency), taskName, rom, config, options, onResult);
        return;
    }
    if (concurrency > 0) {
        await runWithWorker(items, concurrency, taskName, rom, config, options, onResult);
        return;
    }
    if (concurrency === 0) { // sure we could get rid of this if statement and let it be a fall through but I like it this way
        const func = functions[taskName].func;
        const jsonData = functions[taskName].data;
        const reader = new RomReader(rom, config);
        for (const item of items) {
            const result = await func(item, ...jsonData, reader, rom, {
                ...options
            });
            await onResult(result, item);
        }
        return;
    }
}