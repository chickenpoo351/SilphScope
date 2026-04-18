export function resolveTrainerFrontPicPal(trainer, reader, trainerName) {
    const table = reader.getTable("trainerFrontPicPaletteTable");
    const entryOffset = table + trainer.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `trainer_${trainerName}_front_pic_pal`,
        offset: ptr,
        size: 40,
    }
}