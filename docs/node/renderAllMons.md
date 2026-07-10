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