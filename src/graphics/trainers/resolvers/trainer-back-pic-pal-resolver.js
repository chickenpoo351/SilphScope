export function resolveTrainerBackPicPal(trainer, reader, trainerName) { // I probably could generalize this stuff but erm... thats more work :p
    const table = reader.getTable("trainerBackPicPaletteTable");
    const entryOffset = table + trainer.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `trainer_${trainerName}_back_pic_pal`,
        offset: ptr,
        size: 40,
    }
}