// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

// I have an idea but it needs math D:

export const fireredRev0 = {
    code: "BPRE", // I find this weird... like what does BP stand for? is it: "Battle Pokemon"? no idea :o
    rev: 0, // I probably should have mentioned I have been making this tool with a rev0 ROM... but oh well it isn't like people are actually using this tool at least right now so no one has probably run into the "why isn't m firered ROM working!" issue :p
    sha1: "41cb23d8dccc8ebd7c649cd8fbb58eeace6e2fdc", // so yes I decided to bite the bullet and well nw we are going to verify the sha1... of course though now the top two things are kinda redundant but I'm going to keep them I guess :p
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
        moveAnimPicTable: 0x3ACC08,
        moveAnimPaletteTable: 0x3AD510,
        ballParticlePicTable: 0x40BF48,
        ballParticlePalTable: 0x40BFA8,
        ballAnimPicTable: 0x26056C,
        ballAnimPalTable: 0x2605CC, // any idea what I am doing next?
        objectEventPicTable: 0x39FDB0,
        objectEventPalTable: 0x3A5158, // so these tables... technically aren't tables (except for the palette one kinda...) they are actually pointers to objects which then contain children who actually contain another object which finally contains a pointer to the actual graphics... this will be fun... (anyway will work on this eventually...)
    } // if this works out... well hehe... :D
}