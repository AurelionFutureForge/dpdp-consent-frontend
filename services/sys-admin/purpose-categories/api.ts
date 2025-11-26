import { axiosInstance } from "@/lib/axios-instance";
import type {
  GroupedByFiduciaryListApiResponse,
  GroupedByFiduciaryAnalyticsApiResponse,
  PurposeCategoryListApiResponse,
  PurposeCategorySortBy,
  SortOrder,
  PurposeCategorySummaryAnalyticsApiResponse,
} from "./types";

/**
 * 1) Fetch purpose categories grouped by fiduciary
 */
export const getGroupedPurposeCategoriesApi = async (
  page: number,
  limit: number,
  query?: string
): Promise<GroupedByFiduciaryListApiResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (query) params.append("q", query);

  const response = await axiosInstance.get(
    `/purpose-categories/grouped-by-fiduciary?${params.toString()}`
  );
  return response.data;
};


/**
 * 2) Fetch analytics for grouped purpose categories
 */
export const getGroupedPurposeCategoriesAnalyticsApi = async (): Promise<
  GroupedByFiduciaryAnalyticsApiResponse
> => {
  const response = await axiosInstance.get(
    "/purpose-categories/grouped-by-fiduciary/analytics"
  );
  return response.data;
};

/**
 * 3) Fetch purpose categories by fiduciary id
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
 * 4) Fetch purpose category analytics summary by fiduciary id
 */
export const getPurposeCategoriesSummaryByFiduciaryApi = async (
  dataFiduciaryId: string
): Promise<PurposeCategorySummaryAnalyticsApiResponse> => {
  const response = await axiosInstance.get(
    `/purpose-categories/${dataFiduciaryId}/analytics/summary`
  );
  return response.data;
};


