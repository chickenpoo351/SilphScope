export function resolveMonIconPalette(mon, reader) { // I kinda think this might be wrong... but erm who knows :o maybe I got it right first try lol
    const indexTable = reader.getTable("monIconPaletteIndices");
    const paletteIndex = reader.readU8(indexTable + mon.index);
    const paletteTable = reader.getTable("monIconPaletteTable");
    const entryOffset = paletteTable + paletteIndex * 8;
    const palettePtr = reader.readPointer(entryOffset);
    return {
        offset: palettePtr,
        size: 32,
    };
}