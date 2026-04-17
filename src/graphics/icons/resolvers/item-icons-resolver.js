export function resolveItemIconObject(item, reader, itemName, gfxOrPal) {
    const table = reader.getTable("itemIconTable");
    const entrySize = 8; // why did I make this variable... hmmm... I really can't remember... eh it doesn't do any harm other than being kinda useless since we could just pass 8 as is...
    const entryOffset = table + item.index * entrySize;
    const rawPtr = reader.readU32(entryOffset);
    console.log(`${itemName} raw table value: 0x${rawPtr.toString(16)}`);
    const fileOffset = rawPtr - 0x08000000;
    console.log(`${itemName} file offset: 0x${fileOffset.toString(16)}`);
    const iconPtr = reader.readPointer(entryOffset);
    const palettePtr = reader.readPointer(entryOffset + 4);
    let finalPtr;
    if (gfxOrPal === "gfx") {
        finalPtr = iconPtr;
        console.log(`gfx ${itemName} asset offset should be 0x${finalPtr.toString(16)}`);
        return {
            name: `item_${itemName}_${gfxOrPal}`,
            offset: finalPtr,
            size: 288,
        }
    } else if (gfxOrPal === "pal") {
        finalPtr = palettePtr;
        console.log(`pal ${itemName} asset offset should be 0x${finalPtr.toString(16)}`);
        return {
            name: `item_${itemName}_${gfxOrPal}`,
            offset: finalPtr,
            size: 32, // this might be extremely dumb... or! It might just work... idk lol (I mean its worked so far so...)
        }
    }
}