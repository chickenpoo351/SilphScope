export function resolveMonFootprint(mon, reader) {
    const table = reader.getTable("monFootprintTable");
    const entryOffset = table + mon.index * 4;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `mon_${mon.name}_footprint`,
        offset: ptr,
        size: 32,
    };
}