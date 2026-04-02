still a WIP however hopefully with some more work I can get this into a workable state...

Update:

so the project is semi-usable now you can download it as a npm package via:

    npm install silphscope
(or `pnpm install silphscope` if you like pnpm like me ;] )

general use is something like this:
```JavaScript
import fs from "fs";
import { renderAllMons } from "silphscope"; // this is cool...

const rom = fs.readFileSync("pokefirered.gba"); // replace with path to your own firered rom
await renderAllMons(rom, {
    outputDir: "./Assets/monImages", // must I explain?
    icon: true, // you should probably leave these two alone
    footprint: true // unless you don't want everything generated?
});
```