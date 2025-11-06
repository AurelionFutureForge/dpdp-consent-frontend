import { axiosInstance } from "@/lib/axios-instance";
import type {
  PurposeCategoryListApiResponse,
  SortOrder,
  PurposeCategorySortBy,
  PurposeCategorySummaryAnalyticsApiResponse,
  CreatePurposeCategoryPayload,
  UpdatePurposeCategoryPayload,
  CreatePurposeCategoryApiResponse,
  UpdatePurposeCategoryApiResponse,
  TogglePurposeCategoryApiResponse,
  DeletePurposeCategoryApiResponse,
} from "./types";

/**
 * 1) Fetch purpose categories by fiduciary id
 */
export const getPurposeCategoriesByFiduciaryApi = async (
  dataFiduciaryId: string,
  page: number,
  limit: number,
  q?: string,
  is_active?: boolean,
  sort_by?: PurposeCategorySortBy,
  sort_order?: SortOrder
): Promise<PurposeCategoryListApiResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (q) params.append("q", q);
  if (typeof is_active === "boolean") params.append("is_active", String(is_active));
  if (sort_by) {
    params.append("sort_by", sort_by);
    params.append("sort_order", sort_order ?? "asc");
  }

  const response = await axiosInstance.get(
    `/purpose-categories/${dataFiduciaryId}?${params.toString()}`
  );
  return response.data;
};

/**
 * 2) Fetch purpose category analytics summary by fiduciary id (DF view)
 */
export const getPurposeCategoriesSummaryByFiduciaryApi = async (
  dataFiduciaryId: string
): Promise<PurposeCategorySummaryAnalyticsApiResponse> => {
  const response = await axiosInstance.get(
    `/purpose-categories/${dataFiduciaryId}/analytics/summary`
  );
  return response.data;
};

/**
 * 3) Create a new purpose category
 */
export const createPurposeCategoryApi = async (
  dataFiduciaryId: string,
  data: CreatePurposeCategoryPayload
): Promise<CreatePurposeCategoryApiResponse> => {
  const response = await axiosInstance.post(
    `/purpose-categories/${dataFiduciaryId}`,
    data
  );
  return response.data;
};

/**
 * 4) Update a purpose category
 */
export const updatePurposeCategoryApi = async (
  dataFiduciaryId: string,
  purposeCategoryId: string,
  data: UpdatePurposeCategoryPayload
): Promise<UpdatePurposeCategoryApiResponse> => {
  const response = await axiosInstance.put(
    `/purpose-categories/${dataFiduciaryId}/${purposeCategoryId}`,
    data
  );
  return response.data;
};

/**
 * 5) Toggle purpose category active status
 */
export const togglePurposeCategoryApi = async (
  dataFiduciaryId: string,
  purposeCategoryId: string
): Promise<TogglePurposeCategoryApiResponse> => {
  const response = await axiosInstance.patch(
    `/purpose-categories/${dataFiduciaryId}/${purposeCategoryId}/toggle-status`
  );
  return response.data;
};

/**
 * 6) Delete a purpose category
 */
export const deletePurposeCategoryApi = async (
  dataFiduciaryId: string,
  purposeCategoryId: string
): Promise<DeletePurposeCategoryApiResponse> => {
  const response = await axiosInstance.delete(
    `/purpose-categories/${dataFiduciaryId}/${purposeCategoryId}`
  );
  return response.data;
};

