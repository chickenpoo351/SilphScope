<h1 align="center">SilphScope</h1>
<p align="center">
    <sub><s>Yup I finally got around to updating this "horrible" README :p</s></sub>
</p>

Hello! I have no idea how you found this repo but welcome! (did I already scare you off? :[)

>It is probably important to mention this but the project is still quite heavily in its WIP phase... so maybe wait a few more months or something before you rely on the project fully... or just keep your working version of the project and don't update it unless you know for sure the new version is working lol

Anyway this project is quite cool (says the guy who made it...) essentially what we (me...) are doing here is trying to take a GBA Firered/Leafgreen rev0/rev1 US release ROM and be able to extract things such as graphics and eventually sounds and songs into something more usable like a PNG or WAV respectively. While being far more portable and non-dev friendly than the C/C++ tools from the caveman ages (actually though I must say this tool owes a lot to those projects... otherwise things would have taken far longer... not to say all the answers were just hidden in them but they helped in a bunch of ways!)

Why would you want this? Well you really don't :p unless of course you happen to need these graphics in which case this will be the next best invention save for orange juice!

Welp enough chitchat let's get into how you actually use this tool (or wait... would it be a library? eh doesn't matter :p) below is a (super cool) Table of Contents you can use to jump through this long-ish README if you are only interested in specific parts

