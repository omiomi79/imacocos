import { type Env, clientHash, fail, json } from '../../_lib';

/**
 * DELETE /api/posts/:id
 * 投稿した本人（同一端末ハッシュ）だけが消せる。誤投稿の取り消し用。
 */
export const onRequestDelete: PagesFunction<Env> = async ({ request, env, params }) => {
  const id = Number(params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return fail('投稿が見つかりません', 400);
  }

  const hash = await clientHash(request, env);
  const result = await env.DB.prepare('DELETE FROM posts WHERE id = ? AND client_hash = ?')
    .bind(id, hash)
    .run();

  // 他人の投稿か存在しないID。どちらかは伝えない
  if (!result.meta.changes) {
    return fail('この投稿は削除できません', 403);
  }

  await env.DB.prepare('DELETE FROM reports WHERE post_id = ?').bind(id).run();

  return json({ deleted: id });
};
