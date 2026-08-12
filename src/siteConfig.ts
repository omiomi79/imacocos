/**
 * 公開先のURL。Xに載せるリンクと、OGPで要求される絶対URLの組み立てに使う。
 * 末尾のスラッシュは必須（new URL() の相対解決がここを基準にするため）。
 *
 * このファイルは scripts/ から Node で直接読まれるので、import.meta.env を使わないこと。
 */
export const SITE_URL = 'https://omiomi79.github.io/imacocos/';

/**
 * 場所・状態の組み合わせごとに作る共有ページのスラッグ。
 * 「休憩中」のように状態を持たない選択肢では status に null を渡す。
 */
export function sharePageSlug(areaId: string, cell: string, status: number | null): string {
  return [areaId, cell.toLowerCase(), status === null ? '' : String(status)].filter(Boolean).join('-');
}

/** Xのハンドルの形式。英数字とアンダースコアのみ、15文字まで */
export const X_ID_PATTERN = /^[A-Za-z0-9_]{1,15}$/;

/** プロフィールURLを貼られたときに、そこからIDだけ取り出す */
const PROFILE_URL_PATTERN = /^(?:https?:\/\/)?(?:www\.)?(?:x|twitter)\.com\/@?([A-Za-z0-9_]{1,15})\/?$/i;

/**
 * 入力を X のハンドルに正規化する。形式が不正なら空文字を返す。
 *
 * 会場でスマホから打つ前提なので、次はすべて受け付ける:
 *   - 前後の空白
 *   - 先頭の @（半角・全角）
 *   - 日本語入力のままの全角英数字
 *   - プロフィールURLの貼り付け
 */
export function normalizeXId(raw: string): string {
  // 全角の ＠Ａ-Ｚａ-ｚ０-９＿ は、コード位置が半角のちょうど 0xFEE0 上にある
  const halfWidth = raw
    .trim()
    .replace(/[＠Ａ-Ｚａ-ｚ０-９＿]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0));

  const fromUrl = PROFILE_URL_PATTERN.exec(halfWidth);
  const value = fromUrl ? fromUrl[1] : halfWidth.replace(/^@+/, '');

  return X_ID_PATTERN.test(value) ? value : '';
}
