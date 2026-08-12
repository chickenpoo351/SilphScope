import { RomReader } from "./src/rom-reader.js";

// this file is getting messy... or well at least to me :p
// I wonder if it is possible to make multiple .d.ts files and import them into a main one...
// I mean apparently .js file imports work so I don't see why that wouldn't...
// but oh well I already have this going may as well stick with it until I get tired of it
// and refactor :o

export interface RenderedAsset<Meta>  {
    name: string;
    id: string;
    category: string;
    asset: string;
    path: string;
    buffer: Buffer;
    meta: Meta;
}

export type RomData = Uint8Array | Buffer;

export type PngFilterType =
    | -1
    | 0
    | 1
    | 2
    | 3
    | 4
    | Array<0 | 1 | 2 | 3 | 4>;

export interface RenderGenericOptions {
    /**
     * Directory to write extracted assets to.
     *
     * If omitted (set to `null`) and `returnFileBuffer` is enabled, files can be
     * consumed directly from memory without being written to disk.
     *
     * @default "./out"
     */
    outputDir?: string | null;

    /**
     * PNG filter mode used during encoding.
     *
     * Accepts a value between `-1` and `4`:
     *
     * - `-1` = Automatically determine the best filter
     * - `0` = None
     * - `1` = Sub
     * - `2` = Up
     * - `3` = Average
     * - `4` = Paeth
     *
     * Arrays may also be supplied. When an array is provided,
     * SilphScope tests only the specified filters and selects
     * the smallest resulting PNG.
     *
     * Examples:
     *
     * ```js
     * pngFilterType: 0
     * pngFilterType: -1
     * pngFilterType: [1, 3, 4]
     * ```
     *
     * @default 0
     */
    pngFilterType?: PngFilterType;

    /**
     * PNG compression level.
     *
     * Accepts a value between `0` and `9`.
     *
     * Higher values generally produce smaller files at the cost
     * of additional processing time.
     *
     * - `0` = No compression
     * - `9` = Maximum compression
     *
     * @default 4
     */
    pngCompressionLevel?: number;

    /**
     * Return generated image buffers instead of only writing
     * files to disk.
     *
     * Useful for web servers, editors, bots, and other tools
     * that need direct access to rendered assets.
     *
     * @default false
     */
    returnFileBuffer?: boolean;
    }

export interface RenderAllGenericOptions extends RenderGenericOptions {
    /**
     * Print progress information as assets are rendered.
     *
     * @default true
     */
    verboseLogs?: boolean;

    /**
     * Print a summary after rendering completes.
     *
     * Includes render count, file count, and elapsed time.
     *
     * @default true
     */
    showSummary?: boolean;

    /**
     * Number of concurrent render operations.
     *
     * Increase with caution. Values that are too high may reduce
     * performance depending on available CPU and disk resources.
     *
     * Set to `1` to render sequentially.
     *
     * @default 4
     */
    concurrency?: number;
}

export interface RenderAllMonsOptions extends RenderAllGenericOptions {
    /**
     * Render mon icon graphics.
     *
     * @default true
     */
    icon?: boolean;

    /**
     * Render mon footprint graphics.
     * 
     * @default true
     */
    footprint?: boolean;
}

export type MonSide = "front" | "back";
export type MonVariant = "normal" | "shiny";

export interface RenderMonOptions extends RenderGenericOptions {
    /**
     * Render mon icon graphics.
     *
     * @default true
     */
    icon?: boolean;

    /**
     * Render mon footprint graphics.
     * 
     * @default true
     */
    footprint?: boolean;

    /**
     * Render mon side specific graphics.
     * 
     * Takes either a single string or an array with two strings.
     * 
     * @default ["front","back"]
     */
    side?: MonSide | MonSide[];

    /**
     * Render mon variant specific graphics.
     * 
     * Takes either a single string or an array with two strings.
     * 
     * @default ["normal","shiny"]
     */
    variant?: MonVariant | MonVariant[];
}

export interface RenderMonIconOptions extends RenderGenericOptions {

}

export interface RenderMonFootOptions extends RenderGenericOptions {

}

export interface MonSpriteMeta {
    side: "front" | "back";
    variant: "normal" | "shiny";
}

export interface MonIconMeta {
    frame: 1 | 2;
}

