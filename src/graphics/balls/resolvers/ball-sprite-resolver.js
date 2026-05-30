// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export function resolveBallSpritePic(ball, reader, ballName) {
    const table = reader.getTable("ballAnimPicTable");
    const entryOffset = table + ball.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `ball_${ballName}_pic`,
        offset: ptr, // I think this is lz77 compressed so it doesn't need a size value...
    }
}