// Xの共有カード用に、グリッドと選択セルを焼き込んだ画像を生成する。
// src/areas.ts の地図定義をそのまま使うため、区画変更時も build だけで追従する。
import { mkdir, readdir, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';
import { AREAS, mapCells } from '../src/areas.ts';

const publicDir = join(process.cwd(), 'public');

function pointsAttribute(points, width, height) {
  return points.map((point) => `${point.x * width},${point.y * height}`).join(' ');
}

for (const area of AREAS) {
  if (!area.map) continue;

  // 区画を持たないエリア（案内図だけ・休憩中など）は焼き込む対象がない
  if (mapCells(area.map).length === 0) continue;

  const input = join(publicDir, area.map.image.replace(/^\//, ''));
  const metadata = await sharp(input).metadata();
  const width = metadata.width;
  const height = metadata.height;

  if (!width || !height) throw new Error(`画像サイズを取得できません: ${input}`);

  const outputDir = join(publicDir, 'maps', 'cards');
  await mkdir(outputDir, { recursive: true });

  for (const filename of await readdir(outputDir)) {
    if (filename.startsWith(`${area.id}-`) && filename.endsWith('.webp')) {
      await unlink(join(outputDir, filename));
    }
  }

  const mapCellItems = mapCells(area.map);

  for (const selectedCell of mapCellItems) {
    const selectedId = selectedCell.id;
    const cells = [];

    for (const mapCell of mapCellItems) {
      const id = mapCell.id;
      const selected = id === selectedId;

      cells.push(`
            <polygon
              points="${pointsAttribute(mapCell.polygon, width, height)}"
              fill="#ffd21f"
              fill-opacity="${selected ? '0.78' : '0.16'}"
              stroke="${selected ? '#171816' : '#ffffff'}"
              stroke-width="${selected ? '9' : '5'}"
              stroke-linejoin="round"
            />
            <text
              x="${mapCell.label.x * width}"
              y="${mapCell.label.y * height}"
              fill="#ffffff"
              stroke="#171816"
              stroke-width="6"
              paint-order="stroke"
              font-family="Consolas, monospace"
              font-size="34"
              font-weight="800"
              text-anchor="middle"
              dominant-baseline="middle"
            >${id}</text>`);
    }

    const overlay = Buffer.from(`
        <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
          ${cells.join('')}
        </svg>`);

    const output = join(outputDir, `${area.id}-${selectedId.toLowerCase()}.webp`);
    await sharp(input)
      .composite([{ input: overlay }])
      .webp({ quality: 82 })
      .toFile(output);

    console.log(`${output.slice(process.cwd().length + 1)}  ${width}x${height}`);
  }
}