export interface MonFootprintMeta {

}

export type RenderAllMonsBufferResult =
    | (RenderedAsset<MonSpriteMeta> & {
        category: "mon";
        asset: "sprite";
    })
    | (RenderedAsset<MonIconMeta> & {
        category: "mon";
        asset: "icon";
    })
    | (RenderedAsset<MonFootprintMeta> & {
        category: "mon";
        asset: "footprint";
    });

export interface RenderAllResult {
    totalFileCount: number;
}

export interface RenderAllResultWithBuffers<T> extends RenderAllResult {
    finalResults: T[];
}

export type RenderMonBufferResult = RenderAllMonsBufferResult;

export type RenderMonIconBufferResult =
    (RenderedAsset<MonIconMeta>);

export type RenderMonFootBufferResult =
    (RenderedAsset<MonFootprintMeta>);

export interface RenderResult {
    fullFileCount: number;
}

export interface RenderResultWithBuffers<T> extends RenderResult {
    results: T[];
}

export interface ObjectDataEntry {
    index: number;
}

export type MonData =
    Record<string, ObjectDataEntry>;

/**
 * Extracts and renders all mon graphics from a Firered/Leafgreen ROM.
 * 
 * Handles front/back, normal/shiny, footprint, and icon graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllMons(
    rom: RomData,
    options?: RenderAllMonsOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderAllResultWithBuffers<RenderAllMonsBufferResult>>;

export function renderAllMons(
    rom: RomData,
    options?: RenderAllMonsOptions
): Promise<RenderAllResult>;

/**
 * Extracts and renders the graphics for a single mon from a Firered/Leafgreen ROM.
 * 
 * Capable of handling the front/back normal/shiny body sprites, footprint, and icon graphics of any single mon.
 * 
 * @param monName Name of the mon to render.
 * @param mons Mapping of mons to their index values.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderMon(
    monName: string,
    mons: MonData,
    reader: RomReader,
    rom: RomData,
    options?: RenderMonOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderMonBufferResult>>;

export function renderMon(
    monName: string,
    mons: MonData,
    reader: RomReader,
    rom: RomData,
    options?: RenderMonOptions,
): Promise<RenderResult>;

/**
 * Extracts and renders the icon graphic of a mon from a Firered/Leafgreen ROM.
 * 
 * @param monName Name of the mon to render.
 * @param mons Mapping of mons to their index values.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderMonIcon(
    monName: string,
    mons: MonData,
    reader: RomReader,
    rom: RomData,
    options?: RenderMonIconOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderMonIconBufferResult>>;

export function renderMonIcon(
    monName: string,
    mons: MonData,
    reader: RomReader,
    rom: RomData,
    options?: RenderMonIconOptions,
): Promise<RenderResult>;

/**
 * Extracts and renders the footprint graphic of a mon from a Firered/Leafgreen ROM.
 * 
 * @param monName Name of the mon footprint to render.
 * @param mons Mapping of mons to their index values.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderMonFoot(
    monName: string,
    mons: MonData,
    reader: RomReader,
    rom: RomData,
    options?: RenderMonFootOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderMonFootBufferResult>>;

export function renderMonFoot(
    monName: string,
    mons: MonData,
    reader: RomReader,
    rom: RomData,
    options?: RenderMonFootOptions
): Promise<RenderResult>;

export interface RenderAllIconsOptions extends RenderAllGenericOptions {
    // welp thats funny I guess this one has no unique options...
}

export interface RenderIconOptions extends RenderGenericOptions {

}

export interface IconSpriteMeta {

}

export type RenderAllIconsBufferResult = 
    | (RenderedAsset<IconSpriteMeta> & {
        category: "icon";
        asset: "sprite";
    });

export type RenderIconBufferResult = RenderAllIconsBufferResult;

export type IconData = Record<string, ObjectDataEntry>;

/**
 * Extracts and renders all icon graphics from a Firered/Leafgreen ROM.
 * 
 * Handles only icon graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllIcons(
    rom: RomData,
    options?: RenderAllIconsOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderAllResultWithBuffers<RenderAllIconsBufferResult>>;

export function renderAllIcons(
    rom: RomData,
    options?: RenderAllIconsOptions
): Promise<RenderAllResult>;

/**
 * Extracts and renders a item icon graphic from a Firered/Leafgreen ROM.
 * 
 * @param itemName Name of the item icon to render.
 * @param items Mapping of item icons to their index values.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderIcon(
    itemName: string,
    items: IconData,
    reader: RomReader,
    rom: RomData,
    options?: RenderIconOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderIconBufferResult>>;

export function renderIcon(
    itemName: string,
    items: IconData,
    reader: RomReader,
    rom: RomData,
    options?: RenderIconOptions
): Promise<RenderResult>;

export interface RenderAllTrainersOptions extends RenderAllGenericOptions {
    /**
     * Render trainer back graphics.
     * 
     * @default true
     */
    trainerBackPics?: boolean;
}

