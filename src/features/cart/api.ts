import { client } from "@/lib/api/client";
import { USER_ID_HEADER } from "@/lib/api/headers";
import type { Cart, AddToCartRequest, UpdateQuantityRequest } from "./types";

function headers(userId: string): HeadersInit {
  return { [USER_ID_HEADER]: userId };
}

export async function getCart(userId: string): Promise<Cart> {
  return client.get<Cart>("/cart", { headers: headers(userId) });
}

export async function addToCart(
  userId: string,
  request: AddToCartRequest
): Promise<Cart> {
  return client.post<Cart>("/cart/items", request, { headers: headers(userId) });
}

export async function updateCartItemQuantity(
  userId: string,
  itemId: number,
  request: UpdateQuantityRequest
): Promise<void> {
  await client.put(`/cart/items/${itemId}`, request, {
    headers: headers(userId),
  });
}

export async function removeCartItem(
  userId: string,
  itemId: number
): Promise<void> {
  await client.delete(`/cart/items/${itemId}`, { headers: headers(userId) });
}

export async function clearCart(userId: string): Promise<void> {
  await client.delete("/cart", { headers: headers(userId) });
}
