export function resolveTrainerBackPic(trainer, reader, trainerName) {
    const table = reader.getTable("trainerBackPicTable");
    const entryOffset = table + trainer.index * 8;
    const ptr = reader.readPointer(entryOffset);
    return {
        name: `trainer_${trainerName}_back_pic`,
        offset: ptr,
    }
}