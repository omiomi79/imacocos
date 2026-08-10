import {
  type Env,
  checkRateLimit,
  clientHash,
  fail,
  isBanned,
  json,
  validatePost,
} from '../_lib';

const DEFAULT_HOURS = 2;
const MAX_HOURS = 12;
const MAX_ROWS = 200;

type PostRow = {
  id: number;
  area: string;
  cell: string;
  crowd: number;
  body: string;
  created_at: number;
};

/** GET /api/posts?hours=2&area=east-parking */
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);

  const hoursParam = Number(url.searchParams.get('hours'));
  const hours = Number.isFinite(hoursParam) && hoursParam > 0 ? Math.min(hoursParam, MAX_HOURS) : DEFAULT_HOURS;
  const since = Date.now() - hours * 60 * 60 * 1000;
  const area = url.searchParams.get('area');

  const query = area
    ? env.DB.prepare(
        `SELECT id, area, cell, crowd, body, created_at
           FROM posts
          WHERE hidden = 0 AND created_at > ? AND area = ?
          ORDER BY created_at DESC
          LIMIT ?`,
      ).bind(since, area, MAX_ROWS)
    : env.DB.prepare(
        `SELECT id, area, cell, crowd, body, created_at
           FROM posts
          WHERE hidden = 0 AND created_at > ?
          ORDER BY created_at DESC
          LIMIT ?`,
      ).bind(since, MAX_ROWS);

  const { results } = await query.all<PostRow>();

  return json({
    now: Date.now(),
    hours,
    posts: results.map((r) => ({
      id: r.id,
      area: r.area,
      cell: r.cell,
      crowd: r.crowd,
      body: r.body,
      createdAt: r.created_at,
    })),
  });
};

/** POST /api/posts  body: { area, cell, crowd, body } */
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return fail('リクエストの形式が不正です', 400);
  }

  const validated = validatePost(payload);
  if (!validated.ok) {
    return fail(validated.message, 400);
  }

  const hash = await clientHash(request, env);
  if (await isBanned(env, hash)) {
    // BANされていることは伝えない（回避行動を促さないため）
    return fail('いま投稿できません', 403);
  }

  const now = Date.now();
  const limited = await checkRateLimit(env, hash, now);
  if (limited) {
    return fail(limited, 429);
  }

  const inserted = await env.DB.prepare(
    `INSERT INTO posts (area, cell, crowd, body, client_hash, created_at)
     VALUES (?, ?, ?, ?, ?, ?)
     RETURNING id`,
  )
    .bind(validated.area, validated.cell, validated.crowd, validated.body, hash, now)
    .first<{ id: number }>();

  return json(
    {
      post: {
        id: inserted?.id ?? 0,
        area: validated.area,
        cell: validated.cell,
        crowd: validated.crowd,
        body: validated.body,
        createdAt: now,
      },
    },
    201,
  );
};
