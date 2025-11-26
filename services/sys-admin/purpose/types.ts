import type { BaseResponse } from "@/types/base-response";

export interface PurposeCategory {
  purpose_category_id: string;
  name: string;
}

export interface PurposePagination {
  total_purposes: number;
  limit: number;
  current_page: number;
  total_pages: number;
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

export type PurposeListApiResponse = BaseResponse<{
  data: PurposeItem[];
  meta: { pagination: PurposePagination };
}>;