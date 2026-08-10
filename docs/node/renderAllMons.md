# renderAllMons

This file handles the ins and outs of the Node based `renderAllMons` function.

## Description

Renders all mon graphics from a supported ROM. includes the following graphics:

- mon front sprites
- mon back sprites
- shiny palette mon sprites
- mon icons
- mon footprints

## Function Signature

```TypeScript
async function renderAllMons(rom: Buffer | Uint8Array, options?: {
    icon?: boolean;
    footprint?: boolean;
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
            category: "mon";
            asset: "footprint";
            path: string;
            buffer: Buffer;
            meta: {};
        }
    >;
}>;
```

**Important:** finalResults is only there if `returnFileBuffer` is set to true otherwise the return value would simply be this:

```TypeScript
Promise<{
    totalFileCount: number;
}>;
```

If you wish to see the defaults and descriptions for the function options view [renderAllX-options.md](./renderAllX-options.md)

## Examples

The simplest way to use the function is:

```JavaScript
import { renderAllMons } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllMons(rom);
```

This writes all files to a new `./out` directory relative to where you ran the above script

---

If you instead wish to return a buffer of each graphic instead of having them written to disk you would write this:

```JavaScript
import { renderAllMons } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const renderMonData = await renderAllMons(rom, {
    outputDir: null,
    returnFileBuffer: true,
});
```

In which with that new variable you have created you can do stuff like this:

```JavaScript
const shinyMonBackSprites = renderMonData.finalResults.filter(
    (mon) =>
        mon.asset === "sprite" &&
        mon.meta.side === "back" &&
        mon.meta.variant === "shiny"
);

for (const shinyMon of shinyMonBackSprites) {
    fs.writeFileSync(`${shinyMon.name}.png`, shinyMon.buffer);
}
```

Or if you prefer to use the built in path value which defaults to a path like so:

```
./out/mons/${monName}/${fileName}
```

you would simply do this:

```JavaScript
for (const shinyMon of shinyMonBackSprites) {
    fs.writeFileSync(`${shinyMon.path}.png`, shinyMon.buffer);
}
```

And as such you would now have written only the shiny variants of the mon's back sprites to disk

you could of course not write to disk at all and instead do something completely different. That however is up to your use case