export interface RenderTrainerOptions extends RenderGenericOptions {
    /**
     * Render trainer back graphics.
     * 
     * @default true
     */
    trainerBackPics?: boolean;
}

export interface RenderTrainerBackPicOptions extends RenderGenericOptions {

}

export type TrainerData =
    Record<string, ObjectDataEntry>;

export type TrainerBackData = 
    Record<string, ObjectDataEntry>;

export interface TrainerFrameMeta {

}

export interface TrainerSpriteMeta {
    side: "front" | "back";
}

export type RenderAllTrainersBufferResult =
    | (RenderedAsset<TrainerFrameMeta> & {
        category: "trainer";
        asset: "frame";
    })
    | (RenderedAsset<TrainerSpriteMeta> & {
        category: "trainer";
        asset: "sprite";
    });

export type RenderTrainerBufferResult = RenderAllTrainersBufferResult;

export type RenderTrainerBackPicBufferResult =
    (RenderedAsset<TrainerFrameMeta>);

/**
 * Extracts and renders all trainer graphics from a Firered/Leafgreen ROM.
 * 
 * Handles trainer front and back graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllTrainers(
    rom: RomData,
    options?: RenderAllTrainersOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderAllResultWithBuffers<RenderAllTrainersBufferResult>>;

export function renderAllTrainers(
    rom: RomData,
    options?: RenderAllTrainersOptions
): Promise<RenderAllResult>;

/**
 * Extracts and renders a single trainer's graphic from a Firered/Leafgreen ROM.
 * 
 * @param trainerName Name of the trainer to render.
 * @param trainers Mapping of trainers to their index values.
 * @param backtrainers Mapping of trainers back graphics to their index values.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderTrainer(
    trainerName: string,
    trainers: TrainerData,
    backTrainers: TrainerBackData,
    reader: RomReader,
    rom: RomData,
    options?: RenderTrainerOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderTrainerBufferResult>>;

export function renderTrainer(
    trainerName: string,
    trainers: TrainerData,
    backTrainers: TrainerBackData,
    reader: RomReader,
    rom: RomData,
    options?: RenderTrainerOptions
): Promise<RenderResult>;

/**
 * Extracts and renders a trainer's back graphic from a Firered/Leafgreen ROM.
 * 
 * @param trainerName Name of the trainer to render.
 * @param trainers Mapping of trainers to their index values.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderTrainerBackPic(
    trainerName: string,
    trainers: TrainerBackData,
    reader: RomReader,
    rom: RomData,
    options?: RenderTrainerBackPicOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderTrainerBackPicBufferResult>>;

export function renderTrainerBackPic(
    trainerName: string,
    trainers: TrainerBackData,
    reader: RomReader,
    rom: RomData,
    options?: RenderTrainerBackPicOptions
): Promise<RenderResult>;

export interface RenderAllMovesOptions extends RenderAllGenericOptions {
    /**
     * Creates the original sprite sheet version of the move graphic.
     * 
     * Useful if you wish to display or archive the original graphic.
     * 
     * @default true
     */
    renderMasterImage?: boolean;

    /**
     * Sorts all unused moves into a sub directory.
     * 
     * Example:
     * 
     * If your outputDir was 
     * 
     * `out/Moves`
     * 
     * Then this would store the unused moves in
     * 
     * `out/Moves/unused`
     * 
     * @default true
     */
    sortUnused?: boolean;
}

export interface RenderMoveOptions extends RenderGenericOptions {
    /**
     * Creates the original sprite sheet version of the move graphic.
     * 
     * Useful if you wish to display or archive the original graphic.
     * 
     * @default true
     */
    renderMasterImage?: boolean;

