# renderAllGraphics

This file handles the ins and outs of the Node based `renderAllGraphics` function.

## Description

Renders all supported graphics from a supported ROM. includes the following graphics:

- Mon front sprites
- Mon back sprites
- Shiny palette mon sprites
- Mon icons
- Mon footprints
- Item icon sprites
- Front trainer sprites
- Back trainer frames
- Move sprites
- Ball sprites
- Ball particle sprites

## Function Signature

```TypeScript
async function renderAllGraphics(rom: Buffer | Uint8Array, options?: {
    outputMonDir?: string | null;
    outputIconDir?: string | null;
    outputTrainerDir?: string | null;
    outputMoveDir?: string | null;
    outputBallDir?: string | null;
    sortUnused? : boolean;
    verboseLogs?: boolean;
    showSummary?: boolean;
    concurrency?: number;
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
            category: "mon";
            asset: "sprite";
            path: string;
            buffer: Buffer;
            meta: {
                side: "front" | "back";
                variant: "normal" | "shiny";
            };
        }
        | {
            name: string;
            id: string;
            category: "mon";
            asset: "icon";
            path: string;
            buffer: Buffer;
            meta: {
                frame: 1 | 2;
            };
        }
        | {
            name: string;
            id: string;
            category: "mon";
            asset: "footprint";
            path: string;
            buffer: Buffer;
            meta: {};
        }
        | {
            name: string;
            id: string;
            category: "icon";
            asset: "sprite";
            path: string;
            buffer: Buffer;
            meta: {};
        }
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
        | {
            name: string;
            id: string;
            category: "move";
            asset: "sprite";
            path: string;
            buffer: Buffer;
            meta: {
                unused: boolean;
            };
        } 
        | {
            name: string;
            id: string;
            category: "move";
            asset: "frame";
            path: string;
            buffer: Buffer;
            meta: {
                unused: boolean;
                frame: number;
            };
        }
        | {
            name: string;
            id: string;
            category: "ball";
            asset: "sprite";
            path: string;
            buffer: Buffer;
            meta: {
                particleOrBall: "particle" | "ball";
            };
        } 
        | {
            name: string;
            id: string;
            category: "ball";
            asset: "frame";
            path: string;
            buffer: Buffer;
            meta: {
                frame: number;
                particleOrBall: "particle" | "ball";
            };
        }
    >;
}>
```

~~(yes the signature is huge...)~~

**Important:** `finalResults` is only present if `returnFileBuffer` is set to `true`. Otherwise, the return value simply contains `totalFileCount`.

If you wish to see the defaults and descriptions of the function options, view [renderAllX-options.md](./renderAllX-options.md).

## Examples

The simplest way to use the function is:

```JavaScript
import { renderAllGraphics } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllGraphics(rom);
```

This writes all files to a new `"./out"` directory relative to where you ran the above script.

---

If you instead wish to return a buffer of each graphic instead of having them written to disk:

```JavaScript
import { renderAllGraphics } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const renderGraphicsData = await renderAllGraphics(rom, {
    outputMonDir: null,
    outputIconDir: null,
    outputTrainerDir: null,
    outputMoveDir: null,
    outputBallDir: null,
    returnFileBuffer: true,
});
```

You can then access the generated files through `renderGraphicsData.finalResults`.

For example:

```JavaScript
const mySpecificGraphics = renderGraphicsData.finalResults.filter((graphic) => {
    if (graphic.category === "mon" && graphic.asset === "sprite") {
        return(
            graphic.meta.side === "front" &&
            graphic.meta.variant === "normal"
        );
    }
    if (graphic.category === "mon" && graphic.asset === "icon") {
        return true;
    }
    if (graphic.category === "ball" && graphic.asset === "sprite") {
        return graphic.meta.particleOrBall === "particle";
    }
    if (graphic.category === "move" && graphic.asset === "frame") {
        return (
            graphic.meta.unused === true &&
            graphic.meta.frame === 0
        );
    }

    return false;
});

for (const graphic of mySpecificGraphics) {
    fs.writeFileSync(`${graphic.id}.png`, graphic.buffer);
}
```

You can also use the built in `path` value which defaults roughly to something like:

```
./out/${category}/${objectName}/${fileName}
```

Which would look like so:

```JavaScript
for (const graphic of mySpecificGraphics) {
    fs.writeFileSync(`${graphic.path}.png`, graphic.buffer);
}
```

You can also just reconstruct the path string yourself with the provided data like so:

```JavaScript
for (const graphic of mySpecificGraphics) {
    let path;

    if (graphic.category === "mon" && graphic.asset === "sprite") {
        path = `./out/mons/${graphic.name}/${graphic.meta.side}_${graphic.meta.variant}.png`;
    } else if (graphic.category === "mon" && graphic.asset === "icon") {
        path = `./out/mons/${graphic.name}/icon_frame${graphic.meta.frame}.png`;
    } else if (graphic.category === "ball" && graphic.asset === "sprite") {
        path = `./out/balls/${graphic.name}/master-particle.png`;
    } else if (graphic.category === "move" && graphic.asset === "frame") {
        path = `./out/moves/${graphic.meta.unused === true ? `unused/${graphic.name}` : `${graphic.name}`}/frame-${graphic.meta.frame}.png`;
    }

    fs.writeFileSync(path, graphic.buffer);
}
```

This allows you to select and handle the generated assets however you want without `renderAllGraphics` writing them all to disk.