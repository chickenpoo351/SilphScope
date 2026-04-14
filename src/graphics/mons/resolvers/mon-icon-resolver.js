export function resolveMonIcon(mon, reader) {
    const table = reader.getTable("monIconTable");
    const entryOffset = table + mon.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        offset: ptr,
        size: 1024 // idk anymore :o
    };
}