    /**
     * Sorts all unused moves into a sub directory.
     * 
     * Example:
     * 
     * If your outputDir was 
     * 
     * `out/Moves`
     * 
     * Then this would store the unused moves in
     * 
     * `out/Moves/unused`
     * 
     * @default true
     */
    sortUnused?: boolean;
}

export interface MoveSpriteMeta {

}

export interface MoveFrameMeta {
    frame: number;
}

export type RenderAllMovesBufferResult =
    | (RenderedAsset<MoveSpriteMeta> & {
        category: "move";
        asset: "sprite";
    })
    | (RenderedAsset<MoveFrameMeta> & {
        category: "move";
        asset: "frame";
    });

export type RenderMoveBufferResult = RenderAllMovesBufferResult;

export interface Frame {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface MoveDataEntry {
    index: number;
    animTag: string;
    imageSize: string;
    imageWidth: number;
    imageHeight: number;
    frameCount: number;
    frames: Frame[];
    note?: string;
    unused?: boolean;
}

export type MoveData =
    Record<string, MoveDataEntry>;

/**
 * Extracts, renders, and cuts all move graphics from a Firered/Leafgreen ROM.
 * 
 * Handles both used and unused move graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllMoves(
    rom: RomData,
    options?: RenderAllMovesOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderAllResultWithBuffers<RenderAllMovesBufferResult>>;

export function renderAllMoves(
    rom: RomData,
    options?: RenderAllMovesOptions
): Promise<RenderAllResult>;

/**
 * Extracts and renders a move graphic from a Firered/Leafgreen ROM.
 * 
 * @param moveName Name of the move to render.
 * @param moves Mapping of moves to their index values, frames, and dimensions.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderMove(
    moveName: string,
    moves: MoveData,
    reader: RomReader,
    rom: RomData,
    options?: RenderMoveOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderMoveBufferResult>>;

export function renderMove(
    moveName: string,
    moves: MoveData,
    reader: RomReader,
    rom: RomData,
    options?: RenderMoveOptions
): Promise<RenderResult>;

export interface RenderAllBallsOptions extends RenderAllGenericOptions {
    /**
     * Render ball particle graphics.
     * 
     * @default true
     */
    ballParticles?: boolean;

    /**
     * Creates the original sprite sheet version of the ball graphic.
     * 
     * Useful if you wish to display or archive the original graphic.
     * 
     * @default true
     */
    renderMasterBallImage?: boolean;

    /**
     * Creates the original sprite sheet version of the ball particle graphic.
     * 
     * Useful if you wish to display or archive the original graphic.
     * 
     * @default true
     */
    renderMasterBallParticleImage?: boolean;
}

export interface RenderBallOptions extends RenderGenericOptions {
    /**
     * Render ball particle graphics.
     * 
     * @default true
     */
    ballParticles?: boolean;

    /**
     * Creates the original sprite sheet version of the ball graphic.
     * 
     * Useful if you wish to display or archive the original graphic.
     * 
     * @default true
     */
    renderMasterBallImage?: boolean;

    /**
     * Creates the original sprite sheet version of the ball particle graphic.
     * 
     * Useful if you wish to display or archive the original graphic.
     * 
     * @default true
     */
    renderMasterBallParticleImage?: boolean;
}

export interface RenderBallParticleOptions extends RenderGenericOptions {
    /**
     * Creates the original sprite sheet version of the ball particle graphic.
     * 
     * Useful if you wish to display or archive the original graphic.
     * 
     * @default true
     */
    renderMasterBallParticleImage?: boolean;
}

export interface BallSpriteMeta {
    particleOrBall: "particle" | "ball";
}

export interface BallFrameMeta {
    frame: number;
    particleOrBall: "particle" | "ball";
}

export type RenderAllBallsBufferResult =
    | (RenderedAsset<BallSpriteMeta> & {
        category: "ball";
        asset: "sprite";
    })
    | (RenderedAsset<BallFrameMeta> & {
        category: "ball";
        asset: "frame";
    });

export type RenderBallBufferResult = RenderAllBallsBufferResult;

export type RenderBallParticleBufferResult = RenderAllBallsBufferResult;

export interface BallDataEntry {
    index: number;
    frameCount: number;
    frames: Frame[];
    particleFrameCount: number;
    particleFrames: Frame[];
}

