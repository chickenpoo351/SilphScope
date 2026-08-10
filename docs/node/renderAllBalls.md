# renderAllBalls

This file handles the ins and outs of the Node based `renderAllBalls` function.

## Description

Renders all battle ball graphics from a supported ROM. includes the following graphics:

- Ball sprites
- Ball particle sprites

## Function Signature

```TypeScript
async function renderAllBalls(rom: Buffer | Uint8Array, options?: {
    ballParticles?: boolean;
    renderMasterBallImage?: boolean;
    renderMasterBallParticleImage: boolean;
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
            category: "ball";
            asset: "sprite";
            path: string;
            buffer: Buffer;
            meta: {
                particleOrBall: "particle" | "ball";
            };
        } | {
            name: string;
            category: "ball";
            asset: "frame";
            path: string;
            buffer: Buffer;
            meta: {
                particleOrBall: "particle" : "ball";
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
import { renderAllBalls } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllBalls(rom);
```

This writes all files to a new `"./out"` directory relative to where you ran the above script.

---

If you instead wish to return a buffer of each graphic instead of having them written to disk:

```JavaScript
import { renderAllBalls } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const renderBallData = await renderAllBalls(rom, {
    outputDir: null,
    returnFileBuffer: true,
});
```

You can then access the generated files through `renderBallData.finalResults`.

For example:

```JavaScript
const ballParticleFrames = renderBallData.finalResults.filter(
    (particle) =>
            particle.asset = "frame" &&
            particle.meta.particleOrBall = "particle"
);

for (const ballParticle of ballParticleFrames) {
    fs.writeFileSync(`${ballParticle.name}.png`, ballParticle.buffer);
}
```

You can also use the built in `path` value which defaults to:

```
./out/${ballName}/${fileName}
```

Which would look like so:

```JavaScript
for (const ballParticle of ballParticleFrames) {
    fs.writeFileSync(`${ballParticle.path}.png`, ballParticle.buffer);
}
```

This allows you to select and handle the generated assets however you want without `renderAllBalls` writing them all to disk.