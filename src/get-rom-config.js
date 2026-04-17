// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { firered } from "../rom-configs/firered.js";

function detectRomCode(rom) {
    return new TextDecoder().decode(rom.slice(0xAC, 0xB0));
}

export function getRomConfig(rom) {
    const code = detectRomCode(rom);
    if (code === firered.code) return firered; // eventually will add more and so on :p (by more I mean leafgreen lol)
    throw new Error(`Unsupported ROM: ${code}`);
}