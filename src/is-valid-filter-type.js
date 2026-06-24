// Copyright (c) 2026 chickenPoo
// Licensed under the MIT License. See LICENSE file in project root.

export function isValidFilterType(filterTypeValue) {
    if (Number.isInteger(filterTypeValue)) {
        return filterTypeValue >= -1 && filterTypeValue <= 4;
    }
    if (Array.isArray(filterTypeValue)) {
        return filterTypeValue.length > 0 && filterTypeValue.every(entry =>
            Number.isInteger(entry) && entry >= 0 && entry <= 4
        );
    }

    return false;
}