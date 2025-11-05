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

