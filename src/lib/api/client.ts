/**
 * API base client. 인증 헤더·base URL은 여기서만 설정.
 * commerce-api 응답 형식(meta/data)을 언래핑하여 data만 반환.
 */

import type { ApiResponse } from "@/types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const API_BASE_PATH = "/api/v1";

function buildUrl(path: string): string {
  const segment = path.startsWith("/") ? path : `/${path}`;
  const fullPath = segment.startsWith(API_BASE_PATH) ? segment : `${API_BASE_PATH}${segment}`;
  return `${BASE_URL}${fullPath}`;
}

async function handleResponse<T>(res: Response): Promise<T> {
  let json: ApiResponse<T>;
  try {
    json = (await res.json()) as ApiResponse<T>;
  } catch {
    if (!res.ok) throw new Error(res.statusText || `API Error: ${res.status}`);
    throw new Error("Invalid response");
  }
  if (!res.ok) {
    throw new Error(json.meta?.message ?? `API Error: ${res.status}`);
  }
  if (json.meta?.result === "FAIL") {
    throw new Error(json.meta?.message ?? json.meta?.errorCode ?? "요청에 실패했습니다.");
  }
  return json.data as T;
}

export const client = {
  async get<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(buildUrl(path), {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    return handleResponse<T>(res);
  },

  async post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(buildUrl(path), {
      ...init,
      method: "POST",
      headers: { "Content-Type": "application/json", ...init?.headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T>(path: string, body?: unknown, init?: RequestInit): Promise<T> {
    const res = await fetch(buildUrl(path), {
      ...init,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...init?.headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async delete<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(buildUrl(path), {
      ...init,
      method: "DELETE",
      headers: { ...init?.headers },
    });
    return handleResponse<T>(res);
  },
};
