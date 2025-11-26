import { useQuery } from "@tanstack/react-query";
import {
  getGroupedPurposeCategoriesApi,
  getGroupedPurposeCategoriesAnalyticsApi,
  getPurposeCategoriesByFiduciaryApi,
  getPurposeCategoriesSummaryByFiduciaryApi,
} from "./api";
import type { PurposeCategorySortBy, SortOrder } from "./types";

/**
 * 1) Grouped by fiduciary list
 */
export const useGetGroupedPurposeCategories = (
  page: number,
  limit: number,
  query?: string
) =>
  useQuery({
    queryKey: ["purpose-categories", "grouped", page, limit, query],
    queryFn: () => getGroupedPurposeCategoriesApi(page, limit, query),
    staleTime: 5_000,
  });

/**
 * 2) Grouped by fiduciary analytics
 */
export const useGetGroupedPurposeCategoriesAnalytics = () =>
  useQuery({
    queryKey: ["purpose-categories", "grouped", "analytics"],
    queryFn: () => getGroupedPurposeCategoriesAnalyticsApi(),
    staleTime: 10_000,
  });

/**
 * 3) Purpose categories by fiduciary
 */
export const useGetPurposeCategoriesByFiduciary = (
  dataFiduciaryId: string,
  page: number,
  limit: number,
  q?: string,
  is_active?: boolean,
  sort_by?: PurposeCategorySortBy,
  sort_order?: SortOrder
) =>
  useQuery({
    queryKey: [
      "purpose-categories",
      dataFiduciaryId,
      page,
      limit,
      q,
      is_active,
      sort_by,
      sort_order,
    ],
    queryFn: () =>
      getPurposeCategoriesByFiduciaryApi(
        dataFiduciaryId,
        page,
        limit,
        q,
        is_active,
        sort_by,
        sort_order
      ),
    enabled: Boolean(dataFiduciaryId),
    staleTime: 5_000,
  });

/**
 * 4) Purpose category analytics summary by fiduciary
 */
export const useGetPurposeCategoriesSummaryByFiduciary = (
  dataFiduciaryId: string
) =>
  useQuery({
    queryKey: ["purpose-categories", dataFiduciaryId, "summary"],
    queryFn: () => getPurposeCategoriesSummaryByFiduciaryApi(dataFiduciaryId),
    enabled: Boolean(dataFiduciaryId),
    staleTime: 10_000,
  });


