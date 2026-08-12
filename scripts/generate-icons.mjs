// ホーム画面アイコンとファビコンを生成する。
// 元絵は余白が広く、そのまま縮小するとマークが小さくなりすぎるため、
// いったん余白を切り落としてから正方形の下地に置き直す。
//
// iOS の apple-touch-icon は透過を扱えず、透けた部分が黒くなる。
// さらに中身が不透明でもアルファチャンネルが残っているとアイコンを拾わないことが
// あるため、出力時に removeAlpha() でチャンネルごと落としている。
//
//   node scripts/generate-icons.mjs
//
// アイコンが変わらない限り実行は不要なので、build には含めていない。
// 差し替えたときは index.html の apple-touch-icon の ?v= も上げること。
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'public/brand/cocos-app-icon.webp';
/** 元絵の地色。同じ色で塗ると合成の継ぎ目が出ない */
const BACKGROUND = { r: 249, g: 247, b: 245, alpha: 1 };

async function render(size, markRatio, output) {
  const mark = await sharp(SOURCE)
    .trim({ threshold: 10 })
    .resize({ height: Math.round(size * markRatio) })
    .toBuffer();

  const info = await sharp({
    create: { width: size, height: size, channels: 4, background: BACKGROUND },
  })
    .composite([{ input: mark, gravity: 'center' }])
    .removeAlpha()
    .png()
    .toFile(output);

  console.log(`${output}  ${size}x${size}  ${Math.round(info.size / 1024)}KB`);
}

await mkdir('public/icons', { recursive: true });

// iOS のホーム画面用。角丸は端末側で付くので、こちらは正方形のまま渡す
await render(180, 0.8, 'public/apple-touch-icon.png');

await render(192, 0.8, 'public/icons/icon-192.png');
await render(512, 0.8, 'public/icons/icon-512.png');

// Android は円形に切り抜くことがあるため、切られても欠けないよう余白を広く取る
await render(512, 0.6, 'public/icons/icon-maskable-512.png');

// タブに出るファビコン。小さいので、余白は詰めて絵を大きく見せる
await render(32, 0.92, 'public/icons/favicon-32.png');
await render(48, 0.92, 'public/icons/favicon-48.png');
