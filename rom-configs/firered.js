// I have an idea but it needs math D:

export const firered = {
    code: "BPRE", // I find this weird... like what does BP stand for? is it: "Battle Pokemon"? no idea :o
    tables: { // so the idea is essentially instead of a big JSON like we have now we instead just view the table graphics and build from that... it in theory could be slower because more lookups instead of direct references but it should be more maintainable...
        monFrontSprites: 0x2350AC,
        monBackSprites: 0x23654C,
        monPalettes: 0x23730C,
        monShinyPalettes: 0x2380CC,
        monIconTable: 0x3D37A0,
        monIconPaletteIndices: 0x3D3E80,
        monIconPaletteTable: 0x3D4038,
        monFootprintTable: 0x43FAB0,
        trainerFrontPicTable: 0x23957C,
        trainerFrontPicPaletteTable: 0x239a1C,
        trainerBackPicTable: 0x239FA4,
        trainerBackPicPaletteTable: 0x239FD4,
        itemIconTable: 0x3D4294, // newer update: (so turns out this old value was the pointer to the table lol however this new one is the actual table... for real this time!) rest of the old message: so this was very hard to find since it isn't labeled in the .map of ROMs... luckily Ghidra and the ROM decomps exist so that helped a ton... issue is I believe this contains both the palette and gfx in each listing (should probably double check pokefirered to confirm...) so it will be interesting to extract assets I suppose...
    } // if this works out... well hehe... :D
}