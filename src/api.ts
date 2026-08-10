import type { Post } from './types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, init);
  } catch {
    // 会場は電波が細いので、通信断は必ず起きる前提で文言を用意しておく
    throw new Error('通信できませんでした。電波を確認してもう一度');
  }

  if (!res.ok) {
    const detail = await res.json().catch(() => null);
    const message = (detail as { error?: string } | null)?.error;
    throw new Error(message ?? `エラーが発生しました (${res.status})`);
  }

  return res.json() as Promise<T>;
}

export function fetchPosts(hours: number, area: string | null): Promise<{ posts: Post[]; now: number }> {
  const params = new URLSearchParams({ hours: String(hours) });
  if (area) params.set('area', area);
  return request<{ posts: Post[]; now: number }>(`/api/posts?${params}`);
}

export async function createPost(input: { area: string; cell: string; status: number; body: string }): Promise<Post> {
  const data = await request<{ post: Post }>('/api/posts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ area: input.area, cell: input.cell, crowd: input.status, body: input.body }),
  });
  return data.post;
}

export function deletePost(id: number): Promise<{ deleted: number }> {
  return request<{ deleted: number }>(`/api/posts/${id}`, { method: 'DELETE' });
}

export function reportPost(id: number): Promise<{ reported: boolean }> {
  return request<{ reported: boolean }>('/api/report', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ postId: id }),
  });
}
