import { useCallback, useEffect, useRef, useState } from 'react';
import { AREAS, AREA_GROUPS } from './areas';
import { deletePost, fetchPosts, reportPost } from './api';
import { PostForm } from './components/PostForm';
import { PostList } from './components/PostList';
import type { Post } from './types';

const RELOAD_INTERVAL_MS = 30_000;
const MINE_KEY = 'imacocos:mine';
const REPORTED_KEY = 'imacocos:reported';
const HOUR_OPTIONS = [1, 2, 6, 12];

function readIds(key: string): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(raw) ? raw.filter((v): v is number => typeof v === 'number') : [];
  } catch {
    return [];
  }
}

function writeIds(key: string, ids: number[]): void {
  // 際限なく溜めない。古いものから捨てる
  localStorage.setItem(key, JSON.stringify(ids.slice(-100)));
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [now, setNow] = useState(() => Date.now());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterArea, setFilterArea] = useState('');
  const [hours, setHours] = useState(2);
  const [minePostIds, setMinePostIds] = useState<number[]>(() => readIds(MINE_KEY));
  const [reportedIds, setReportedIds] = useState<number[]>(() => readIds(REPORTED_KEY));

  // 端末の時計がズレていても「◯分前」が狂わないよう、サーバ時刻との差を持っておく
  const clockOffset = useRef(0);

  const load = useCallback(async () => {
    try {
      const data = await fetchPosts(hours, filterArea || null);
      clockOffset.current = data.now - Date.now();
      setPosts(data.posts);
      setNow(data.now);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : '読み込めませんでした');
    } finally {
      setLoading(false);
    }
  }, [hours, filterArea]);

  useEffect(() => {
    setLoading(true);
    void load();
  }, [load]);

  useEffect(() => {
    // 画面を見ていない間は通信しない（会場では電池と電波が貴重）
    const timer = setInterval(() => {
      if (!document.hidden) void load();
    }, RELOAD_INTERVAL_MS);

    const onVisibilityChange = () => {
      if (!document.hidden) void load();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [load]);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now() + clockOffset.current), 30_000);
    return () => clearInterval(timer);
  }, []);

  function handlePosted(post: Post) {
    const ids = [...minePostIds, post.id];
    setMinePostIds(ids);
    writeIds(MINE_KEY, ids);
    // フィルタ中でも自分の投稿はすぐ見えてほしいので、条件に合うときだけ先頭に足す
    if (!filterArea || filterArea === post.area) {
      setPosts((prev) => [post, ...prev]);
    }
    setNow(Date.now() + clockOffset.current);
  }

  async function handleDelete(id: number) {
    if (!confirm('この投稿を削除する？')) return;
    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      setError(e instanceof Error ? e.message : '削除できませんでした');
    }
  }

  async function handleReport(id: number) {
    if (!confirm('この投稿を通報する？\n複数の通報が集まると自動的に非表示になります。')) return;
    const ids = [...reportedIds, id];
    setReportedIds(ids);
    writeIds(REPORTED_KEY, ids);
    try {
      await reportPost(id);
    } catch (e) {
      setError(e instanceof Error ? e.message : '通報できませんでした');
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">
          Ima<span className="logo-accent">CoCoS</span>
        </h1>
        <p className="tagline">コミケのコスプレ撮影エリア、いまどこ？</p>
      </header>

      <main>
        <PostForm onPosted={handlePosted} />

        <section className="timeline">
          <div className="filters">
            <select
              className="select small"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              aria-label="エリアで絞り込む"
            >
              <option value="">すべてのエリア</option>
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

            <select
              className="select small"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              aria-label="表示する期間"
            >
              {HOUR_OPTIONS.map((h) => (
                <option key={h} value={h}>
                  直近{h}時間
                </option>
              ))}
            </select>

            <button type="button" className="refresh" onClick={() => void load()} aria-label="更新">
              更新
            </button>
          </div>

          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {loading ? (
            <p className="empty">読み込み中…</p>
          ) : (
            <PostList
              posts={posts}
              now={now}
              minePostIds={minePostIds}
              reportedIds={reportedIds}
              onDelete={handleDelete}
              onReport={handleReport}
            />
          )}
        </section>
      </main>

      <footer className="footer">
        <p>
          有志による非公式ツールです。投稿は匿名で、直近{hours}時間ぶんだけ表示されます。
        </p>
        <p>
          個人が特定できる情報（本名・住所・SNSアカウントなど）、
          撮影許可のない写真の話題、誹謗中傷は書かないでください。
          見つけたら「通報」を押してください。
        </p>
        <p>撮影は必ずコスプレイヤー本人の許可を取ってから。会場のルールを守って楽しく。</p>
      </footer>
    </div>
  );
}
