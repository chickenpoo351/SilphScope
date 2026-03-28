/* 
 * Derivative work of lz77 decompression code (within the gbagfx tool) by YamaArashi(2015)
 * Licensed under MIT. see NOTICE file in project root for full license.
 * 
 * JS port and modifications by chickenPoo, 2026
 */

export function lz77Decompress(src) { // in theory this should work like flawlessly unless I messed up my port lol
    if (!src || src.length < 4) {
        throw new Error("invalid lz77 data");
    }
    if (src[0] !== 0x10) {
        throw new Error("not lz77 compressed data");
    }
    
    const destSize = src[1] | (src[2] << 8) | (src[3] << 16);
    const dest = new Uint8Array(destSize);
    let srcPos = 4;
    let destPos = 0;
    
    while (destPos < destSize) {
        if (srcPos >= src.length) {
            throw new Error("unexpected end of data");
        }
        
        let flags = src[srcPos++];
        
        for (let i = 0; i < 8; i++) {
            if (flags & 0x80) {
                if (srcPos + 1 >= src.length) {
                    throw new Error("unexpected end of data");
                }
                
                const byte1 = src[srcPos++];
                const byte2 = src[srcPos++];
                const blockSize = (byte1 >> 4) + 3;
                const blockDistance = (((byte1 & 0xF) << 8) | byte2) + 1;
                let copySrc = destPos - blockDistance;
                
                if (copySrc < 0) {
                    throw new Error("invalid back reference");
                }
                for (let j = 0; j < blockSize; j++) {
                    if (destPos >= destSize) break;
                    dest[destPos++] = dest[copySrc + j];
                }
            } else {
                if (srcPos >= src.length) {
                    throw new Error("unexpected end of data");
                }
                dest[destPos++] = src[srcPos++];
            }
            if (destPos >= destSize) break;
            flags <<= 1;
        }
    }
    return dest;
}