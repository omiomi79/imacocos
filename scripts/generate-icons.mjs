// ホーム画面に追加したときのアイコンを生成する。
// ロゴマークが縦長なので、正方形の下地に余白付きで中央配置する。
// iOS の apple-touch-icon は透過を扱えず、透けた部分が黒くなるため必ず塗りつぶすこと。
//
//   node scripts/generate-icons.mjs
//
// アイコンが変わらない限り実行は不要なので、build には含めていない。
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'public/brand/cocos-mark.webp';
/** cocos-mark.webp の地色。同じ色で塗ると合成の継ぎ目が出ない */
const BACKGROUND = { r: 251, g: 249, b: 247, alpha: 1 };

async function render(size, markRatio, output) {
  const mark = await sharp(SOURCE)
    .resize({ height: Math.round(size * markRatio) })
    .toBuffer();

  const info = await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .png()
    .toFile(output);

  console.log(`${output}  ${size}x${size}  ${Math.round(info.size / 1024)}KB`);
}

await mkdir('public/icons', { recursive: true });

// iOS のホーム画面用。角丸は端末側で付くので、こちらは正方形のまま渡す
await render(180, 0.78, 'public/apple-touch-icon.png');

await render(192, 0.78, 'public/icons/icon-192.png');
await render(512, 0.78, 'public/icons/icon-512.png');

// Android は円形に切り抜くことがあるため、切られても欠けないよう余白を広く取る
await render(512, 0.6, 'public/icons/icon-maskable-512.png');
