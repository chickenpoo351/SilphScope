// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { fireredRev0 } from "../rom-configs/fireredRev0.js";
import { fireredRev1 } from "../rom-configs/fireredRev1.js";
import { leafgreenRev0 } from "../rom-configs/leafgreenRev0.js";
import { leafgreenRev1 } from "../rom-configs/leafgreenRev1.js";

async function detectRomInfo(rom) {
    const hash = await crypto.subtle.digest("SHA-1", rom);
    
    return {
        code: new TextDecoder().decode(rom.slice(0xAC, 0xB0)),
        rev: rom[0xBC],
        sha1: [... new Uint8Array(hash)]
            .map(b => b.toString(16).padStart(2, "0"))
            .join(""),
    }
}

export async function getRomConfig(rom) {
    const romInfo = await detectRomInfo(rom);
    if (romInfo.code === fireredRev0.code || romInfo.code === fireredRev1.code) {
        if (romInfo.rev === fireredRev0.rev && romInfo.sha1 === fireredRev0.sha1) return fireredRev0;
        if (romInfo.rev === fireredRev1.rev && romInfo.sha1 === fireredRev1.sha1) return fireredRev1;
    }
    if (romInfo.code === leafgreenRev0.code || romInfo.code === leafgreenRev1.code) { // yes I know checking both of the codes is redundant since they are the same but let me enjoy my useless non-DRY code ;)
        if (romInfo.rev === leafgreenRev0.rev && romInfo.sha1 === leafgreenRev0.sha1) return leafgreenRev0;
        if (romInfo.rev === leafgreenRev1.rev && romInfo.sha1 === leafgreenRev1.sha1) return leafgreenRev1;
    }
    throw new Error(`Unsupported ROM: "${romInfo.code}", rev: "${romInfo.rev}", sha1: "${romInfo.sha1}"`); // should be evrything I think...
}