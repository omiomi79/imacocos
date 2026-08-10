// Xのカード（OGP）用の共有ページを、場所×状態の全組み合わせぶん静的に生成する。
// GitHub Pages は静的配信しかできないため、動的な /share の代わりにビルド時へ前倒しする。
// vite build のあとに実行すること（dist が作り直されるため）。
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AREAS, COSPLAYER_STATUSES, mapCardImage, mapCells } from '../src/areas.ts';
import { SITE_URL, sharePageSlug } from '../src/siteConfig.ts';

const distDir = join(process.cwd(), 'dist');

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

/** ルート相対のパスを、OGPが要求する絶対URLに変換する */
function absoluteUrl(path) {
  return new URL(path.replace(/^\//, ''), SITE_URL).href;
}

function renderPage({ title, description, canonical, image, imageAlt }) {
  const safe = {
    title: escapeHtml(title),
    description: escapeHtml(description),
    canonical: escapeHtml(canonical),
    image: image ? escapeHtml(image) : null,
    imageAlt: escapeHtml(imageAlt),
    site: escapeHtml(SITE_URL),
    icon: escapeHtml(absoluteUrl('/brand/cocos-icon.png')),
  };

  const imageMeta = safe.image
    ? `
    <meta property="og:image" content="${safe.image}">
    <meta property="og:image:alt" content="${safe.imageAlt}">
    <meta name="twitter:image" content="${safe.image}">
    <meta name="twitter:image:alt" content="${safe.imageAlt}">`
    : '';

  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/png" href="${safe.icon}">
    <title>${safe.title}</title>
    <meta name="description" content="${safe.description}">
    <link rel="canonical" href="${safe.canonical}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="CoCoS">
    <meta property="og:url" content="${safe.canonical}">
    <meta property="og:title" content="${safe.title}">
    <meta property="og:description" content="${safe.description}">
    <meta name="twitter:card" content="${safe.image ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${safe.title}">
    <meta name="twitter:description" content="${safe.description}">${imageMeta}
    <style>
      :root { color-scheme: light; }
      body { margin: 0; padding: 24px; color: #171816; background: #f4f3ee;
        font-family: system-ui, -apple-system, "Hiragino Kaku Gothic ProN", "Noto Sans JP", sans-serif; }
      main { max-width: 640px; margin: 32px auto; overflow: hidden; background: #fffefa;
        border: 2px solid #171816; border-radius: 14px; box-shadow: 5px 5px 0 #171816; }
      header { display: flex; align-items: center; gap: 10px; padding: 12px 16px;
        background: #ffd21f; border-bottom: 2px solid #171816;
        font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; letter-spacing: .08em; }
      header img { width: 32px; height: 32px; object-fit: contain; }
      main > img { display: block; width: 100%; height: auto; border-bottom: 2px solid #171816; }
      section { padding: 20px; }
      h1 { margin: 0 0 8px; font-size: 22px; }
      p { margin: 0 0 20px; color: #5e605b; font-size: 14px; }
      .who { margin: 0 0 6px; color: #171816; font-size: 14px; font-weight: 700; }
      .who a { color: #171816; }
      .cta { display: inline-block; padding: 12px 18px; color: #fffefa; background: #171816;
        border-radius: 8px; font-weight: 700; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <header><img src="${safe.icon}" alt=""> CoCoS // LOCATION SIGNAL</header>
      ${safe.image ? `<img src="${safe.image}" alt="${safe.imageAlt}">` : ''}
      <section>
        <p class="who" id="who" hidden></p>
        <h1>${safe.title}</h1>
        <p>${safe.description}</p>
        <a class="cta" href="${safe.site}">CoCoSで自分の場所を共有する</a>
      </section>
    </main>
    <script>
      // 誰の現在地かは ?u= で受け取る。ページはビルド時に固定されるため、
      // 表示はここで組み立てる（Xのカード自体には反映されない）。
      (function () {
        var id = new URLSearchParams(location.search).get('u') || '';
        if (!/^[A-Za-z0-9_]{1,15}$/.test(id)) return;

        var link = document.createElement('a');
        link.href = 'https://x.com/' + id;
        link.rel = 'noopener noreferrer';
        link.textContent = '@' + id;

        var line = document.getElementById('who');
        line.appendChild(link);
        line.appendChild(document.createTextNode(' さんの現在地'));
        line.hidden = false;

        document.title = '@' + id + ' / ' + document.title;
      })();
    </script>
  </body>
</html>
`;
}

let count = 0;

for (const area of AREAS) {
  const cells = area.map ? mapCells(area.map) : [];
  // 区画を持たないエリア（案内図だけのエリア）はセルなしの1件として扱う
  const cellIds = cells.length > 0 ? cells.map((cell) => cell.id) : [''];

  for (const cell of cellIds) {
    for (const status of COSPLAYER_STATUSES) {
      const slug = sharePageSlug(area.id, cell, status.value);
      const place = `${area.short}${cell ? ` ${cell}` : ''}`;
      const cardImage = mapCardImage(area.id, cell);

      const html = renderPage({
        title: `${place}で${status.label}｜CoCoS`,
        description: `コスプレイヤーさんは現在「${status.label}」です。`,
        canonical: new URL(`s/${slug}/`, SITE_URL).href,
        image: cardImage ? absoluteUrl(cardImage) : null,
        imageAlt: `${place}の見取り図`,
      });

      const outDir = join(distDir, 's', slug);
      await mkdir(outDir, { recursive: true });
      await writeFile(join(outDir, 'index.html'), html, 'utf8');
      count += 1;
    }
  }
}

console.log(`share pages: ${count} 件を dist/s/ に生成`);
