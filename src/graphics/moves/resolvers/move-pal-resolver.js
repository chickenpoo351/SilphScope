export function resolveMovePal(move, reader, moveName) {
    const table = reader.getTable("moveAnimPaletteTable");
    const entryOffset = table + move.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `move_${moveName}_pal`,
        offset: ptr,
        size: 40 // maybe this will continue working? perhaps? please?
    }
}