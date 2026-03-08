import { client } from "@/lib/api/client";
import type { RankingSummaryResponse } from "./types";

export async function getRanking(params: {
  page: number;
  size: number;
  date: string; // YYYY-MM-DD
}): Promise<RankingSummaryResponse> {
  const search = new URLSearchParams({
    page: String(params.page),
    size: String(params.size),
    date: params.date,
  });
  return client.get<RankingSummaryResponse>(`/ranking/daily?${search}`);
}
