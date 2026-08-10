import { REPORT_THRESHOLD, type Env, clientHash, fail, json } from '../_lib';

/**
 * POST /api/report  body: { postId }
 * 同一端末からの二重通報は reports の主キーで弾かれる。
 * REPORT_THRESHOLD 件たまった時点で自動的に非表示にする。
 */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail('リクエストの形式が不正です', 400);
  }

  const postId = Number((payload as Record<string, unknown> | null)?.postId);
  if (!Number.isInteger(postId) || postId <= 0) {
    return fail('投稿が見つかりません', 400);
  }

  const hash = await clientHash(request, env);
  const now = Date.now();

  const inserted = await env.DB.prepare(
    `INSERT OR IGNORE INTO reports (post_id, client_hash, created_at) VALUES (?, ?, ?)`,
  )
    .bind(postId, hash, now)
    .run();

  // 既に通報済みなら黙って成功扱い（通報したことを何度も押させない）
  if (!inserted.meta.changes) {
    return json({ reported: true });
  }

  const counted = await env.DB.prepare(
    `UPDATE posts
        SET report_count = report_count + 1,
            hidden = CASE WHEN report_count + 1 >= ? THEN 1 ELSE hidden END
      WHERE id = ?
      RETURNING hidden`,
  )
    .bind(REPORT_THRESHOLD, postId)
    .first<{ hidden: number }>();

  return json({ reported: true, hidden: counted?.hidden === 1 });
};
