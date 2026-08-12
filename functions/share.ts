import { getArea, isValidCell, mapCardImage, statusMeta } from '../src/areas';

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export const onRequestGet: PagesFunction = async ({ request }) => {
  const url = new URL(request.url);
  const areaId = url.searchParams.get('area') ?? '';
  const area = getArea(areaId);
  const rawCell = url.searchParams.get('cell') ?? '';
  const cell = area?.map && isValidCell(area.id, rawCell) ? rawCell : '';
  const rawStatus = Number(url.searchParams.get('status'));
  const statusValue = [1, 2, 3].includes(rawStatus) ? rawStatus : 2;
  const status = statusMeta(statusValue);

  const place = area ? `${area.short}${cell ? ` ${cell}` : ''}` : 'コミケ会場';
  const title = `${place}で${status.label}｜CoCoS`;
  const description = `いま「${status.label}」です。`;
  const cardImage = area?.map ? mapCardImage(area.id, cell) : null;
  const image = cardImage ? new URL(cardImage, url.origin).href : null;
  const canonicalUrl = url.href;

  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeCanonicalUrl = escapeHtml(canonicalUrl);
  const safeImage = image ? escapeHtml(image) : null;

  const imageMeta = safeImage
    ? `
    <meta property="og:image" content="${safeImage}">
    <meta property="og:image:alt" content="${escapeHtml(`${place}の見取り図`)}">
    <meta name="twitter:image" content="${safeImage}">
    <meta name="twitter:image:alt" content="${escapeHtml(`${place}の見取り図`)}">`
    : '';

  const imageContent = safeImage
    ? `<img src="${safeImage}" alt="${escapeHtml(`${place}の見取り図`)}">`
    : '';

  const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDescription}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="${safeCanonicalUrl}">
    <meta property="og:title" content="${safeTitle}">
    <meta property="og:description" content="${safeDescription}">
    <meta name="twitter:card" content="${safeImage ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${safeTitle}">
    <meta name="twitter:description" content="${safeDescription}">${imageMeta}
    <style>
      :root { color-scheme: light; font-family: system-ui, sans-serif; }
      body { margin: 0; padding: 24px; background: #f4f3ee; color: #171816; }
      main { max-width: 640px; margin: 40px auto; overflow: hidden; background: #fffefa; border: 2px solid #171816; border-radius: 14px; box-shadow: 5px 5px 0 #171816; }
      header { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #ffd21f; border-bottom: 2px solid #171816; font-family: ui-monospace, monospace; font-size: 11px; font-weight: 700; letter-spacing: .08em; }
      header img { width: 34px; height: 34px; object-fit: contain; }
      img { display: block; width: 100%; height: auto; }
      section { padding: 20px; }
      h1 { margin: 0 0 8px; font-size: 24px; }
      p { margin: 0 0 20px; color: #5c6270; }
      a { display: inline-block; padding: 12px 18px; color: #fff; background: #171816; border: 2px solid #171816; border-radius: 8px; font-weight: 700; text-decoration: none; }
    </style>
  </head>
  <body>
    <main>
      <header><img src="/brand/cocos-icon.png" alt=""> CoCoS // LOCATION SIGNAL</header>
      ${imageContent}
      <section>
        <h1>${safeTitle}</h1>
        <p>${safeDescription}</p>
        <a href="/">ImaCoCoSで投稿を作る</a>
      </section>
    </main>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
    },
  });
};
