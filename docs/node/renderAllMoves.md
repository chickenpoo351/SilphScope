# renderAllMoves

This file handles the ins and outs of the Node based `renderAllMoves` function.

## Description

Renders all battle moves graphics from a supported ROM. includes the following graphics:

- Move sprites

## Function Signature

```TypeScript
async function renderAllMoves(rom: Buffer | Uint8Array, options?: {
    renderMasterImage?: boolean;
    sortUnused?: boolean;
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
    finalResults: Array< // only present if returnFileBuffer is true.
        | {
            name: string;
            category: "move";
            asset: "sprite";
            path: string;
            buffer: Buffer;
            meta: {};
        } | {
            name: string;
            category: "move";
            asset: "frame";
            path: string;
            buffer: Buffer;
            meta: {
                frame: number;
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
import { renderAllMoves } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllMoves(rom);
```

This writes all files to a new `"./out"` directory relative to where you ran the above script.

---

If you instead wish to return a buffer of each graphic instead of having them written to disk:

```JavaScript
import { renderAllMoves } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const renderMoveData = await renderAllMoves(rom, {
    outputDir: null,
    returnFileBuffer: true,
});
```

You can then access the generated files through `renderMoveData.finalResults`.

For example:

```JavaScript
const firstMoveFrames = renderMoveData.finalResults.filter(
    (move) =>
            move.asset = "frame" &&
            move.meta.frame = 0
);

for (const moveFrame of firstMoveFrames) {
    fs.writeFileSync(`${moveFrame.name}.png`, moveFrame.buffer);
}
```

You can also use the built in `path` value which defaults to:

```
./out/moves/${moveName}/${fileName}
```

If `sortUnused` is set to `true` and the graphic is unused by the original game a new directory will be created like so:

```
./out/moves/unused/${moveName}/${fileName}
```

For example a move named `flamethrower` could produce paths like so:

```
./out/moves/flamethrower/master
./out/moves/flamethrower/frame-0
./out/moves/flamethrower/frame-1
```

Or if `flamethrower` was a unused graphic it would end up like this:

```
./out/moves/unused/flamethrower/frame-0
```

Using `path` would look like so:

```JavaScript
for (const moveFrame of firstMoveFrame) {
    fs.writeFileSync(`${moveFrame.path}.png`, moveFrame.buffer);
}
```

This allows you to select and handle the generated assets however you want without `renderAllMoves` writing them all to disk.