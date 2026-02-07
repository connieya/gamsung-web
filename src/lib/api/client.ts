/**
 * API base client. 인증 헤더·base URL은 여기서만 설정.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const client = {
  async get<T>(path: string, init?: RequestInit): Promise<{ data: T }> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const data = (await res.json()) as T;
    return { data };
  },
  async post<T>(path: string, body?: unknown, init?: RequestInit): Promise<{ data: T }> {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...init,
      method: "POST",
      headers: { "Content-Type": "application/json", ...init?.headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    const data = (await res.json()) as T;
    return { data };
  },
};
