type PngFilterType = 
    | -1
    | 0
    | 1
    | 2
    | 3
    | 4
    | Array<0 | 1 | 2 | 3 | 4>

export interface RenderAllMonsOptions {
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
    returnFileBuffer?: boolean; // this stuff is annoying to write lol

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

export interface RenderResult {
    totalFileCount: number;
}

export interface RenderResultWithBuffers extends RenderResult {
    finalResults: Buffer[];
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
    rom: Uint8Array | Buffer,
    options?: RenderAllMonsOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderResultWithBuffers>;

/**
 * Extracts and renders all mon graphics from a Firered/Leafgreen ROM.
 * 
 * Handles front/back, normal/shiny, footprint, and icon graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */ // I have no idea if I have to write this twice... nonetheless here it is I suppose :p
export function renderAllMons(
    rom: Uint8Array | Buffer,
    options?: RenderAllMonsOptions
): Promise<RenderResult>;

export interface RenderAllIconsOptions {
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

/**
 * Extracts and renders all icon graphics from a Firered/Leafgreen ROM.
 * 
 * Handles only icon graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllIcons(
    rom: Uint8Array | Buffer,
    options?: RenderAllIconsOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderResultWithBuffers>;

/**
 * Extracts and renders all icon graphics from a Firered/Leafgreen ROM.
 * 
 * Handles only icon graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllIcons(
    rom: Uint8Array | Buffer,
    options?: RenderAllIconsOptions
): Promise<RenderResult>;

export interface RenderAllTrainersOptions {
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

    /**
     * Render trainer back graphics.
     * 
     * @default true
     */
    trainerBackPics?: boolean;
}

/**
 * Extracts and renders all trainer graphics from a Firered/Leafgreen ROM.
 * 
 * Handles trainer front and back graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllTrainers(
    rom: Uint8Array | Buffer,
    options?: RenderAllTrainersOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderResultWithBuffers>;

/**
 * Extracts and renders all trainer graphics from a Firered/Leafgreen ROM.
 * 
 * Handles trainer front and back graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllTrainers(
    rom: Uint8Array | Buffer,
    options?: RenderAllTrainersOptions
): Promise<RenderResult>;

export interface RenderAllMovesOptions {
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

    /**
     * Creates the original sprite sheet version of the move graphic.
     * 
     * Useful if you wish to display or archive the original graphic.
     * 
     * @default true
     */
    renderMasterImage?: boolean;

    /**
   (set to `null`)   * Sorts all unused moves into a sub directory.
     * 
     * Example:
     * 
     * If your outputDir was 
    | null  * 
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

/**
 * Extracts, renders, and cuts all move graphics from a Firered/Leafgreen ROM.
 * 
 * Handles both used and unused move graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllMoves(
    rom: Uint8Array | Buffer,
    options?: RenderAllMovesOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderResultWithBuffers>;

/**
 * Extracts, renders, and cuts all move graphics from a Firered/Leafgreen ROM.
 * 
 * Handles both used and unused move graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllMoves(
    rom: Uint8Array | Buffer,
    options?: RenderAllMovesOptions
): Promise<RenderResult>;

export interface RenderAllBallsOptions {
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

/**
 * Extracts, renders, and cuts all ball graphics from a Firered/Leafgreen ROM.
 * 
 * Handles both ball and ball particle graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllBalls(
    rom: Uint8Array | Buffer,
    options?: RenderAllBallsOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderResultWithBuffers>;

/**
 * Extracts renders, and cuts all ball graphics from a Firered/Leafgreen ROM.
 * 
 * Handles both ball and ball particle graphics.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllBalls(
    rom: Uint8Array | Buffer,
    options?: RenderAllBallsOptions
): Promise<RenderResult>;

export interface RenderAllGraphicsOptions {

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
    sortUnusedMoves: boolean;

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

/**
 * Extracts and renders all graphics from a Firered/Leafgreen ROM.
 * 
 * Handles everything currently handled by all other separate render functions.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllGraphics(
    rom: Uint8Array | Buffer,
    options?: RenderAllGraphicsOptions & {
        returnFileBuffer: true;
    }
): Promise<RenderResultWithBuffers>;

/**
 * Extracts and renders all graphics from a Firered/Leafgreen ROM.
 * 
 * Handles everything currently handled by all other separate render functions.
 * 
 * @param rom The Firered/Leafgreen ROM file as a Buffer or Uint8Array.
 * @param options Optional configuration for rendering behaviour and other options.
 */
export function renderAllGraphics(
    rom: Uint8Array | Buffer,
    options?: RenderAllGraphicsOptions
): Promise<RenderResult>;