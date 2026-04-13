// I have an idea but it needs math D:

export const firered = {
    code: "BPRE", // I find this weird... like what does BP stand for? is it: "Battle Pokemon"? no idea :o
    tables: { // so the idea is essentially instead of a big JSON like we have now we instead just view the table graphics and build from that... it in theory could be slower because more lookups instead of direct references but it should be more maintainable...
        monFrontSprites: 0x2350AC,
        monBackSprites: 0x23654C,
        monPalettes: 0x23730C,
        monShinyPalettes: 0x2380CC
    } // if this works out... well hehe... :D
}