## Table of Contents
- [Features](#features)
  - [Planned Features](#planned-features)
- [Quick Start](#quick-start)
- [API](#api)
  - [renderAllX() Functions](#renderallx-functions)
    - [Input](#input)
    - [Return value](#return-value)
    - [Shared Options](#shared-options)
    - [renderAllGraphics()](#renderallgraphics)
    - [renderAllMons()](#renderallmons)
    - [renderAllIcons()](#renderallicons)
    - [renderAllTrainers()](#renderalltrainers)
    - [renderAllMoves()](#renderallmoves)
    - [renderAllBalls()](#renderallballs)
  - [renderX() Functions](#renderx-functions)
    - [Function Signature](#function-signature)
    - [renderMon()](#rendermon)
    - [renderMonIcon()](#rendermonicon)
    - [renderMonFoot()](#rendermonfoot)
    - [renderIcon()](#rendericon)
    - [renderTrainer()](#rendertrainer)
    - [renderTrainerBackPic()](#rendertrainerbackpic)
    - [renderMove()](#rendermove)
    - [renderBall()](#renderball)
    - [renderBallParticle()](#renderballparticle)
  - [Low Level Functions](#low-level-functions)
    - [getRomConfig()](#getromconfig)
    - [RomReader](#romreader)
    - [extract()](#extract)
    - [lz77Decompress()](#lz77decompress)
    - [decode1bppTile()](#decode1bpptile)
    - [decode4bppTile()](#decode4bpptile)
    - [decodePalette()](#decodepalette)
    - [render4bppImage()](#render4bppimage)

## Features

Here is the current list of extracted graphics the project supports (more on the way!... eventually :p)

#### Mon
- Front sprites
- Back sprites
- Shiny palette sprite variants
- Icons
- Footprints

#### Items
- Item icons

#### Trainers
- Trainer sprites
- Trainer back sprites

#### Battle Assets
(well technically the trainers should be here... but don't worry about that!)
- Move animation graphics
- Ball sprites
- Ball particles

#### Output
- PNG file export
- In memory file buffer array

#### Supported ROMs
- Firered (USA) Rev0

### Planned Features
- More graphical extraction
- Expose some more low level functions
- ~~(finish my other project... that just so happens to be reliant on this project...)~~
- Support the following ROMs:
  - Firered (USA) rev1
  - Leafgreen (USA) rev0
  - Leafgreen (USA) rev1

## Quick Start

So in general you can currently do everything the package currently offers through just one function! (Do keep in mind though this function will keep growing as the project isn't done yet...) But first we kinda have to get the package installed first... so run this to go ahead and download it!

```
npm install silphscope
```

(or if you're like me use `pnpm install silphscope` ;)) 

```JavaScript
import { renderAllGraphics } from "silphscope"; // still cool!
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba"); // remember get your own ROM!
await renderAllGraphics(rom, {
    outputMonDir: "./Assets/monImages", // must I explain?
    outputIconDir: "./Assets/Icons", // same thing here :p
    outputTrainerDir: "./Assets/Trainers", // ...
    outputMoveDir: "./Assets/Moves",
    outputBallDir: "./Assets/Balls"
});
```

And with that simply run the file and next thing you know you have around 6k images extracted from your very own local ROM! if you would like to see more in depth explanations of the function options or what more the package is capable of keep reading below or jump back to the table of contents and skip around (you aren't too far from it yet!)

## API

To start off this will simply be going over the possible Node.js based functions and a general sense of what they do. If you want a more in depth explanation of things (such as what each option does, a more in depth explanation of the function, etc...) you will probably want to view the documentation folder.

For reference perhaps you need to know all the options of renderAllGraphics and what exactly they do you would go view these documentation files for those answers:

Node based renderAllGraphics() in depth explanation: docs/node/renderAllGraphics.md or click [here](./docs/node/renderAllGraphics.md)

Node based renderAll function options: docs/node/renderAllX-options.md or click [here](./docs/node/renderAllX-options.md)

### renderAllX() Functions

So all Node based `renderAllX()` functions have a bit of similarites you can find them listed below:

#### Input

Every node based `renderAllX()` function:

- Accepts a valid and supported ROM as either a `Buffer` or `Uint8Array`
- Accepts an optional options object

#### Return value

All Node based `renderAllX()` functions return an object with two values like this:

```JavaScript
{
  totalFileCount: number,
  finalResults?: [],
}
```

Of course though it is very important to specify that `finalResults` is not always there it only appears if the `returnFileBuffer` option is set to `true` upon running any renderAll function otherwise your return value will only contain `totalFileCount`

speaking of which `totalFileCount` is a simple variable that returns only however many files were written during a run if you have your `outputDir` variable(s) set to `null` and only generate the file buffer via `returnFileBuffer` being set to `true` this count will not go up

#### Shared options

Each node based `renderAllX()` function has a few shared options contained within their optional options object. Below are said options and their default values:

```JavaScript
{
  concurrency: Math.max(1, os.availableParallelism() - 1),
  pngFilterType: 0,
  pngCompressionLevel: 4,
  verboseLogs: true,
  showSummary: true,
  returnFileBuffer: false,
}
```

If you would like to know more about these function options please view this file:

[renderAllX-options.md](./docs/node/renderAllX-options.md)

#### renderAllGraphics()

This is currently the "general use" function of the project it is capable of extracting every currently supported graphic from a valid ROM. Below is the simplest example of renderAllGraphics().

```JavaScript
import { renderAllGraphics } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllGraphics(rom, {
  returnFileBuffer: false,
  outputMonDir: "./out/mons",
  outputIconDir: "./out/icons",
  outputTrainerDir: "./out/trainers",
  outputMoveDir: "./out/moves",
  outputBallDir: "./out/balls",
});
```

#### renderAllMons()

This function is specifically responsible for rendering all of the mon graphics so the front/back shiny/normal, mon icons, and footprints are all handled here. Below is the example code for `renderAllMons()`

```JavaScript
import { renderAllMons } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllMons(rom, {
  outputDir: "./out",
  icon: true,
  footprint: true,
});
```

#### renderAllIcons()

`renderAllIcons()` is specifically meant for item icons contained within the ROM. so for the graphics that appear when looking inside your bag at items in game. Below is the function example code

```JavaScript
import { renderAllIcons } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllIcons(rom, {
  outputDir: "./out",
});
```

#### renderAllTrainers()

This function handles both front and back graphics for trainers contained within the ROM. Here is the example code

```JavaScript
import { renderAllTrainers } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllTrainers(rom, {
  outputDir: "./out",
  trainerBackPics: true,
});
```

#### renderAllMoves()

(this function was a lot of work... specifically the image splitting... but you don't have to worry about that dear user as I have already suffered through completing all of that "logic") This function is for all battle move graphics contained within the game it is responsible for extracting said graphics as well as cutting them from their spritesheets into individual images. Below is the code example

```JavaScript
import { renderAllMoves } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllMoves(rom, {
  outputDir: "./out",
  renderMasterImage: true,
  sortUnused: true,
});
```

#### renderAllBalls()

`renderAllBalls()` is responsible for rendering both ball graphics and ball particle graphics. Below is the example code:

```JavaScript
import { renderAllBalls } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
await renderAllBalls(rom, {
  outputDir: "./out",
  ballParticles: true,
  renderMasterBallImage: true,
  renderMasterBallParticleImage: true,
});
```

### renderX() Functions

This section contains the Node based mid level section of the API and allows you to essentially render a single graphic from any category (and subcategory if applicable) or just create your own `renderAllX()` function by wrapping any `renderX()` functions you need

To find the more in depth documentation please view the docs/node/ folder contained within the repo for reference perhaps you wish to view more information on the `renderMon()` function you would go to:

`docs/node/renderMon.md` or click [here](./docs/node/renderMon.md).

#### Function Signature

All `renderX()` functions have roughly the same signature that being:

```JavaScript
renderX(objectName, jsonData, reader, rom, options = {});
```

Where `objectName` is the key of an item contained within the `jsonData` argument so for say the `monData` JSON if you wanted to render squirtle its key in the JSON would be `"SQUIRTLE"` it is recommended to view the JSON beforehand to become familiar with what assets are available and their keys

Speaking of which `jsonData` is simply a JSON file containing the key of what you are rendering and at the very least its index within the pointer table (there are exceptions to this but they are not needed to be known if you only want to render things)

`reader` is simply the `RomReader` utility class needed to resolve the pointers of what you are rendering if you are unsure how to create one view the [RomReader Section](#romreader) or the [low-level-api.md](./docs/node/low-level-api.md) file and the relevant `RomReader` section

`rom` is quite simply a `Buffer` or `Uint8Array` of your ROM which is used to extract the graphics in the first place :p

`options` is a optional object that can take function specific options however though there are options each function will always have those are:

```JavaScript
{
  pngFilterType = 0,
  pngCompressionLevel = 4,
  returnFileBuffer = false,
  outputDir = "./out",
}
```

The listed values are also the defaults if you leave the options untouched any other function specific functions will be shown in the function example

#### renderMon()

This function allows you to render a single mon and all of its related battle graphics here is the function example:

```JavaScript
import { renderMon, monData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderMon("DONPHAN", monData, reader, rom, {
  side: [ "front", "back" ],
  variant: [ "shiny", "normal" ],
  icon: true,
  footprint: true,
});
```

Note: `side` and `variant` are special in that they can accept an array as their value however that array can only contain the strings `"front" / "back"` and `"shiny" / "normal"` respectively you can also however not use an array and just pass the string itself so if you wish to only render the front shiny image `side` would have `"front"` as its value and `variant` would have `"shiny"` as its value

#### renderMonIcon()

Helper function to `renderMon()` specifically responsible for rendering the mon icons that appear in your party here is the example use:

```JavaScript
import { renderMonIcon, monData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderMonIcon("SPOINK", monData, reader, rom);
```

#### renderMonFoot()

Secondary helper function for `renderMon()` used simply to render a mon's footprint which is used in its dex entry here is an example:

```JavaScript
import { renderMonFoot, monData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderMonFoot("DIGLETT", monData, reader, rom);
```

#### renderIcon()

Simple function used to render a item icon.

Example:

```JavaScript
import { renderIcon, itemData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderIcon("COIN_CASE", itemData, reader, rom);
```

#### renderTrainer()

`renderTrainer()` is a function used to render a trainer's battle graphics which include their front graphics and if applicable their back graphics (or in some cases only their back graphics...) here is an example:

```JavaScript
import { renderTrainer, trainerData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderTrainer("RUNNING_TRIATHLETE_F", trainerData, reader, rom, {
  trainerBackPics: true, // note: in this example this does nothing as this trainer does not have a back pic
});
```

#### renderTrainerBackPic()

Helper function for `renderTrainer()` to render the few trainers that have a back pic graphic example code:

```JavaScript
import { renderTrainerBackPic, trainerData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderTrainerBackPic("RS_BRENDAN_1", trainerData, reader, rom);
```

#### renderMove()

Function that renders a battle anim graphic and automatically cuts it into individual frames usage example:

```JavaScript
import { renderMove, moveData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderMove("WARM_ROCK", moveData, reader, rom, {
  renderMasterImage: true,
  sortUnused: true,
});
```

#### renderBall()

`renderBall()` is responsible for rendering the battle graphics of balls in game as well as their particles here is an example:

```JavaScript
import { renderBall, ballData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderBall("LUXURY", ballData, reader, rom, {
  ballParticles: true,
  renderMasterBallImage: true,
  renderMasterBallParticleImage: true,
});
```

#### renderBallParticle()

This function is a helper function for `renderBall()` used to render ball particles here is an example:

```JavaScript
import { renderBallParticle, ballData, RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
const reader = new RomReader(rom, config);

await renderBallParticle("TIMER", ballData, reader, rom, {
  renderMasterBallParticleImage: true,
});
```

### Low Level Functions

Perhaps you don't want any of the high level `renderAllX()` or mid level `renderX()` functions or just want to make your own `render()` function. That's exactly what this section is for! Below you can find all current low level functions and a simple explanation as to how to use them for detailed information on these functions view [low-level-api.md](./docs/node/low-level-api.md).

#### getRomConfig()

More than likely you won't have a need for this as this function returns rom configs SilphScope has. If you are however working with the same ROMs and want all table offsets SilphScope understands this could be useful to you.

Example:

```JavaScript
import { getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);
```

You should however probably build your own version of this if you need this functionality

#### RomReader

`RomReader` is a utility class used to help normalize offsets and read sections of a ROM. Currently `RomReader` requires a config that in the case of SilphScope comes from `getRomConfig` however the required config shape can be as simple as:

```JavaScript
{
  tables: {
    myTable: 0x123456;
  }
}
```

Eventually though I plan to export a version of `RomReader` that does not require any config.

`RomReader` also requires a `Buffer` or `Uint8Array` in its constructor.

An example of using `RomReader` can be seen here:

```JavaScript
import { RomReader, getRomConfig } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");
const config = await getRomConfig(rom);

const reader = new RomReader(rom, config);
const value = reader.readU32(0x123456);
const pointer = reader.readPointer(0x123456);
const table = reader.getTable("myTable");
```

#### extract()

`extract()` is a utility function capable of pulling a section of data out of a ROM. it also handles lz77 compressed assets automatically (with a fallback to extracting any assets that fail being uncompressed as a regular non-lz77 asset).

Example:

```JavaScript
import { extract } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");

const asset = {
  offset: 0x123456,
  name: "myAsset",
  size: 32 // technically optional if the asset is lz77 compressed otherwise needed to know where to stop extracting data
};

const extractedAsset = extract(asset, rom);
```

#### lz77Decompress()

`lz77Decompress()` is useful if you have a section of your ROM data you know is lz77 compressed as it is capable of decompressing these assets.

Example:

```JavaScript
import { lz77Decompress } from "silphscope";

const myUncompressedData = lz77Decompress(compressedData) // either Uint8Array or Buffer starting where your compressed data is
```

#### decode1bppTile()

Useful utility that takes a 1bpp tile and turns that data into its palette indices (which in reality can only be black or transparent...).

Example:

```JavaScript
import { decode1bppTile } from "silphscope";

const tilePixels = decode1bppTile(tileBytes);
```

#### decode4bppTile()

essentially the same as `decode1bppTile()` but instead for 4bpp tiles

example:

```JavaScript
import { decode4bppTile } from "silphscope";

const tilePixels = decode4bppTile(tileBytes);
```

#### decodePalette()

`decodePalette()` decodes palette data from the GBA's BGR555 color format into regular RGB colors.

Example:

```JavaScript
import { decodePalette } from "silphscope";

const palette = decodePalette(encodedPalette);
```

#### render4bppImage()

`render4bppImage()` is a very useful function capable of taking the tile data, palette data, width, and height of an image which then returns raw RGBA pixel data you can put into any image proccessing tool you wish.

Example:

```JavaScript
import { render4bppImage, extract } from "silphscope";
import fs from "fs";

const rom = fs.readFileSync("pokefirered.gba");

const rawGraphicsData = extract(my4bppData, rom);
const rawPaletteData = extract(myPalette, rom);
const width = 32;
const height = 32;

const image = render4bppImage(rawGraphicsData.data, rawPaletteData.data, width, height);
```

~~(you actually read all of this? well anyway the readme isn't done yet... so this is weird... want a virtual cookie?)~~