export type BallData =
    Record<string, BallDataEntry>;

/**
 * Extracts, renders, and cuts all ball graphics from a Firered/Leafgreen ROM.
 * 
 * Handles both ball and ball particle graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllBalls(
    rom: RomData,
    options?: RenderAllBallsOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderAllResultWithBuffers<RenderAllBallsBufferResult>>;

export function renderAllBalls(
    rom: RomData,
    options?: RenderAllBallsOptions
): Promise<RenderAllResult>;

/**
 * Extracts and renders a ball graphic from a Firered/Leafgreen ROM.
 * 
 * @param ballName Name of the ball to render.
 * @param balls Mapping of balls to their index values and frames.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderBall(
    ballName: string,
    balls: BallData,
    reader: RomReader,
    rom: RomData,
    options?: RenderBallOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderBallBufferResult>>;

export function renderBall(
    ballName: string,
    balls: BallData,
    reader: RomReader,
    rom: RomData,
    options?: RenderBallOptions
): Promise<RenderResult>;

/**
 * Extracts and renders a ball particle graphic from a Firered/Leafgreen ROM.
 * 
 * @param ballName Name of the ball to render.
 * @param balls Mapping of balls to their index values and frames.
 * @param reader RomReader used for pointer resolution.
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderBallParticle(
    ballName: string,
    balls: BallData,
    reader: RomReader,
    rom: RomData,
    options?: RenderBallParticleOptions & {
        returnFileBuffer: true,
    }
): Promise<RenderResultWithBuffers<RenderBallParticleBufferResult>>;

export function renderBallParticle(
    ballName: string,
    balls: BallData,
    reader: RomReader,
    rom: RomData,
    options?: RenderBallParticleOptions
): Promise<RenderResult>;

export interface RenderAllGraphicsOptions extends Omit<RenderAllGenericOptions, "outputDir"> {
    /**
     * Directory to write extracted mon assets to.
     *
     * If omitted (set to `null`) and `returnFileBuffer` is enabled, files can be
     * consumed directly from memory without being written to disk.
     *
     * @default "./out/mons"
     */
    outputMonDir?: string | null;

    /**
     * Directory to write extracted icon assets to.
     *
     * If omitted (set to `null`) and `returnFileBuffer` is enabled, files can be
     * consumed directly from memory without being written to disk.
     *
     * @default "./out/icons"
     */
    outputIconDir?: string | null;

    /**
     * Directory to write extracted trainer assets to.
     *
     * If omitted (set to `null`) and `returnFileBuffer` is enabled, files can be
     * consumed directly from memory without being written to disk.
     *
     * @default "./out/trainers"
     */
    outputTrainerDir?: string | null;

    /**
     * Directory to write extracted move assets to.
     *
     * If omitted (set to `null`) and `returnFileBuffer` is enabled, files can be
     * consumed directly from memory without being written to disk.
     *
     * @default "./out/moves"
     */
    outputMoveDir?: string | null;

    /**
     * Sorts all unused moves into a sub directory.
     * 
     * Example:
     * 
     * If your outputDir was 
     * 
     * `out/Moves`
     * 
     * Then this would store the unused moves in
     * 
     * `out/Moves/unused`
     * 
     * @default true
     */
    sortUnusedMoves?: boolean;

    /**
     * Directory to write extracted balls assets to.
     *
     * If omitted and `returnFileBuffer` is enabled, files can be
     * consumed directly from memory without being written to disk.
     *
     * @default "./out/balls"
     */
    outputBallDir?: string;
}

export type RenderAllGraphicsBufferResult =
    | RenderAllMonsBufferResult
    | RenderAllIconsBufferResult
    | RenderAllTrainersBufferResult
    | RenderAllMovesBufferResult
    | RenderAllBallsBufferResult;

/**
 * Extracts and renders all graphics from a Firered/Leafgreen ROM.
 * 
 * Handles everything currently handled by all other separate render functions.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllGraphics(
    rom: RomData,
    options?: RenderAllGraphicsOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderAllResultWithBuffers<RenderAllGraphicsBufferResult>>;

export function renderAllGraphics(
    rom: RomData,
    options?: RenderAllGraphicsOptions
): Promise<RenderAllResult>;