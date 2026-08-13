import { useEffect, useState } from 'react';
import { formatJstDateTime } from '../format';
import { useI18n, type MessageKey } from '../i18n';
import { normalizeXId } from '../siteConfig';

const X_SEARCH_URL = 'https://x.com/search';
const HASHTAG = '#ImaCoCoS';

const RANGES = [
  { value: 1, labelKey: 'search.range1' },
  { value: 3, labelKey: 'search.range3' },
  { value: 6, labelKey: 'search.range6' },
  { value: 0, labelKey: 'search.rangeAny' },
] as const satisfies readonly { value: number; labelKey: MessageKey }[];

const SCOPES = [
  { value: 'all', labelKey: 'search.scopeAll' },
  { value: 'follows', labelKey: 'search.scopeFollows' },
] as const satisfies readonly { value: string; labelKey: MessageKey }[];

type Scope = (typeof SCOPES)[number]['value'];

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

export function buildSearchUrl(
  account: string,
  hours: number,
  scope: Scope = 'all',
  now = Date.now(),
): string {
  // 時間の指定は単独では効かないため、必ずタグと組み合わせる
  const terms = [HASHTAG];

  // Xにログインしている本人が「フォローしている相手」を指す
  if (scope === 'follows') terms.push('filter:follows');

  const id = normalizeXId(account);
  if (id) terms.push(`from:${id}`);

  if (hours > 0) terms.push(`since:${toSearchTimestamp(now - hours * 60 * 60 * 1000)}`);

  // 会話のぶら下がりは場所の告知ではないので除く
  terms.push('-filter:replies');

  // f=live を付けないと「話題のツイート」順になり、古い投稿が上に来てしまう
  return `${X_SEARCH_URL}?q=${encodeURIComponent(terms.join(' '))}&f=live`;
}

export function SearchPanel() {
  const { t } = useI18n();
  const [account, setAccount] = useState('');
  const [hours, setHours] = useState<number>(3);
  const [scope, setScope] = useState<Scope>('all');

  // 開いたまま放置しても検索範囲がずれないよう、時刻を進めておく
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  const typed = account.trim();
  const accountValid = typed === '' || normalizeXId(account) !== '';
  const searchUrl = accountValid ? buildSearchUrl(account, hours, scope, now) : undefined;

  return (
    <section className="form card search-panel" aria-label={t('search.panelLabel')}>
      <div className="form-intro search-intro">
        <p className="kicker">FIND / WHO / WHEN</p>
        <h2>{t('search.title')}</h2>
        <p>{t('search.intro')}</p>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="search-scope">
          <span>{t('search.scope')}</span>
        </label>
        <select
          id="search-scope"
          className="select"
          value={scope}
          onChange={(event) => setScope(event.target.value as Scope)}
        >
          {SCOPES.map((item) => (
            <option key={item.value} value={item.value}>
              {t(item.labelKey)}
            </option>
          ))}
        </select>
        {scope === 'follows' && <p className="map-help">{t('search.scopeFollowsHelp')}</p>}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="search-account">
          <span>{t('search.account')}</span>
          <span className="optional">{t('common.optional')}</span>
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
          <p className="map-help">
            {t(scope === 'follows' ? 'search.accountHelpFollows' : 'search.accountHelpAll')}
          </p>
        ) : (
          <p className="field-error" role="alert">
            {t('post.xIdError')}
          </p>
        )}
      </div>

      <div className="field">
        <label className="field-label" htmlFor="search-range">
          <span>{t('search.range')}</span>
        </label>
        <select
          id="search-range"
          className="select"
          value={hours}
          onChange={(event) => setHours(Number(event.target.value))}
        >
          {RANGES.map((range) => (
            <option key={range.value} value={range.value}>
              {t(range.labelKey)}
            </option>
          ))}
        </select>
        {/* Xの検索はUTCで受け取るため、そのままだと9時間ずれた数字が並んで見える */}
        {hours > 0 && (
          <p className="map-help">
            {t('search.since', { time: formatJstDateTime(now - hours * 60 * 60 * 1000) })}
          </p>
        )}
      </div>

      <a
        className={`submit x-submit search-submit ${accountValid ? '' : 'is-disabled'}`}
        href={searchUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!accountValid}
        tabIndex={accountValid ? 0 : -1}
        onClick={(event) => {
          if (!accountValid) return;
          // 表示の更新から時間が経っていることがあるので、押した瞬間で作り直す
          event.currentTarget.href = buildSearchUrl(account, hours, scope, Date.now());
        }}
      >
        <span className="x-submit-label">{t('search.submit')}</span>
        <span aria-hidden="true">↗</span>
      </a>
      <p className="share-note">{t('search.note')}</p>
    </section>
  );
}
