"use client";

import { useQuery } from "@tanstack/react-query";
import { getRanking } from "./api";

const rankingKey = ["ranking"] as const;

export function useRanking(params: {
  page: number;
  size: number;
  date: string;
}) {
  return useQuery({
    queryKey: [...rankingKey, params],
    queryFn: () => getRanking(params),
  });
}
