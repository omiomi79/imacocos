/**
 * 会場は日本なので、端末のタイムゾーン設定に関わらず日本時間で表示する。
 * 2日間開催で日をまたぐため、時刻だけでなく日付も出す（例: 8/15 17:32）。
 */
export function formatJstDateTime(timestamp: number): string {
  return new Date(timestamp).toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** 「いま」の情報アプリなので、絶対時刻より経過時間のほうが読みやすい */
export function timeAgo(createdAt: number, now: number): string {
  const diffSec = Math.max(0, Math.floor((now - createdAt) / 1000));

  if (diffSec < 60) return 'たった今';
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}分前`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour}時間前`;
  return `${Math.floor(hour / 24)}日前`;
}

/** 5分以内は「まだ生きてる情報」として強調する */
export function isFresh(createdAt: number, now: number): boolean {
  return now - createdAt < 5 * 60 * 1000;
}
