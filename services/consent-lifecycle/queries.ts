import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  initiateConsentApi,
  getConsentNoticeApi,
  submitConsentApi,
  getUserConsentsApi,
  withdrawConsentApi,
  renewConsentApi,
} from "./api";
import type {
  InitiateConsentRequest,
  SubmitConsentRequest,
  RenewConsentRequest,
} from "./types";
import { toast } from "sonner";
import { parseApiError } from "@/lib/parse-api-errors";

/**
 * API 1: Initiate consent request
 * POST /consents/initiate
 */
export const useInitiateConsent = () => {
  return useMutation({
    mutationFn: (data: InitiateConsentRequest) => initiateConsentApi(data),
    onSuccess: (response) => {
      toast.success(response.message as string);
    },
    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
};

/**
 * API 2: Get consent notice
 * GET /consents/:cms_request_id
 */
export const useGetConsentNotice = (cmsRequestId: string | null) => {
  return useQuery({
    queryKey: ["consent-notice", cmsRequestId],
    queryFn: () => getConsentNoticeApi(cmsRequestId!),
    enabled: Boolean(cmsRequestId),
    staleTime: 5_000,
  });
};

/**
 * API 3: Submit consent
 * POST /consents/submit
 */
export const useSubmitConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: SubmitConsentRequest) => submitConsentApi(data),
    onSuccess: (response) => {
      toast.success(response.message as string);
      // Invalidate consent notice query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["consent-notice"] });
    },
    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
};

/**
 * API 4: Get user consents
 * GET /consents/:data_fiduciary_id/users/:external_user_id/consents
 */
export const useGetUserConsents = (
  dataFiduciaryId: string,
  externalUserId: string,
  limit?: number
) => {
  return useQuery({
    queryKey: ["user-consents", dataFiduciaryId, externalUserId, limit],
    queryFn: () => getUserConsentsApi(dataFiduciaryId, externalUserId, limit),
    enabled: Boolean(dataFiduciaryId) && Boolean(externalUserId),
    staleTime: 5_000,
  });
};

/**
 * API 5: Withdraw consent
 * POST /consents/:data_fiduciary_id/consents/:artifact_id/withdraw
 */
export const useWithdrawConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      artifactId,
    }: {
      dataFiduciaryId: string;
      artifactId: string;
    }) => withdrawConsentApi(dataFiduciaryId, artifactId),
    onSuccess: (response) => {
      toast.success(response.message as string);
      // Invalidate user consents query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["user-consents"] });
    },
    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
};

/**
 * API 6: Renew consent
 * POST /consents/renew
 */
export const useRenewConsent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RenewConsentRequest) => renewConsentApi(data),
    onSuccess: (response) => {
      toast.success(response.message as string);
      // Invalidate user consents query to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["user-consents"] });
    },
    onError: (error) => {
      toast.error(parseApiError(error));
    },
  });
};

