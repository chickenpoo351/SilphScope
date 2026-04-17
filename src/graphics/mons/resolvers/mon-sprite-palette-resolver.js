export function resolveMonPalette(mon, romReader, monName, variant) {
    const tableName = variant === "shiny"
        ? "monShinyPalettes"
        : "monPalettes";
        const table = romReader.getTable(tableName);
        const entryOffset = table + mon.index * 8;
        const ptr = romReader.readPointer(entryOffset);
        return {
            name: `mon_${monName}_${variant}_palette`,
            offset: ptr,
            size: 40 // I hope thats right... from what I can tell all front/back pal's are 40 in size...
        }
}