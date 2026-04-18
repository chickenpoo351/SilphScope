export function resolveTrainerFrontPic(trainer, reader, trainerName) {
    const table = reader.getTable("trainerFrontPicTable");
    const entryOffset = table + trainer.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `trainer_${trainerName}_front_pic`,
        offset: ptr,
    }
}