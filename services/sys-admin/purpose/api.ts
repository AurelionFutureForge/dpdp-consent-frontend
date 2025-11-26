import { axiosInstance } from "@/lib/axios-instance";
import type { PurposeListApiResponse } from "./types";

export const getPurposesByFiduciaryApi = async (
  dataFiduciaryId: string,
  categoryId: string,
  page: number,
  limit: number,
  q?: string
): Promise<PurposeListApiResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (q) params.append("q", q);

  const response = await axiosInstance.get(
    `/purpose-categories/${dataFiduciaryId}/category/${categoryId}/purposes?${params.toString()}`
  );
  return response.data;
};
