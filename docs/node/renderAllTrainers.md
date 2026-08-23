# renderAllTrainers

This file handles the ins and outs of the Node based `renderAllTrainers` function.

## Description

Renders all battle trainer graphics from a supported ROM. includes the following graphics:

- Front trainer sprites
- Back trainer frames

## Function Signature

```TypeScript
async function renderAllTrainers(rom: Buffer | Uint8Array, options?: {
    trainerBackPics?: boolean;
    verboseLogs?: boolean;
    showSummary?: boolean;
    concurrency?: number;
    outputDir?: string | null;
    pngFilterType?: 
    | -1
    | 0
    | 1
    | 2
    | 3
    | 4
    | Array<0 | 1 | 2 | 3 | 4>;
    pngCompressionLevel?: number;
    returnFileBuffer?: boolean;
}): Promise<{
    totalFileCount: number,
    finalResults?: Array< // only present if returnFileBuffer is true.
        | {
            name: string;
            id: string;
            category: "trainer";
            asset: "frame";
            path: string;
            buffer: Buffer;
            meta: {
                frame:
                | 1
                | 2
                | 3
                | 4
                | 5;
            };
        } 
        | {
            name: string;
            id: string;
            category: "trainer";
            asset: "sprite";
            path: string;
            buffer: Buffer;
            meta: {
                side: "front" | "back";
            };
        }
    >;
}>
```

**Important:** `finalResults` is only present if `returnFileBuffer` is set to `true`. Otherwise, the return value simply contains `totalFileCount`.

If you wish to see the defaults and descriptions of the function options, view [renderAllX-options.md](./renderAllX-options.md).

## Examples

The simplest way to use the function is:

```JavaScript
import { renderAllTrainers } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllTrainer(rom);
```

This writes all files to a new `"./out"` directory relative to where you ran the above script.

---

If you instead wish to return a buffer of each graphic instead of having them written to disk:

```JavaScript
import { renderAllTrainers } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const renderTrainerData = await renderAllTrainers(rom, {
    outputDir: null,
    returnFileBuffer: true,
});
```

You can then access the generated files through `renderTrainerData.finalResults`.

For example:

```JavaScript
const thirdBackPicFrames = renderTrainerData.finalResults.filter(
    (trainerFrame) =>
            trainerFrame.asset === "frame" &&
            trainerFrame.meta.frame === 3
);

for (const trainerFrame of thirdBackPicFrames) {
    fs.writeFileSync(`${trainerFrame.id}.png`, trainerFrame.buffer);
}
```

You can also use the built in `path` value which defaults to:

```
./out/trainers/${trainerName}/${fileName}
```

Which would look like so:

```JavaScript
for (const trainerFrame of thirdTrainerFrames) {
    fs.writeFileSync(`${trainerFrame.path}.png`, trainerFrame.buffer);
}
```

You can also just reconstruct the path string yourself with the provided data like so:

```JavaScript
fs.writeFileSync(`./out/trainers/${trainerFrame.name}/back_frame_${trainerFrame.meta.frame}.png`, trainerFrame.buffer);
```

This allows you to select and handle the generated assets however you want without `renderAllTrainers` writing them all to disk.