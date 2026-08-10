// エリアの見取り図をWebPに変換して public/maps/ に置く。
// 会場は電波が細いので、元画像をそのまま積まないこと。
//
//   node scripts/optimize-map.mjs "C:\path\to\source.png" rooftop
//
import { mkdir } from 'node:fs/promises';
import { argv } from 'node:process';
import sharp from 'sharp';

const [, , input, name] = argv;

if (!input || !name) {
  console.error('usage: node scripts/optimize-map.mjs <入力画像> <出力名>');
  process.exit(1);
}

const outDir = 'public/maps';
await mkdir(outDir, { recursive: true });

const out = `${outDir}/${name}.webp`;
const info = await sharp(input)
  .resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(out);

console.log(`${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)}KB`);
