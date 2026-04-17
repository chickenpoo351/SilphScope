// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export function resolveMonFootprint(mon, reader, monName) {
    const table = reader.getTable("monFootprintTable");
    const entryOffset = table + mon.index * 4;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `mon_${monName}_footprint`,
        offset: ptr,
        size: 32,
    };
}