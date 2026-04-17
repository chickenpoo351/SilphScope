// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export class RomReader {
    constructor(rom, mapConfig) {
        this.rom = rom;
        this.mapConfig = mapConfig;
    }
    readU32(offset) {
        const rom = this.rom;
        return(
            rom[offset] |
            (rom[offset + 1] << 8) |
            (rom[offset + 2] << 16) |
            (rom[offset + 3] << 24)
        ) >>> 0; // this should also prevent a bug for the numbers becoming negative due to unsigned and signed numbers canoodling :o
    }
    readU8(offset) { // how did I forget this T-T
        return this.rom[offset];
    }
    readPointer(offset) {
        return this.readU32(offset) - 0x08000000;
    }
    getTable(name) {
        return this.mapConfig.tables[name];
    }
}