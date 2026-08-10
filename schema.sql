-- ImaCoCoS / D1 schema
-- 適用: npm run db:migrate:local  (ローカル)
--       npm run db:migrate        (本番)

CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  area         TEXT    NOT NULL,
  crowd        INTEGER NOT NULL,          -- 1:空いてる 2:ふつう 3:激混み
  body         TEXT    NOT NULL DEFAULT '',
  client_hash  TEXT    NOT NULL,          -- IP+UAのハッシュ。生IPは保存しない
  created_at   INTEGER NOT NULL,          -- unix ms
  hidden       INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_posts_recent ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_area   ON posts (area, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_client ON posts (client_hash, created_at DESC);

-- 同一端末による二重通報を PK で弾く
CREATE TABLE IF NOT EXISTS reports (
  post_id      INTEGER NOT NULL,
  client_hash  TEXT    NOT NULL,
  created_at   INTEGER NOT NULL,
  PRIMARY KEY (post_id, client_hash)
);

-- 手動BAN用。運用で悪質な端末を止めるとき INSERT する
CREATE TABLE IF NOT EXISTS bans (
  client_hash  TEXT PRIMARY KEY,
  reason       TEXT,
  created_at   INTEGER NOT NULL
);
