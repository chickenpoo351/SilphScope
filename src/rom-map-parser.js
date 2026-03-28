import fs from "fs";
import path from "path";

const frRomMap = path.resolve("../rom-maps/pokefirered.map");
const lines = fs.readFileSync(frRomMap, "utf-8").split("\n");
const symbols = [];

for (const line of lines) {
    const match = line.match(/^\s*0x([0-9a-fA-F]+)\s+([A-Za-z0-9_]+)$/);
    if (!match) continue;

    const address = parseInt(match[1], 16);
    const name = match[2];
    if (!name.startsWith('g')) continue;

    if (address >= 0x08d00000 && address <= 0x08ffffff) {
        symbols.push({ name, address });
    }
}

symbols.sort((a, b) => a.address - b.address);

const romEnd = 0x09ffffff;

function findNextAddressFromLines(currentAddress, lines) {
    for (const line of lines) {
        const match = line.match(/0x([0-9a-fA-F]+)/);
        if (!match) continue;

        const addr = parseInt(match[1], 16);
        if (addr > currentAddress) return addr;
    }
    return null;
}

for (let i = 0; i < symbols.length; i++) {
    const current = symbols[i];
    const next = symbols[i + 1];
    current.size = next
        ? next.address - current.address
        : romEnd - current.address; // really not needed anymore since like I actually fixed the thing instead of relying on this garbage thingy
    current.offset = current.address - 0x08000000;
    if (!next) {
        const nextAddress = findNextAddressFromLines(current.address, lines);
        current.size = nextAddress
            ? nextAddress - current.address
            : 0;
    }
}

function classifyType(name) {
    if (name.includes('Pal')) return "palette";
    if (name.includes("Tilemap")) return "tilemap";
    if (name.includes("Gfx") || name.includes("Pic")) return "gfx";
    return "unknown";
}

for (const sym of symbols) {
    sym.type = classifyType(sym.name);
}

fs.writeFileSync("../graphics-maps/fr-graphic-map.json", JSON.stringify(symbols, null, 2));