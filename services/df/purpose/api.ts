import { axiosInstance } from "@/lib/axios-instance";
import type {
  PurposeListApiResponse,
  PurposeAnalyticsApiResponse,
  CreatePurposePayload,
  UpdatePurposePayload,
  CreatePurposeApiResponse,
  UpdatePurposeApiResponse,
  TogglePurposeApiResponse,
  DeletePurposeApiResponse,
  PurposeSortBy,
  SortOrder,
} from "./types";

/**
 * 1) Fetch purposes by category id
 */
export const getPurposesByFiduciaryApi = async (
  dataFiduciaryId: string,
  categoryId: string,
  page: number,
  limit: number,
  q?: string,
  is_active?: boolean,
  sort_by?: PurposeSortBy,
  sort_order?: SortOrder
): Promise<PurposeListApiResponse> => {
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
    `/purpose-categories/${dataFiduciaryId}/category/${categoryId}/purposes?${params.toString()}`
  );
  return response.data;
};

/**
 * 2) Fetch purpose analytics summary by fiduciary id
 */
export const getPurposesAnalyticsByFiduciaryApi = async (
  dataFiduciaryId: string
): Promise<PurposeAnalyticsApiResponse> => {
  const response = await axiosInstance.get(
    `/purposes/${dataFiduciaryId}/analytics/summary`
  );
  return response.data;
};

/**
 * 3) Create a new purpose
 */
export const createPurposeApi = async (
  dataFiduciaryId: string,
  data: CreatePurposePayload
): Promise<CreatePurposeApiResponse> => {
  const response = await axiosInstance.post(
    `/purposes/${dataFiduciaryId}`,
    data
  );
  return response.data;
};

/**
 * 4) Update a purpose
 */
export const updatePurposeApi = async (
  dataFiduciaryId: string,
  purposeId: string,
  data: UpdatePurposePayload
): Promise<UpdatePurposeApiResponse> => {
  const response = await axiosInstance.put(
    `/purposes/${dataFiduciaryId}/${purposeId}`,
    data
  );
  return response.data;
};

/**
 * 5) Toggle purpose active status
 */
export const togglePurposeApi = async (
  dataFiduciaryId: string,
  purposeId: string
): Promise<TogglePurposeApiResponse> => {
  const response = await axiosInstance.patch(
    `/purposes/${dataFiduciaryId}/${purposeId}/toggle-status`
  );
  return response.data;
};

/**
 * 6) Delete a purpose
 */
export const deletePurposeApi = async (
  dataFiduciaryId: string,
  purposeId: string
): Promise<DeletePurposeApiResponse> => {
  const response = await axiosInstance.delete(
    `/purposes/${dataFiduciaryId}/${purposeId}`
  );
  return response.data;
};

