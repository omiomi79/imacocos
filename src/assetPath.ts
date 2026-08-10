/**
 * ルート相対の静的パスに、配信先のベースURLを付ける。
 * GitHub Pages では `/imacocos/` 配下に置かれるため、これを通さないと画像が404になる。
 */
export function assetPath(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
