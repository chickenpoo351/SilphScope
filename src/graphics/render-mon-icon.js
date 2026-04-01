import { decode4bppTile } from "./decode-4bpp.js";
import { decodePalette } from "./decode-palette.js";
import { extract } from "./extract.js";
import { PNG } from "pngjs";
import fs from "fs";

export async function renderMonIcon(monName, mons, assets, iconPalettes) { // eh I skipped the safety stuff for this but it should be fine... I hope...
    return new Promise((resolve, reject) => {
        const mon = mons[monName];
        const iconAsset = assets.find(a => a.name === mon.Icon);
        const iconData = extract(iconAsset);
        const palIndex = Number(mon.iconPalIndex);
        const palSize = 32;
        const palStart = palIndex * palSize;
        const palEnd = palStart + palSize;
        const rawIconPalData = extract(iconPalettes);
        const slicedPalData = rawIconPalData.data.slice(palStart, palEnd);
        const palette = decodePalette(slicedPalData);
        const tiles = []
        const tileSize = 32;
        const numTiles = iconData.data.length / tileSize;
        const width = 32;
        const height = 64;
        const tilesPerRow = width / 8;
        for (let i = 0; i < numTiles; i++) {
            const start = i * tileSize;
            const tileBytes = iconData.data.slice(start, start + tileSize);
            tiles.push(decode4bppTile(tileBytes));
        }
        const image = new Uint8ClampedArray(width * height * 4);
        for (let t = 0; t < tiles.length; t++) {
            const tile = tiles[t];
            const tileX = t % tilesPerRow;
            const tileY = Math.floor(t / tilesPerRow);
            for (let py = 0; py < 8; py++) {
                for (let px = 0; px < 8; px++) {
                    const pixelIndex = py * 8 + px;
                    const colorIndex = tile[pixelIndex];
                    const x = tileX * 8 + px;
                    const y = tileY * 8 + py;
                    const outIndex = (y * width + x) * 4;
                    const [r, g, b] = palette[colorIndex] || [0, 0, 0];
                    image[outIndex] = r;
                    image[outIndex + 1] = g;
                    image[outIndex + 2] = b;
                    image[outIndex + 3] = colorIndex === 0 ? 0 : 255;
                }
            }
        }
        const png = new PNG({ width, height });
        png.data = image;
        const dir = `./out/${monName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        const fileName = `${dir}/icon.png`;
        const stream = fs.createWriteStream(fileName);
        stream.on("finish", resolve);
        stream.on("error", reject);
        png.pack().pipe(stream);
    })
}