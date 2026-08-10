import { areaLabel, statusMeta } from '../areas';
import { isFresh, timeAgo } from '../format';
import type { Post } from '../types';

type Props = {
  posts: Post[];
  now: number;
  minePostIds: number[];
  onDelete: (id: number) => void;
  onReport: (id: number) => void;
  reportedIds: number[];
};

export function PostList({ posts, now, minePostIds, onDelete, onReport, reportedIds }: Props) {
  if (posts.length === 0) {
    return (
      <p className="empty">
        まだ投稿がありません。
        <br />
        最初の「いまココ！」を送ってみて。
      </p>
    );
  }

  return (
    <ul className="post-list">
      {posts.map((post) => {
        const status = statusMeta(post.crowd);
        const mine = minePostIds.includes(post.id);
        const reported = reportedIds.includes(post.id);

        return (
          <li key={post.id} className={`post status-${post.crowd} ${isFresh(post.createdAt, now) ? 'is-fresh' : ''}`}>
            <div className="post-head">
              <span className={`status-badge status-${post.crowd}`}>
                <span aria-hidden="true">{status.emoji}</span> {status.label}
              </span>
              <span className="post-area">
                {areaLabel(post.area)}
                {post.cell && <span className="post-cell"> {post.cell}</span>}
              </span>
              <time className="post-time" dateTime={new Date(post.createdAt).toISOString()}>
                {timeAgo(post.createdAt, now)}
              </time>
            </div>

            {post.body && <p className="post-body">{post.body}</p>}

            <div className="post-actions">
              {mine ? (
                <button type="button" className="link-btn" onClick={() => onDelete(post.id)}>
                  削除
                </button>
              ) : (
                <button
                  type="button"
                  className="link-btn subtle"
                  onClick={() => onReport(post.id)}
                  disabled={reported}
                >
                  {reported ? '通報済み' : '通報'}
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
