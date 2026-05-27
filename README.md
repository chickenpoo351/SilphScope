still a WIP however hopefully with some more work I can get this into a workable state...

(Even Newer!) Update:

moves now work... kinda... still working on getting it all the way done but it mostly works!

(Newer!) Update:

still a WIP :p but erm you can extract more graphics!

Update:

so the project is semi-usable now you can download it as a npm package via:

    npm install silphscope
(or `pnpm install silphscope` if you like pnpm like me ;] )

general use is something like this:
```JavaScript
import fs from "fs";
import { renderAllGraphics } from "silphscope"; // this is cool...

const rom = fs.readFileSync("pokefirered.gba"); // replace with path to your own firered rom
await renderAllGraphics(rom, {
    outputMonDir: "./Assets/monImages", // must I explain?
    outputIconDir: "./Assets/Icons", // same thing here :p
    outputTrainerDir: "./Assets/Trainers", // ...
    outputMoveDir: "./Assets/Moves"
});
```

Of course though the above is for extracting all graphics (which is kinda a lie... In reality it only extracts mon images, item icons, trainer images, and move images... but like I said this is a WIP :p so wait a bit please!).

But if you want say just the mon images or item icons refer below:

mon images extraction:
```JavaScript
import fs from "fs";
import { renderAllMons } from "silphscope"; // never gets old :p

const rom = fs.readFileSync("pokefirered.gba")// once again replace with the path to your own firered rom
await renderAllMons(rom, {
    outputDir: "./Assets/monImages", // do I actually have to explain?
    icon: true, // set to false if you don't want icons I guess...
    footprint: true, // same as the above...
});
```

item icon extraction:
```JavaScript
import fs from "fs";
import { renderAllIcons } from "silphscope" // :D

const rom = fs.readFileSync("pokefirered.gba")// find your own rom and so on :l
await renderAllIcons(rom, {
    outputDir: "./Assets/Icons" // no comment (wait... that was a comment :p)
});
```

trainer image extraction:
```JavaScript
import fs from "fs";
import { renderAllTrainers } from "silphscope" // :O

const rom = fs.readFileSync("pokefirered.gba") // stuff stuff stuff
await renderAllTrainers(rom, {
    outputDir: "./Assets/trainers", // more stuff
    trainerBackPics: true, // renders the like 8 trainer back pics
})
```

move image extraction:
```JavaScript
import fs from "fs";
import { renderAllMoves } from "silphscope" // :O

const rom = fs.readFileSync("pokefirered.gba") // stuff stuff stuff (more stuff!)
await renderAllMoves(rom, {
    outputDir: "./Assets/trainers", // (incredibly) more stuff
})
```