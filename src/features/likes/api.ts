import { client } from "@/lib/api/client";
import { USER_ID_HEADER } from "@/lib/api/headers";
import type { LikedProductResponse } from "./types";

function headers(userId: string): HeadersInit {
  return { [USER_ID_HEADER]: userId };
}

export async function addLike(userId: string, productId: number): Promise<void> {
  await client.post(`/like/products/${productId}`, undefined, { headers: headers(userId) });
}

export async function removeLike(userId: string, productId: number): Promise<void> {
  await client.delete(`/like/products/${productId}`, { headers: headers(userId) });
}

export async function getMyLikes(userId: string): Promise<LikedProductResponse> {
  return client.get<LikedProductResponse>("/like/products", { headers: headers(userId) });
}
