// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export function resolveBallParticlePic(ball, reader, ballName) {
    const table = reader.getTable("ballParticlePicTable");
    const entryOffset = table + ball.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `ball_${ballName}_particle_pic`,
        offset: ptr,
    }
}