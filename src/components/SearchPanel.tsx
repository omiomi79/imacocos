import { useState } from 'react';
import { normalizeXId } from '../siteConfig';

const X_SEARCH_URL = 'https://x.com/search';
const HASHTAG = '#ImaCoCoS';

const RANGES = [
  { value: 1, label: '直近1時間' },
  { value: 3, label: '直近3時間' },
  { value: 6, label: '直近6時間' },
  { value: 0, label: '指定なし' },
] as const;

/**
 * Xの検索が受け付ける形式（例: 2026-08-15_04:30:00_UTC）に変換する。
 * 日本時間ではなくUTCで渡す必要があるため、必ずUTC系のメソッドで組み立てる。
 */
function toSearchTimestamp(ms: number): string {
  const date = new Date(ms);
  const pad = (value: number) => String(value).padStart(2, '0');
  return (
    `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}` +
    `_${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}_UTC`
  );
}

export function buildSearchUrl(account: string, hours: number, now = Date.now()): string {
  // 時間の指定は単独では効かないため、必ずタグと組み合わせる
  const terms = [HASHTAG];

  const id = normalizeXId(account);
  if (id) terms.push(`from:${id}`);

  if (hours > 0) terms.push(`since:${toSearchTimestamp(now - hours * 60 * 60 * 1000)}`);

  // 会話のぶら下がりは場所の告知ではないので除く
  terms.push('-filter:replies');

  // f=live を付けないと「話題のツイート」順になり、古い投稿が上に来てしまう
  return `${X_SEARCH_URL}?q=${encodeURIComponent(terms.join(' '))}&f=live`;
}

export function SearchPanel() {
  const [account, setAccount] = useState('');
  const [hours, setHours] = useState<number>(3);

  const typed = account.trim();
  const accountValid = typed === '' || normalizeXId(account) !== '';
  const searchUrl = accountValid ? buildSearchUrl(account, hours) : undefined;

  return (
    <section className="form card search-panel" aria-label="投稿を探す">
      <div className="form-intro search-intro">
        <p className="kicker">FIND / WHO / WHEN</p>
        <h2>いま、どこっす？</h2>
        <p>投稿された場所をXで探します。アカウントを入れると、その人だけに絞れます。</p>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="search-account">
          <span>アカウント</span>
          <span className="optional">任意</span>
        </label>
        <input
          id="search-account"
          className={`text-input ${accountValid ? '' : 'is-invalid'}`}
          type="text"
          value={account}
          placeholder="@omi_camera"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          aria-invalid={!accountValid}
          onChange={(event) => setAccount(event.target.value)}
        />
        {accountValid ? (
          <p className="map-help">空のままなら、全員の投稿から探します。</p>
        ) : (
          <p className="field-error" role="alert">
            英数字とアンダースコアのみ、15文字までです
          </p>
        )}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="search-range">
          <span>いつの投稿</span>
        </label>
        <select
          id="search-range"
          className="select"
          value={hours}
          onChange={(event) => setHours(Number(event.target.value))}
        >
          {RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <a
        className={`submit x-submit search-submit ${accountValid ? '' : 'is-disabled'}`}
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!accountValid}
        tabIndex={accountValid ? 0 : -1}
      >
        <span className="x-submit-label">Xで探す</span>
        <span aria-hidden="true">↗</span>
      </a>
      <p className="share-note">新しい順に表示されます。</p>
    </section>
  );
}
