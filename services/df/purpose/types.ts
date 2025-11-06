import type { BaseResponse } from "@/types/base-response";

// Purpose list types
export type PurposeSortBy = "name" | "created_by" | "updated_by";
export type SortOrder = "asc" | "desc";

export interface PurposeCategory {
  purpose_category_id: string;
  name: string;
}

export interface PurposeItem {
  purpose_id: string;
  data_fiduciary_id: string;
  purpose_category_id: string;
  title: string;
  description: string;
  legal_basis: string;
  data_fields: string[];
  processing_activities: string[];
  retention_period_days: number;
  is_mandatory: boolean;
  is_active: boolean;
  requires_renewal: boolean;
  renewal_period_days: number | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  category: PurposeCategory;
  total_versions: number;
  total_translations: number;
}

export interface PurposePagination {
  total_purposes: number;
  limit: number;
  current_page: number;
  total_pages: number;
}

export interface PurposeListResponse {
  data: PurposeItem[];
  meta: {
    pagination: PurposePagination;
  };
}

export type PurposeListApiResponse = BaseResponse<{
  data: PurposeItem[];
  meta: { pagination: PurposePagination };
}>;

// Purpose analytics types
export interface PurposeCounts {
  total_purposes: number;
  active_purposes: number;
  inactive_purposes: number;
  mandatory_purposes: number;
  optional_purposes: number;
  recently_created: number;
}

export interface PurposeTrendPoint {
  month: string;
  count: number;
}

export interface PurposeTrends {
  new_purposes_by_month: PurposeTrendPoint[];
}

export interface PurposesByStatus {
  status: string;
  count: number;
}

export interface PurposesByCategory {
  category_name: string;
  count: number;
}

export interface PurposeDistributions {
  purposes_by_status: PurposesByStatus[];
  purposes_by_category: PurposesByCategory[];
  top_purposes_by_versions: PurposeItem[];
}

export interface PurposeAnalyticsData {
  purpose_counts: PurposeCounts;
  purpose_trends: PurposeTrends;
  purpose_distributions: PurposeDistributions;
}

export type PurposeAnalyticsApiResponse = BaseResponse<PurposeAnalyticsData>;

// CRUD payloads
export interface CreatePurposePayload {
  purpose_category_id: string;
  title: string;
  description: string;
  legal_basis: string;
  data_fields: string[];
  processing_activities: string[];
  retention_period_days: number;
  is_mandatory: boolean;
  requires_renewal: boolean;
  renewal_period_days: number | null;
}

export interface UpdatePurposePayload {
  purpose_category_id: string;
  title: string;
  description: string;
  legal_basis: string;
  data_fields: string[];
  processing_activities: string[];
  retention_period_days: number;
  is_mandatory: boolean;
  requires_renewal: boolean;
  renewal_period_days: number | null;
  display_order: number;
}

export type CreatePurposeApiResponse = BaseResponse<PurposeItem>;
export type UpdatePurposeApiResponse = BaseResponse<PurposeItem>;
export type TogglePurposeApiResponse = BaseResponse<PurposeItem>;
export type DeletePurposeApiResponse = BaseResponse<PurposeItem>;

