export function resolveMonIcon(mon, reader, monName) {
    const table = reader.getTable("monIconTable");
    const entryOffset = table + mon.index * 4;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `mon_${mon.name}_icon`,
        offset: ptr,
        size: 1024 // idk anymore :o
    };
}