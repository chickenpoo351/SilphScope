// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

import { isValidFilterType } from "./is-valid-filter-type.js";

export function validateRenderOptions(functionName, options = {}) {
    const {
        concurrency = null,
        filterType = null,
        compressionLevel = null,
    } = options;

    if (concurrency !== null && concurrency !== undefined) {
        if (!Number.isInteger(concurrency)) {
            throw new TypeError(`${functionName}(rom, options = { concurrency, ... }) requires concurrency to be a integer greater than 0 (received ${concurrency})`);
        }
    }
    if (filterType !== null && filterType !== undefined) {
        if (!isValidFilterType(filterType)) {
            throw new TypeError(`${functionName}renderAllMons(rom, options = { pngFilterType, ... }) requires pngFilterType to be a integer between -1 and 4 (received ${filterType})`)
        }
    }
    if (compressionLevel !== null && compressionLevel !== undefined) {
        if (!Number.isInteger(compressionLevel) || compressionLevel < 0 || compressionLevel > 9) {
            throw new TypeError(`${functionName}renderAllMons(rom, options = { pngCompressionLevel, ... }) requires pngCompressionLevel to be a integer between 0 and 9 (received ${compressionLevel})`)
        }
    }
}