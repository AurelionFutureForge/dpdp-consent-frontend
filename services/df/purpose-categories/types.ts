import type { BaseResponse } from "@/types/base-response";

// Purpose categories by fiduciary
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

// DF ID summary analytics (for a single fiduciary)
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
  status: string; // "active" | "inactive"
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

// CRUD payloads and responses
export interface CreatePurposeCategoryPayload {
  name: string;
  description: string;
}

export interface UpdatePurposeCategoryPayload {
  name: string;
  description: string;
}

export type CreatePurposeCategoryApiResponse = BaseResponse<PurposeCategoryItem>;
export type UpdatePurposeCategoryApiResponse = BaseResponse<PurposeCategoryItem>;
export type TogglePurposeCategoryApiResponse = BaseResponse<PurposeCategoryItem>;
export type DeletePurposeCategoryApiResponse = BaseResponse<PurposeCategoryItem>;

