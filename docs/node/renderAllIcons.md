# renderAllIcons

This file handles the ins and outs of the Node based `renderAllIcons` function.

## Description

Renders all item icon graphics from a supported ROM. includes the following graphics:

- item icon sprites

## Function Signature

```TypeScript
async function renderAllIcons(rom: Buffer | Uint8Array, options?: {
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
        {
            name: string;
            category: "icon";
            asset: "sprite";
            path: string;
            buffer: Buffer;
            meta: {};
        }
    >;
}>
```

**Important:** `finalResults` is only present if `returnFileBuffer` is set to `true`. Otherwise, the return value simply contains `totalFileCount`.

If you wish to see the defaults and descriptions of the function options, view [renderAllX-options.md](./renderAllX-options.md).

## Examples

The simplest way to use the function is:

```JavaScript
import { renderAllIcons } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllIcons(rom);
```

This writes all files to a new `"./out"` directory relative to where you ran the above script.

---

If you instead wish to return a buffer of each graphic instead of having them written to disk:

```JavaScript
import { renderAllIcons } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const renderIconData = await renderAllIcons(rom, {
    outputDir: null,
    returnFileBuffer: true,
});
```

You can then access the generated files through `renderIconData.finalResults`.

For example:

```JavaScript
const itemIconSprites = renderIconData.finalResults.filter(
    (particle) =>
            particle.asset = "sprite"
);

for (const itemIcon of itemIconSprites) {
    fs.writeFileSync(`${itemIcon.name}.png`, itemIcon.buffer);
}
```

Now the above example is a bit redundant because there isn't much filtering you can do at all with this function... this is mostly only useful for other functions which can give different assets and such but let's continue!

You can also use the built in `path` value which defaults to:

```
./out/${iconName}/${fileName}
```

Which would look like so:

```JavaScript
for (const itemIcon of itemIconSprites) {
    fs.writeFileSync(`${itemIcon.path}.png`, itemIcon.buffer);
}
```

This allows you to select and handle the generated assets however you want without `renderAllIcons` writing them all to disk.