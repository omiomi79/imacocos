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

/** Xのハンドルの形式。英数字とアンダースコアのみ、15文字まで */
export const X_ID_PATTERN = /^[A-Za-z0-9_]{1,15}$/;

/** 先頭の @ と前後の空白を落とす。形式が不正なら空文字を返す */
export function normalizeXId(raw: string): string {
  const value = raw.trim().replace(/^@/, '');
  return X_ID_PATTERN.test(value) ? value : '';
}
