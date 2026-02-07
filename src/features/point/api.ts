import { client } from "@/lib/api/client";
import { USER_ID_HEADER } from "@/lib/api/headers";
import type { PointRequest, PointResponse } from "./types";

function headers(userId: string): HeadersInit {
  return { [USER_ID_HEADER]: userId };
}

export async function getPoint(userId: string): Promise<PointResponse> {
  return client.get<PointResponse>("/points", { headers: headers(userId) });
}

export async function chargePoint(
  userId: string,
  body: PointRequest
): Promise<PointResponse> {
  return client.post<PointResponse>("/points/charge", body, {
    headers: headers(userId),
  });
}
