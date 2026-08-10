/**
 * 公開先のURL。Xに載せるリンクと、OGPで要求される絶対URLの組み立てに使う。
 * 末尾のスラッシュは必須（new URL() の相対解決がここを基準にするため）。
 *
 * このファイルは scripts/ から Node で直接読まれるので、import.meta.env を使わないこと。
 */
export const SITE_URL = 'https://omiomi79.github.io/imacocos/';

/** 場所・状態の組み合わせごとに作る共有ページのスラッグ */
export function sharePageSlug(areaId: string, cell: string, status: number): string {
  return [areaId, cell.toLowerCase(), String(status)].filter(Boolean).join('-');
}
