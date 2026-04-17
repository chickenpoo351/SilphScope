export function resolveItemIconObject(item, reader, itemName, gfxOrPal) {
    const table = reader.getTable("itemIconTable");
    const entrySize = 8; // why did I make this variable... hmmm... I really can't remember... eh it doesn't do any harm other than being kinda useless since we could just pass 8 as is...
    const entryOffset = table + item.index * entrySize;
    const iconPtr = reader.readPointer(entryOffset);
    const palettePtr = reader.readPointer(entryOffset + 4);
    let finalPtr;
    if (gfxOrPal === "gfx") {
        finalPtr = iconPtr;
        return {
            name: `item_${itemName}_${gfxOrPal}`,
            offset: finalPtr,
        }
    } else if (gfxOrPal === "pal") {
        finalPtr = palettePtr;
        return {
            name: `item_${itemName}_${gfxOrPal}`,
            offset: finalPtr,
            size: 40, // this might be extremely dumb... or! It might just work... idk lol (I mean its worked so far so...)
        }
    }
}