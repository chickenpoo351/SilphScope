// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { fireredRev0 } from "../rom-configs/fireredRev0.js";
import { fireredRev1 } from "../rom-configs/fireredRev1.js";
import { leafgreenRev0 } from "../rom-configs/leafgreenRev0.js";
import { leafgreenRev1 } from "../rom-configs/leafgreenRev1.js";

function detectRomInfo(rom) {
    return {
        code: new TextDecoder().decode(rom.slice(0xAC, 0xB0)),
        rev: rom[0xBC],
    }
}

export function getRomConfig(rom) {
    const romInfo = detectRomInfo(rom);
    if (romInfo.code === fireredRev0.code || romInfo.code === fireredRev1.code) {
        if (romInfo.rev === fireredRev0.rev) return fireredRev0;
        if (romInfo.rev === fireredRev1.rev) return fireredRev1;
    }
    if (romInfo.code === leafgreenRev0.code || romInfo.code === leafgreenRev1.code) { // yes I know checking both of the codes is redundant since they are the same but let me enjoy my useless non-DRY code ;)
        if (romInfo.rev === leafgreenRev0.rev) return leafgreenRev0;
        if (romInfo.rev === leafgreenRev1.rev) return leafgreenRev1;
    }
    throw new Error(`Unsupported ROM: ${romInfo.code} rev ${romInfo.rev}`); // should be evrything I think...
}