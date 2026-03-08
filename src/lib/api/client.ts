/**
 * API base client. 인증 헤더·서비스별 base URL은 여기서만 설정한다.
 * 각 백엔드 응답 형식(meta/data)을 언래핑하여 data만 반환한다.
 */

import type { ApiResponse } from "@/types/api";

const COMMERCE_API_BASE_URL =
  process.env.NEXT_PUBLIC_COMMERCE_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "";
const ORDER_API_BASE_URL =
  process.env.NEXT_PUBLIC_ORDER_API_BASE_URL ??
  COMMERCE_API_BASE_URL;
const API_BASE_PATH = "/api/v1";
const ORDER_API_PREFIXES = ["/cart", "/orders"] as const;

function resolveBaseUrl(path: string): string {
  return ORDER_API_PREFIXES.some((prefix) => path.startsWith(prefix))
    ? ORDER_API_BASE_URL
    : COMMERCE_API_BASE_URL;
}

function buildUrl(path: string): string {
  const segment = path.startsWith("/") ? path : `/${path}`;
  const fullPath = segment.startsWith(API_BASE_PATH) ? segment : `${API_BASE_PATH}${segment}`;
  return `${resolveBaseUrl(segment)}${fullPath}`;
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
