import {axiosBase} from "@/lib/axios-instance";
import type {
  InitiateConsentRequest,
  InitiateConsentApiResponse,
  GetConsentNoticeApiResponse,
  SubmitConsentRequest,
  SubmitConsentApiResponse,
  GetUserConsentsApiResponse,
  WithdrawConsentApiResponse,
  RenewConsentRequest,
  RenewConsentApiResponse,
} from "./types";

/**
 * API 1: Initiate consent request
 * POST /consents/initiate
 */
export const initiateConsentApi = async (
  data: InitiateConsentRequest
): Promise<InitiateConsentApiResponse> => {
  const response = await axiosBase.post("/consents/initiate", data);
  return response.data;
};

/**
 * API 2: Get consent notice
 * GET /consents/:cms_request_id
 */
export const getConsentNoticeApi = async (
  cmsRequestId: string
): Promise<GetConsentNoticeApiResponse> => {
  const response = await axiosBase.get(`/consents/${cmsRequestId}`);
  return response.data;
};

/**
 * API 3: Submit consent
 * POST /consents/submit
 */
export const submitConsentApi = async (
  data: SubmitConsentRequest
): Promise<SubmitConsentApiResponse> => {
  const response = await axiosBase.post("/consents/submit", data);
  return response.data;
};

/**
 * API 4: Get user consents
 * GET /consents/:data_fiduciary_id/users/:external_user_id/consents
 */
export const getUserConsentsApi = async (
  dataFiduciaryId: string,
  externalUserId: string,
  limit?: number
): Promise<GetUserConsentsApiResponse> => {
  const params = new URLSearchParams();
  if (limit) {
    params.append("limit", limit.toString());
  }
  const queryString = params.toString();
  const url = `/consents/${dataFiduciaryId}/users/${externalUserId}/consents${queryString ? `?${queryString}` : ""}`;
  const response = await axiosBase.get(url);
  return response.data;
};

/**
 * API 5: Withdraw consent
 * POST /consents/:data_fiduciary_id/consents/:artifact_id/withdraw
 */
export const withdrawConsentApi = async (
  dataFiduciaryId: string,
  artifactId: string
): Promise<WithdrawConsentApiResponse> => {
  const response = await axiosBase.post(
    `/consents/${dataFiduciaryId}/consents/${artifactId}/withdraw`
  );
  return response.data;
};

/**
 * API 6: Renew consent
 * POST /consents/renew
 */
export const renewConsentApi = async (
  data: RenewConsentRequest
): Promise<RenewConsentApiResponse> => {
  const response = await axiosBase.post("/consents/renew", data);
  return response.data;
};

