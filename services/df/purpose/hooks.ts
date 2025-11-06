import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPurposesByFiduciaryApi,
  getPurposesAnalyticsByFiduciaryApi,
  createPurposeApi,
  updatePurposeApi,
  togglePurposeApi,
  deletePurposeApi,
} from "./api";
import type {
  CreatePurposePayload,
  UpdatePurposePayload,
  PurposeListApiResponse,
  PurposeItem,
  PurposeSortBy,
  SortOrder,
} from "./types";
import { toast } from "sonner";
import { parseApiError } from "@/lib/parse-api-errors";

/**
 * 1) Fetch purposes by category
 */
export const useGetPurposesByFiduciary = (
  dataFiduciaryId: string,
  categoryId: string,
  page: number,
  limit: number,
  q?: string,
  is_active?: boolean,
  sort_by?: PurposeSortBy,
  sort_order?: SortOrder
) =>
  useQuery({
    queryKey: [
      "purposes",
      dataFiduciaryId,
      categoryId,
      page,
      limit,
      q,
      is_active,
      sort_by,
      sort_order,
    ],
    queryFn: () =>
      getPurposesByFiduciaryApi(
        dataFiduciaryId,
        categoryId,
        page,
        limit,
        q,
        is_active,
        sort_by,
        sort_order
      ),
    enabled: Boolean(dataFiduciaryId) && Boolean(categoryId),
    staleTime: 5_000,
  });

/**
 * 2) Fetch purpose analytics summary
 */
export const useGetPurposesAnalyticsByFiduciary = (dataFiduciaryId: string) =>
  useQuery({
    queryKey: ["purposes", dataFiduciaryId, "analytics"],
    queryFn: () => getPurposesAnalyticsByFiduciaryApi(dataFiduciaryId),
    enabled: Boolean(dataFiduciaryId),
    staleTime: 10_000,
  });

/**
 * 3) Create a new purpose
 */
export const useCreatePurpose = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      data,
    }: {
      dataFiduciaryId: string;
      data: CreatePurposePayload;
    }) => createPurposeApi(dataFiduciaryId, data),
    onMutate: async ({ dataFiduciaryId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["purposes", dataFiduciaryId] });
      const previous = queryClient.getQueriesData({ queryKey: ["purposes", dataFiduciaryId] });

      queryClient.setQueriesData<PurposeListApiResponse>(
        { queryKey: ["purposes", dataFiduciaryId] },
        (old) => {
          if (!old?.data?.data) return old;
          const optimistic: PurposeItem = {
            purpose_id: `temp_${Date.now()}`,
            data_fiduciary_id: dataFiduciaryId,
            purpose_category_id: data.purpose_category_id,
            title: data.title,
            description: data.description,
            legal_basis: data.legal_basis,
            data_fields: data.data_fields,
            processing_activities: data.processing_activities,
            retention_period_days: data.retention_period_days,
            is_mandatory: data.is_mandatory,
            is_active: true,
            requires_renewal: data.requires_renewal,
            renewal_period_days: data.renewal_period_days,
            display_order: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            category: { purpose_category_id: data.purpose_category_id, name: "" },
            total_versions: 1,
            total_translations: 0,
          };
          return {
            ...old,
            data: {
              ...old.data,
              data: [optimistic, ...old.data.data],
            },
          };
        }
      );
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message as string);
      queryClient.invalidateQueries({ queryKey: ["purposes"] });
      queryClient.invalidateQueries({ queryKey: ["purpose-categories"] });
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      toast.error(parseApiError(error));
    },
  });
};

/**
 * 4) Update a purpose
 */
export const useUpdatePurpose = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      purposeId,
      data,
    }: {
      dataFiduciaryId: string;
      purposeId: string;
      data: UpdatePurposePayload;
    }) => updatePurposeApi(dataFiduciaryId, purposeId, data),
    onMutate: async ({ dataFiduciaryId, purposeId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["purposes", dataFiduciaryId] });
      const previous = queryClient.getQueriesData({ queryKey: ["purposes", dataFiduciaryId] });

      queryClient.setQueriesData<PurposeListApiResponse>(
        { queryKey: ["purposes", dataFiduciaryId] },
        (old) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((p) =>
                p.purpose_id === purposeId
                  ? {
                      ...p,
                      ...data,
                      updated_at: new Date().toISOString()
                    }
                  : p
              ),
            },
          };
        }
      );
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message as string);
      queryClient.invalidateQueries({ queryKey: ["purposes"] });
      queryClient.invalidateQueries({ queryKey: ["purpose-categories"] });
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      toast.error(parseApiError(error));
    },
  });
};

/**
 * 5) Toggle purpose active status
 */
export const useTogglePurpose = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      purposeId,
    }: {
      dataFiduciaryId: string;
      purposeId: string;
    }) => togglePurposeApi(dataFiduciaryId, purposeId),
    onMutate: async ({ dataFiduciaryId, purposeId }) => {
      await queryClient.cancelQueries({ queryKey: ["purposes", dataFiduciaryId] });
      const previous = queryClient.getQueriesData({ queryKey: ["purposes", dataFiduciaryId] });

      queryClient.setQueriesData<PurposeListApiResponse>(
        { queryKey: ["purposes", dataFiduciaryId] },
        (old) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((purpose: PurposeItem) =>
                purpose.purpose_id === purposeId
                  ? { ...purpose, is_active: !purpose.is_active }
                  : purpose
              ),
            },
          };
        }
      );
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message as string);
      queryClient.invalidateQueries({ queryKey: ["purposes"] });
      queryClient.invalidateQueries({ queryKey: ["purpose-categories"] });
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      toast.error(parseApiError(error));
    },
  });
};

/**
 * 6) Delete a purpose
 */
export const useDeletePurpose = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      purposeId,
    }: {
      dataFiduciaryId: string;
      purposeId: string;
    }) => deletePurposeApi(dataFiduciaryId, purposeId),
    onMutate: async ({ dataFiduciaryId, purposeId }) => {
      await queryClient.cancelQueries({ queryKey: ["purposes", dataFiduciaryId] });
      const previous = queryClient.getQueriesData({ queryKey: ["purposes", dataFiduciaryId] });

      queryClient.setQueriesData<PurposeListApiResponse>(
        { queryKey: ["purposes", dataFiduciaryId] },
        (old) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.filter((p) => p.purpose_id !== purposeId),
            },
          };
        }
      );
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message as string);
      queryClient.invalidateQueries({ queryKey: ["purposes"] });
      queryClient.invalidateQueries({ queryKey: ["purpose-categories"] });
    },
    onError: (error, _vars, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      toast.error(parseApiError(error));
    },
  });
};

