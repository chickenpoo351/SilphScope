export interface RenderedAsset<Meta>  {
    name: string;
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


export interface RenderAllGenericOptions {
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

export interface RenderResult {
    totalFileCount: number;
}

export interface RenderResultWithBuffers<T> extends RenderResult {
    finalResults: T[];
}

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
): Promise<RenderResultWithBuffers<RenderAllMonsBufferResult>>;

/**
 * Extracts and renders all mon graphics from a Firered/Leafgreen ROM.
 * 
 * Handles front/back, normal/shiny, footprint, and icon graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */ // I have no idea if I have to write this twice... nonetheless here it is I suppose :p
export function renderAllMons(
    rom: RomData,
    options?: RenderAllMonsOptions
): Promise<RenderResult>;

export interface RenderAllIconsOptions extends RenderAllGenericOptions {
    // welp thats funny I guess this one has no unique options...
}

export interface IconSpriteMeta {

}

export type RenderAllIconsBufferResult = 
    | (RenderedAsset<IconSpriteMeta> & {
        category: "icon";
        asset: "sprite";
    });

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
): Promise<RenderResultWithBuffers<RenderAllIconsBufferResult>>;

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
    options?: RenderAllIconsOptions
): Promise<RenderResult>;

export interface RenderAllTrainersOptions extends RenderAllGenericOptions {
    /**
     * Render trainer back graphics.
     * 
     * @default true
     */
    trainerBackPics?: boolean;
}

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
): Promise<RenderResultWithBuffers<RenderAllTrainersBufferResult>>;

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
    options?: RenderAllTrainersOptions
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

export interface MoveSpriteMeta {

}

export interface MoveFrameMeta {

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
): Promise<RenderResultWithBuffers<RenderAllMovesBufferResult>>;

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
    options?: RenderAllMovesOptions
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

export interface BallSpriteMeta {
    particleOrBall: "particle" | "ball";
}

export interface BallFrameMeta {
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
): Promise<RenderResultWithBuffers<RenderAllBallsBufferResult>>;

/**
 * Extracts renders, and cuts all ball graphics from a Firered/Leafgreen ROM.
 * 
 * Handles both ball and ball particle graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllBalls(
    rom: RomData,
    options?: RenderAllBallsOptions
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
    | RenderAllMovesBufferResult
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
): Promise<RenderResultWithBuffers<RenderAllGraphicsBufferResult>>;

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
    options?: RenderAllGraphicsOptions
): Promise<RenderResult>;