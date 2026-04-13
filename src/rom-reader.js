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
        );
    }
    readPointer(offset) {
        return this.readU32(offset) - 0x08000000;
    }
    getTable(name) {
        return this.mapConfig.tables[name];
    }
}