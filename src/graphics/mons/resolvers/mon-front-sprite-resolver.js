// so the idea of "resolvers" is to essentially replace this line in the asset extraction:
// const monPic = assets.find(a => a.name === picName);
// of course though thats for the mon stuff specifically however!
// this time instead of needing a giant lookup table we use this thingy
// plus our rom-config to just infer all of this from the table in the ROM itself... in theory..

export function resolveMonFrontSprite(mon, romReader) {
    const table = romReader.getTable("monFrontSprites");
    const entryOffset = table + mon.index * 8;
    const ptr = romReader.readPointer(entryOffset);
    return {
        name: `mon_${mon.name}_front`,
        offset: ptr
    };
}