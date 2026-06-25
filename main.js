// anyway so for anyone reading this don't use any of these functions lol er well I should be more specific... don't use any functions other than the high-level stuff because everything else I haven't gotten around to writing the typings for as well as that they aren't ready for public use yet (mostly due to documentation and their highly unopinionated default options) but once they are complete you guys should be able to do some cool stuff with these! (provided you know stuff about GBA roms...)

// low level stuff:
import { extract } from "./src/graphics/extract.js";
import { lz77Decompress } from "./src/graphics/lz77-decompress.js";
import { RomReader } from "./src/rom-reader.js";
import { getRomConfig } from "./src/get-rom-config.js";
import { render4bppImage } from "./src/graphics/render-4bpp-image.js";
import { decode4bppTile } from "./src/graphics/decode-4bpp.js";
import { decode1bppTile } from "./src/graphics/decode-1bpp.js";
import { decodePalette } from "./src/graphics/decode-palette.js";

export { extract, lz77Decompress, RomReader, getRomConfig, render4bppImage, decode4bppTile, decode1bppTile, decodePalette };

// mon related (mid-level? is that even a term?) stuff:
import { renderMon } from "./src/graphics/mons/render-mons.js";
import { renderMonIcon } from "./src/graphics/mons/render-mon-icon.js";
import { renderMonFoot } from "./src/graphics/mons/render-mon-foot.js";

export { renderMon, renderMonIcon, renderMonFoot };

// icon related (I feel like mid level is a term but it isn't exactly mid level...) stuff:
import { renderIcon } from "./src/graphics/icons/render-icons.js";

export { renderIcon };

// trainer related (maybe I should search the term...) stuff:
import { renderTrainer } from "./src/graphics/trainers/render-trainers.js";
import { renderTrainerBackPic } from "./src/graphics/trainers/render-trainer-back-pics.js";

export { renderTrainer, renderTrainerBackPic };

// move related mid level (turns out it is a term :o) stuff:
import { renderMove } from "./src/graphics/moves/render-moves.js";

export { renderMove };

// ball related mid level stuff:
import { renderBall } from "./src/graphics/balls/render-balls.js";
import { renderBallParticle } from "./src/graphics/balls/render-ball-particle.js";

export { renderBall, renderBallParticle }; // wait a second... oh well I have to redo this now... because these functions are highly unopinionated so if you don't change literally every option the defaults will just make the function do well nothing :p 

// high level batch rendering thingies that is enough for most people :p
import { renderAllMons, renderAllIcons, renderAllTrainers, renderAllMoves, renderAllBalls, renderAllGraphics } from "./src/graphics/graphics-extractor-main.js";
export { renderAllMons, renderAllIcons, renderAllTrainers, renderAllMoves, renderAllBalls, renderAllGraphics };