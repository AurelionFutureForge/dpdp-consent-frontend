import type { BaseResponse } from "@/types/base-response";

/**
 * Login request payload for MFA authentication
 */
export interface LoginRequestPayload {
  email: string;
  type: "MFA" | "SSO";
}

/**
 * OTP data returned from login API
 */
export interface OTPData {
  email: string;
  otp_id: string;
  expires_in: number;
}

/**
 * Login response data
 */
export interface LoginResponseData {
  email: string;
  otp_id: string;
  expires_in: number;
}

/**
 * Login API response
 */
export type LoginResponse = BaseResponse<LoginResponseData>;

/**
 * Data Fiduciary Registration request payload
 */
export interface DataFiduciaryRegisterPayload {
  name: string;
  legal_name: string;
  registration_number: string;
  contact_email: string;
  contact_phone: string;
  dpo_email: string;
  dpo_phone: string;
  website_url: string;
  logo_url: string;
  privacy_policy_url: string;
  terms_url: string;
}

/**
 * Data Fiduciary Registration response data
 */
export interface DataFiduciaryRegisterResponseData {
  data_fiduciary_id: string;
  name: string;
  legal_name: string;
  registration_number: string;
  contact_email: string;
  contact_phone: string;
  dpo_email: string;
  dpo_phone: string;
  website_url: string;
  logo_url: string;
  privacy_policy_url: string;
  terms_url: string;
  status: string;
  created_at: string;
}

/**
 * Data Fiduciary Registration API response
 */
export type DataFiduciaryRegisterResponse = BaseResponse<DataFiduciaryRegisterResponseData>;
