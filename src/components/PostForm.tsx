import { useState } from 'react';
import {
  AREAS,
  COSPLAYER_STATUSES,
  getArea,
  isValidArea,
  mapCardImage,
  mapCells,
  statusMeta,
} from '../areas';
import { assetPath } from '../assetPath';
import { AreaMapPicker } from './AreaMapPicker';

const MAX_BODY_LENGTH = 80;
const LAST_AREA_KEY = 'imacocos:last-area';
const PUBLIC_SITE_URL = 'https://imacocos.pages.dev';
const X_INTENT_URL = 'https://x.com/intent/post';

export function PostForm() {
  // 同じ場所から続けて投稿することが多いので、前回のエリアを覚えておく
  const [area, setArea] = useState(() => {
    const saved = localStorage.getItem(LAST_AREA_KEY) ?? '';
    return isValidArea(saved) ? saved : '';
  });
  const [cell, setCell] = useState('');
  const [status, setStatus] = useState<number | null>(null);
  const [body, setBody] = useState('');

  const selectedArea = getArea(area);
  const needsCell = selectedArea?.map ? mapCells(selectedArea.map).length > 0 : false;
  const canSubmit = area !== '' && (!needsCell || cell !== '') && status !== null;
  const selectedStatus = status === null ? null : statusMeta(status);
  const selectedPlace = selectedArea ? `${selectedArea.short}${cell ? ` ${cell}` : ''}` : '';
  const selectedMapCardImage = selectedArea ? mapCardImage(selectedArea.id, cell) : null;

  function buildShareUrl(): string {
    const params = new URLSearchParams({ area, status: String(status) });
    if (cell) params.set('cell', cell);
    return `${PUBLIC_SITE_URL}/share?${params}`;
  }

  function buildPostText(): string {
    const currentStatus = statusMeta(status ?? 2);
    const place = `${selectedArea?.short ?? area}${cell ? ` ${cell}` : ''}`;
    return [
      `📍 ${place}`,
      `${currentStatus.emoji} ${currentStatus.label}`,
      body.trim() || null,
      '#ImaCoCoS',
    ]
      .filter((line): line is string => line !== null)
      .join('\n');
  }

  function buildXIntentUrl(): string {
    const params = new URLSearchParams({ text: buildPostText(), url: buildShareUrl() });
    return `${X_INTENT_URL}?${params}`;
  }

  const xIntentUrl = canSubmit ? buildXIntentUrl() : undefined;

  return (
    <form className="form card">
      <div className="form-intro">
        <p className="kicker">NOW / WHERE / STATUS</p>
        <h1>いま、ここっす！！</h1>
        <p>場所と状態を選ぶだけ。投稿前に内容を確認できます。</p>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="area-select">
          <span className="step-index">01</span>
          <span>場所</span>
        </label>
        <select
          id="area-select"
          className="select"
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            setCell('');
          }}
        >
          <option value="">エリアを選ぶ</option>
          {AREAS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
        {selectedArea && (
          <span className="area-meta">
            {selectedArea.floor}／1日目 {selectedArea.hours.day1}／2日目 {selectedArea.hours.day2}
          </span>
        )}
      </div>

      {selectedArea?.map && <AreaMapPicker area={selectedArea} value={cell} onChange={setCell} />}

      <div className="field">
        <div className="field-label">
          <span className="step-index">02</span>
          <span>コスプレイヤーさんの状態</span>
        </div>
        <div className="status-picker">
          {COSPLAYER_STATUSES.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`status-btn status-${item.value} ${status === item.value ? 'is-active' : ''}`}
              onClick={() => setStatus(item.value)}
              aria-pressed={status === item.value}
            >
              <span className="status-glyph" aria-hidden="true">
                {item.emoji}
              </span>
              <span className="status-copy">
                <span className="status-code">{item.code}</span>
                <span className="status-label">{item.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor="post-note">
          <span className="step-index">03</span>
          <span>
            ひとこと <span className="optional">任意</span>
          </span>
          <span className="counter">
            {body.length}/{MAX_BODY_LENGTH}
          </span>
        </label>
        <textarea
          id="post-note"
          className="textarea"
          value={body}
          maxLength={MAX_BODY_LENGTH}
          rows={2}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      {canSubmit && selectedArea && selectedStatus && (
        <section className="share-preview" aria-label="Xへの投稿プレビュー">
          <p className="share-preview-label">PREVIEW // X POST</p>
          <p className="share-preview-text">{buildPostText()}</p>
          <div className="share-card-preview">
            {selectedArea.map && (
              <img
                src={assetPath(selectedMapCardImage ?? selectedArea.map.image)}
                alt={`${selectedPlace}の選択位置`}
              />
            )}
            <div className="share-card-copy">
              <strong>
                {selectedPlace}で{selectedStatus.label}｜CoCoS
              </strong>
              <span>imacocos.pages.dev</span>
            </div>
          </div>
        </section>
      )}

      <a
        className={`submit x-submit ${canSubmit ? '' : 'is-disabled'}`}
        href={xIntentUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!canSubmit}
        tabIndex={canSubmit ? 0 : -1}
        onClick={() => {
          if (canSubmit) localStorage.setItem(LAST_AREA_KEY, area);
        }}
      >
        <img className="x-submit-logo" src={assetPath('/brand/x-post-button.webp')} alt="" aria-hidden="true" />
        <span className="x-submit-label">Xに投稿！</span>
        <span aria-hidden="true">↗</span>
      </a>
      <p className="share-note">Xの画面で内容を確認・編集してから投稿されます。</p>
    </form>
  );
}
