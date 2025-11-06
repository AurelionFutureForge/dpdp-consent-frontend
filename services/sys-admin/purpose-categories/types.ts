import type { BaseResponse } from "@/types/base-response";

// 1) Grouped by fiduciary list
export interface GroupedByFiduciaryItem {
  data_fiduciary_id: string;
  data_fiduciary_name: string;
  total_categories: number;
}

export interface GroupedByFiduciaryPagination {
  total_categories: number;
  limit: number;
  current_page: number;
  total_pages: number;
}

export interface GroupedByFiduciaryListResponse {
  data: GroupedByFiduciaryItem[];
  meta: {
    pagination: GroupedByFiduciaryPagination;
  };
}

export type GroupedByFiduciaryListApiResponse = BaseResponse<{
  data: GroupedByFiduciaryItem[];
  meta: { pagination: GroupedByFiduciaryPagination };
}>;

// 2) Analytics
export interface TopFiduciaryByCategories {
  data_fiduciary_id: string;
  data_fiduciary_name: string;
  total_categories: number;
}

export interface GroupedByFiduciaryAnalyticsData {
  total_fiduciaries: number;
  total_categories: number;
  average_categories_per_fiduciary: number;
  fiduciaries_with_categories: number;
  fiduciaries_without_categories: number;
  top_fiduciaries_by_categories: TopFiduciaryByCategories[];
}

export type GroupedByFiduciaryAnalyticsApiResponse = BaseResponse<GroupedByFiduciaryAnalyticsData>;

// 3) Purpose categories by fiduciary
export type PurposeCategorySortBy = "name" | "created_by" | "updated_by";
export type SortOrder = "asc" | "desc";

export interface PurposeCategoryItem {
  purpose_category_id: string;
  data_fiduciary_id: string;
  name: string;
  description: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  total_purposes: number;
}

export interface PurposeCategoryPagination {
  total_categories: number;
  limit: number;
  current_page: number;
  total_pages: number;
}

export interface PurposeCategoryListResponse {
  data: PurposeCategoryItem[];
  meta: {
    pagination: PurposeCategoryPagination;
  };
}

export type PurposeCategoryListApiResponse = BaseResponse<{
  data: PurposeCategoryItem[];
  meta: { pagination: PurposeCategoryPagination };
}>;

// 4) DF ID summary analytics
export interface PurposeCategorySummaryCounts {
  total_categories: number;
  active_categories: number;
  inactive_categories: number;
  recently_created: number;
}

export interface PurposeCategorySummaryTrendPoint {
  month: string; // ISO date string
  count: number;
}

export interface PurposeCategorySummaryTrends {
  new_categories_by_month: PurposeCategorySummaryTrendPoint[];
}

export interface PurposeCategorySummaryStatusDistributionItem {
  status: string; // "active" | "inactive" (string in API)
  count: number;
}

export interface PurposeCategorySummaryDistributions {
  categories_by_status: PurposeCategorySummaryStatusDistributionItem[];
  top_categories_by_purposes: PurposeCategoryItem[];
}

export interface PurposeCategorySummaryAnalyticsData {
  category_counts: PurposeCategorySummaryCounts;
  category_trends: PurposeCategorySummaryTrends;
  category_distributions: PurposeCategorySummaryDistributions;
}

export type PurposeCategorySummaryAnalyticsApiResponse = BaseResponse<PurposeCategorySummaryAnalyticsData>;


