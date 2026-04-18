export function resolveTrainerBackPic(trainer, reader, trainerName) {
    const table = reader.getTable("trainerBackPicTable");
    const entryOffset = table + trainer.index * 8;
    const ptr = reader.readPointer(entryOffset);
    let size;
    if (trainerName === "RED" || trainerName === "LEAF") {
        size = 10240;
    } else {
        size = 8192;
    }
    return {
        name: `trainer_${trainerName}_back_pic`,
        offset: ptr,
        size,
    }
}