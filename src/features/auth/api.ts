import { client } from "@/lib/api/client";
import { USER_ID_HEADER } from "@/lib/api/headers";
import type { UserRequest, UserResponse } from "./types";

export async function registerUser(body: UserRequest): Promise<UserResponse> {
  return client.post<UserResponse>("/users", body);
}

export async function getMe(userId: string): Promise<UserResponse> {
  return client.get<UserResponse>("/users/me", {
    headers: { [USER_ID_HEADER]: userId },
  });
}
