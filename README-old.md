still a WIP however hopefully with some more work I can get this into a workable state...

(Small But New Update!) Update:

so you can now set stuff such as the pngFilterType and pngCompressionLevel allow me to explain how they work:

pngFilterType:

This takes a integer between -1 and 4 with each integer corresponding like so:

-1: auto
0: none
1: sub
2: up
3: average
4: paeth

now as to what each of these mean... I don't know exactly lol (I'm not some png genius D:) but from what I understand none of these actually change the look of the image instead they are basically compression some will work better with different images depending on content... that said though it is still somewhat important to point out that paeth is the most computationally expensive but usually results in a smaller file size (most of the time... for an example one image might get marginal file size decreases with a paeth filter meanwhile it would get a larger decrease using average or something) if you do not want to deal with trying to figure out which filter is best it is recommended to set the value to 0 as that will apply no filter onto the image or if you wish for the best filter for each image type to be applied use -1 as this will make it so that each image is tested for which filter is best for it and which is best is applied be aware though this is pretty expensive resource wise (can add on to like 2 seconds to the renderAllGraphics() function... so not crazy but if you need upmost speed perhaps that is an issue for you :p) you can also however pass an array like so:

[1, 3, 4]

this will make it so that the only png filters allowed to be used are 1, 3, and 4 (sub, average, and paeth) so each image will be tested for each of these filters and the best is chosen out of however many filters you put in the array (not sure why you would want to do this but it's there I guess...)

pngCompressionLevel:

This one is much simpler it essentially takes a integer between 0-9 with 0 being no compression added at all and 9 being the maximum compression added of course though this also uses more resources so it could cause the render time to be slower (like by 1-2 seconds... once again not crazy but sometimes you need speed I guess... wait I should mention that is measured via the renderAllGraphics() function not 1-2 seconds per asset lol) but it will result in a smaller file meanwhile 0 will be the fastest you can do (since you aren't computing anything...) but it will result in a much larger file

(Amazingly Newer!) Update:

so now ball extraction works! still need to cut the images up but that should be simple

(also move graphics are basically done except for ICE_CHUNK it is a weird image... and I don't know how I am going to cut it up... but everything else is working! that makes it sound like ICE_CHUNK doesn't work... which it does it just doesn't get nicely cut up)

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
    concurrency: 4, // handles how many concurrent promises are run. Set to 1 to run sequentially and conversly increase to run more promises at once (don't set too high though if your CPU / I/O can't handle it then it might actually be slower...)
    pngFilterType: 0, // view the explanation for this above
    pngCompressionLevel: 4, // same thing :p explanation above
    outputMonDir: "./Assets/monImages", // must I explain?
    outputIconDir: "./Assets/Icons", // same thing here :p
    outputTrainerDir: "./Assets/Trainers", // ...
    outputMoveDir: "./Assets/Moves",
    sortUnusedMoves: true, // just sorts the unused moves into a sub-directory
    outputBallDir: "./Assets/Balls"
});
```

Of course though the above is for extracting all graphics (which is kinda a lie... In reality it only extracts mon images, item icons, trainer images, move images, and ball images... but like I said this is a WIP :p so wait a bit please!).

But if you want say just the mon images or item icons refer below:

mon images extraction:
```JavaScript
import fs from "fs";
import { renderAllMons } from "silphscope"; // never gets old :p

const rom = fs.readFileSync("pokefirered.gba")// once again replace with the path to your own firered rom
await renderAllMons(rom, {
    concurrency: 4, // handles how many concurrent promises are run. Set to 1 to run sequentially and conversly increase to run more promises at once (don't set too high though if your CPU / I/O can't handle it then it might actually be slower...)
    pngFilterType: 0, // explanation above
    pngCompressionLevel: 4, // explanation above
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
    concurrency: 4, // handles how many concurrent promises are run. Set to 1 to run sequentially and conversly increase to run more promises at once (don't set too high though if your CPU / I/O can't handle it then it might actually be slower...)
    pngFilterType: 0, // explanation above
    pngCompressionLevel: 4, // explanation above
    outputDir: "./Assets/Icons" // no comment (wait... that was a comment :p)
});
```

trainer image extraction:
```JavaScript
import fs from "fs";
import { renderAllTrainers } from "silphscope" // :O

const rom = fs.readFileSync("pokefirered.gba") // stuff stuff stuff
await renderAllTrainers(rom, {
    concurrency: 4, // handles how many concurrent promises are run. Set to 1 to run sequentially and conversly increase to run more promises at once (don't set too high though if your CPU / I/O can't handle it then it might actually be slower...)
    pngFilterType: 0, // explanation above
    pngCompressionLevel: 4, // explanation above
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
    concurrency: 4, // handles how many concurrent promises are run. Set to 1 to run sequentially and conversly increase to run more promises at once (don't set too high though if your CPU / I/O can't handle it then it might actually be slower...)
    pngFilterType: 0, // explanation above
    pngCompressionLevel: 4, // explanation above
    outputDir: "./Assets/trainers", // (incredibly) more stuff
    renderMasterImage: true, // kinda forgot about this... basically it renders a uncut image of the move anim if you like
    sortUnused: true, // sorts unused moves into a sub-directory
})
```

ball image extraction:
```JavaScript
import fs from "fs";
import { renderAllBalls } from "silphscope" // o-O

const rom = fs.readFileSync("./path/to/your/rom.gba") // the file path explains :/
await renderAllBalls(rom, {
    concurrency: 4, // handles how many concurrent promises are run. Set to 1 to run sequentially and conversly increase to run more promises at once (don't set too high though if your CPU / I/O can't handle it then it might actually be slower...)
    pngFilterType: 0, // explanation above
    pngCompressionLevel: 4, // explanation above
    outputDir: "./Assets/Balls",
    ballParticles: true, // set to false if you don't want the ball particles :p
    renderMasterBallImage: true, // set to false if you don't want the uncut image
    renderMasterBallParticleImage: true, // set to false if you also don't want the uncut particle image :p
})