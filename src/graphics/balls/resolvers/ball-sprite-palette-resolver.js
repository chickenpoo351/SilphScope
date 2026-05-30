// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export function resolveBallSpritePal(ball, reader, ballName) {
    const table = reader.getTable("ballAnimPalTable");
    const entryOffset = table + ball.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `ball_${ballName}_pal`,
        offset: ptr,
        size: 32
    }
}