import { useState } from 'react';
import { AREAS, AREA_GROUPS, CROWD_LEVELS } from '../areas';
import { createPost } from '../api';
import type { Post } from '../types';

const MAX_BODY_LENGTH = 80;
const LAST_AREA_KEY = 'imacocos:last-area';

type Props = {
  onPosted: (post: Post) => void;
};

export function PostForm({ onPosted }: Props) {
  // 同じ場所から続けて投稿することが多いので、前回のエリアを覚えておく
  const [area, setArea] = useState(() => localStorage.getItem(LAST_AREA_KEY) ?? '');
  const [crowd, setCrowd] = useState<number | null>(null);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = area !== '' && crowd !== null && !sending;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit || crowd === null) return;

    setSending(true);
    setError(null);
    try {
      const post = await createPost({ area, crowd, body });
      localStorage.setItem(LAST_AREA_KEY, area);
      setBody('');
      setCrowd(null);
      onPosted(post);
    } catch (e) {
      setError(e instanceof Error ? e.message : '投稿できませんでした');
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="form card" onSubmit={handleSubmit}>
      <label className="field">
        <span className="field-label">どこ？</span>
        <select className="select" value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">エリアを選ぶ</option>
          {AREA_GROUPS.map((group) => (
            <optgroup key={group} label={group}>
              {AREAS.filter((a) => a.group === group).map((a) => (
                <option key={a.id} value={a.id}>
                  {a.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <div className="field">
        <span className="field-label">混み具合は？</span>
        <div className="crowd-picker">
          {CROWD_LEVELS.map((level) => (
            <button
              key={level.value}
              type="button"
              className={`crowd-btn crowd-${level.value} ${crowd === level.value ? 'is-active' : ''}`}
              onClick={() => setCrowd(level.value)}
              aria-pressed={crowd === level.value}
            >
              <span className="crowd-emoji" aria-hidden="true">
                {level.emoji}
              </span>
              <span className="crowd-label">{level.label}</span>
              <span className="crowd-hint">{level.hint}</span>
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span className="field-label">
          ひとこと <span className="optional">（任意）</span>
          <span className="counter">
            {body.length}/{MAX_BODY_LENGTH}
          </span>
        </span>
        <textarea
          className="textarea"
          value={body}
          maxLength={MAX_BODY_LENGTH}
          rows={2}
          placeholder="例: 艦これ勢が集まってる / 待機列は建物沿い"
          onChange={(e) => setBody(e.target.value)}
        />
      </label>

      {error && <p className="error" role="alert">{error}</p>}

      <button className="submit" type="submit" disabled={!canSubmit}>
        {sending ? '送信中…' : 'いまココ！を投稿'}
      </button>
    </form>
  );
}
