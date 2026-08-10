// functions/ 直下の "_" 始まりのファイルはルーティングされない共通モジュール。
import { getArea, isValidArea, isValidCell } from '../src/areas';
import { NG_WORDS } from './_ngwords';

export interface Env {
  DB: D1Database;
  /** 本番では `wrangler pages secret put HASH_SALT` で設定する */
  HASH_SALT?: string;
}

export const MAX_BODY_LENGTH = 80;
/** 連投防止: 同一端末はこの秒数内に1件まで */
export const POST_COOLDOWN_SEC = 30;
/** 同一端末の1時間あたり上限 */
export const POST_HOURLY_LIMIT = 20;
/** この件数の通報で自動的に非表示 */
export const REPORT_THRESHOLD = 3;

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

export function fail(message: string, status: number): Response {
  return json({ error: message }, status);
}

/**
 * 端末識別子。生IPは保存せず、salt付きハッシュだけを持つ。
 * レート制限・二重通報防止・BANに使う。
 */
export async function clientHash(request: Request, env: Env): Promise<string> {
  const ip = request.headers.get('CF-Connecting-IP') ?? '0.0.0.0';
  const ua = request.headers.get('User-Agent') ?? '';
  const salt = env.HASH_SALT ?? 'imacocos-local-dev-salt';
  const bytes = new TextEncoder().encode(`${salt}:${ip}:${ua}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 32);
}

export async function isBanned(env: Env, hash: string): Promise<boolean> {
  const row = await env.DB.prepare('SELECT 1 FROM bans WHERE client_hash = ?')
    .bind(hash)
    .first();
  return row !== null;
}

export type ValidationResult =
  | { ok: true; area: string; cell: string; crowd: number; body: string }
  | { ok: false; message: string };

/** URL混入はほぼ宣伝スパムなので一律で弾く */
const URL_PATTERN = /(https?:\/\/|www\.|t\.me\/|line\.me\/|discord\.gg\/)/i;
/** 同じ文字の10連打以上（荒らしの典型） */
const REPEAT_PATTERN = /(.)\1{9,}/;

export function validatePost(input: unknown): ValidationResult {
  if (typeof input !== 'object' || input === null) {
    return { ok: false, message: 'リクエストの形式が不正です' };
  }
  const { area, cell, crowd, body } = input as Record<string, unknown>;

  if (typeof area !== 'string' || !isValidArea(area)) {
    return { ok: false, message: 'エリアを選んでください' };
  }

  // 見取り図があるエリアはマスの指定が必須。まだ図がないエリアは空で受ける
  const cellValue = typeof cell === 'string' ? cell : '';
  if (getArea(area)?.map) {
    if (!isValidCell(area, cellValue)) {
      return { ok: false, message: 'マップ上の場所を選んでください' };
    }
  } else if (cellValue !== '') {
    return { ok: false, message: 'このエリアでは場所を指定できません' };
  }

  if (typeof crowd !== 'number' || ![1, 2, 3].includes(crowd)) {
    return { ok: false, message: 'コスプレイヤーさんの状態を選んでください' };
  }

  const text = typeof body === 'string' ? body.trim() : '';
  if (text.length > MAX_BODY_LENGTH) {
    return { ok: false, message: `ひとことは${MAX_BODY_LENGTH}文字までです` };
  }
  if (URL_PATTERN.test(text)) {
    return { ok: false, message: 'URLは投稿できません' };
  }
  if (REPEAT_PATTERN.test(text)) {
    return { ok: false, message: '同じ文字の連続が多すぎます' };
  }
  const lowered = text.toLowerCase();
  if (NG_WORDS.some((w) => lowered.includes(w))) {
    return { ok: false, message: 'この内容は投稿できません' };
  }

  return { ok: true, area, cell: cellValue, crowd, body: text };
}

/** 連投・大量投稿のチェック。通ったら null、弾くならエラーメッセージ */
export async function checkRateLimit(env: Env, hash: string, now: number): Promise<string | null> {
  const row = await env.DB.prepare(
    `SELECT
       MAX(created_at) AS latest,
       COUNT(*)        AS hourly
     FROM posts
     WHERE client_hash = ? AND created_at > ?`,
  )
    .bind(hash, now - 60 * 60 * 1000)
    .first<{ latest: number | null; hourly: number }>();

  if (!row) return null;

  if (row.latest !== null && now - row.latest < POST_COOLDOWN_SEC * 1000) {
    const wait = Math.ceil((POST_COOLDOWN_SEC * 1000 - (now - row.latest)) / 1000);
    return `連続投稿はできません。あと${wait}秒待ってください`;
  }
  if (row.hourly >= POST_HOURLY_LIMIT) {
    return '投稿が多すぎます。しばらく時間をおいてください';
  }
  return null;
}
