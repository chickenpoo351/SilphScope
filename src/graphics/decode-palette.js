export function decodePalette(data) {
    const colors = [];
    for (let i = 0; i < data.length; i += 2) {
        const value = data[i] | (data[i + 1] << 8);
        let r = value & 0x1F;
        let g = (value >> 5) & 0x1F;
        let b = (value >> 10) & 0x1F;
        r = Math.floor((r * 255) / 31);
        g = Math.floor((g * 255) / 31);
        b = Math.floor((b * 255) / 31);
        colors.push([r, g, b]);
    }
    return colors;
}