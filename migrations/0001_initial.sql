CREATE TABLE IF NOT EXISTS posts (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  area         TEXT    NOT NULL,
  crowd        INTEGER NOT NULL,
  body         TEXT    NOT NULL DEFAULT '',
  client_hash  TEXT    NOT NULL,
  created_at   INTEGER NOT NULL,
  hidden       INTEGER NOT NULL DEFAULT 0,
  report_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_posts_recent ON posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_area   ON posts (area, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_client ON posts (client_hash, created_at DESC);

CREATE TABLE IF NOT EXISTS reports (
  post_id      INTEGER NOT NULL,
  client_hash  TEXT    NOT NULL,
  created_at   INTEGER NOT NULL,
  PRIMARY KEY (post_id, client_hash)
);

CREATE TABLE IF NOT EXISTS bans (
  client_hash  TEXT PRIMARY KEY,
  reason       TEXT,
  created_at   INTEGER NOT NULL
);
