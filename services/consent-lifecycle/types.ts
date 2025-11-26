import type { BaseResponse } from "@/types/base-response";

// API 1: Initiate Consent - Request
export interface InitiateConsentRequest {
  data_fiduciary_id: string;
  user_id: string;
  purposes: string[];
  duration: number;
  language: string;
  metadata?: Record<string, unknown>;
  redirect_url?: string;
  email?: string;
  phone?: string;
}

// API 1: Initiate Consent - Response
export interface InitiateConsentResponse {
  cms_request_id: string;
  notice_url: string;
  status: string;
  expires_at: string;
}

export type InitiateConsentApiResponse = BaseResponse<InitiateConsentResponse>;

// API 2: Get Consent Notice - Response
export interface PurposeCategory {
  purpose_category_id: string;
  name: string;
}

export interface ConsentNoticePurpose {
  purpose_id: string;
  purpose_version_id: string;
  version_number: number;
  title: string;
  description: string;
  legal_basis: string;
  data_fields: string[];
  processing_activities: string[];
  retention_period_days: number;
  is_mandatory: boolean;
  category: PurposeCategory;
}

export interface DataFiduciary {
  data_fiduciary_id: string;
  name: string;
  legal_name: string;
  logo_url: string;
  contact_email: string;
  website_url: string;
  privacy_policy_url: string;
}

export interface RetentionPolicy {
  retention_period_days: number;
  withdrawal_policy: string;
}

export interface LanguageConfig {
  language_code: string;
  translations: Record<string, unknown>;
}

export interface PurposeCategoryGroup {
  category_id: string;
  category_name: string;
  purposes: ConsentNoticePurpose[];
}

export interface ConsentNoticeData {
  cms_request_id: string;
  data_fiduciary: DataFiduciary;
  purposes?: ConsentNoticePurpose[]; // Legacy support
  purposes_by_category?: PurposeCategoryGroup[]; // New structure
  data_fields: string[];
  retention_policy: RetentionPolicy;
  language_config: LanguageConfig;
  valid_until: string;
  mandatory_purposes: string[];
  redirect_url?: string;
}

export type GetConsentNoticeApiResponse = BaseResponse<ConsentNoticeData>;

// API 3: Submit Consent - Request
export interface SubmitConsentRequest {
  cms_request_id: string;
  selected_purposes: string[];
  agree: boolean;
  language_code: string;
  ip_address?: string;
  user_agent?: string;
}

// API 3: Submit Consent - Response
export interface SubmittedPurpose {
  purpose_id: string;
  purpose_version_id: string;
  title: string;
  granted_at: string;
}

export interface RedirectParams {
  consent_id: string;
  status: string;
  timestamp: string;
}

export interface SubmitConsentResponse {
  artifact_id: string;
  status: string;
  valid_till: string;
  purposes: SubmittedPurpose[];
  hash: string;
  redirect_url?: string;
  redirect_params?: RedirectParams;
}

export type SubmitConsentApiResponse = BaseResponse<SubmitConsentResponse>;

// API 4: Get User Consents - Response
export interface ConsentPurpose {
  purpose_id: string;
  purpose_version_id: string;
  title: string;
  granted_at: string;
}

export interface ConsentMetadata {
  user_agent?: string;
  language_code?: string;
  external_user_id?: string;
  consent_request_id?: string;
  duration?: number;
  language?: string;
  purposes?: string[];
  viewed_at?: string;
  redirect_url?: string;
  submitted_at?: string;
  consent_request?: boolean;
  selected_purposes?: string[];
  [key: string]: unknown;
}

export interface ConsentArtifact {
  consent_artifact_id: string;
  data_fiduciary_id: string;
  data_principal_id: string;
  principal_fiduciary_map_id: string;
  external_user_id: string;
  status: string;
  purposes: ConsentPurpose[];
  requested_at: string;
  granted_at: string;
  expires_at: string;
  consent_text_hash: string | null;
  metadata: ConsentMetadata;
  is_deleted: boolean;
}

export interface ConsentPagination {
  total: number;
  limit: number;
  current_page: number;
  total_pages: number;
}

export interface UserConsentsData {
  data: ConsentArtifact[];
  meta: {
    pagination: ConsentPagination;
  };
}

export type GetUserConsentsApiResponse = BaseResponse<UserConsentsData>;

// API 5: Withdraw Consent - Response
export interface WithdrawConsentResponse {
  consent_artifact_id: string;
  status: string;
  withdrawn_at: string;
}

export type WithdrawConsentApiResponse = BaseResponse<WithdrawConsentResponse>;

// API 6: Renew Consent - Request
export interface RenewConsentRequest {
  artifact_id: string;
  requested_extension: string;
  initiated_by: string;
}

// API 6: Renew Consent - Response
export interface TransparencyInfo {
  retention_policy_changes?: string;
  purpose_changes?: string;
  data_field_changes?: string;
  other_changes?: string;
}

export interface RenewConsentResponse {
  renewal_request_id: string;
  artifact_id: string;
  status: string;
  current_expires_at: string;
  requested_expires_at: string;
  transparency_info: TransparencyInfo;
  message: string;
}

export type RenewConsentApiResponse = BaseResponse<RenewConsentResponse>;

