// so the idea of "resolvers" is to essentially replace this line in the asset extraction:
// const monPic = assets.find(a => a.name === picName);
// of course though thats for the mon stuff specifically however!
// this time instead of needing a giant lookup table we use this thingy
// plus our rom-config to just infer all of this from the table in the ROM itself... in theory..

export function resolveMonSprite(mon, romReader, side) {
    const tableName = side === "back"
        ? "monBackSprites"
        : "monFrontSprites";
    const table = romReader.getTable(tableName);
    const entryOffset = table + mon.index * 8;
    const ptr = romReader.readPointer(entryOffset);
    return {
        name: `mon_${mon.name}_${side}`, // really not needed anymore lol this was just for testing... but erm its ok for now I guess :p
        offset: ptr
        // just realized something... later resolvers will need a size value for assets not in need of lz77 decompressing... luckily these don't but erm... yea.. this could get slightly complicated...
    };
}