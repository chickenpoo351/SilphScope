export function resolveMovePic(move, reader, moveName) {
    const table = reader.getTable("moveAnimPicTable");
    const entryOffset = table + move.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `move_${moveName}_pic`,
        offset: ptr
        // I don't think this needs a size... since I think most of these are all lz77 compressed... if not more JSON time :/
    }
}