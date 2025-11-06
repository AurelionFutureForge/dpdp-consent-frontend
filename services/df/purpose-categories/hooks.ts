import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPurposeCategoriesByFiduciaryApi,
  getPurposeCategoriesSummaryByFiduciaryApi,
  createPurposeCategoryApi,
  updatePurposeCategoryApi,
  togglePurposeCategoryApi,
  deletePurposeCategoryApi,
} from "./api";
import type {
  CreatePurposeCategoryPayload,
  UpdatePurposeCategoryPayload,
  PurposeCategoryListApiResponse,
  PurposeCategoryItem,
} from "./types";
import { toast } from "sonner";
import { parseApiError } from "@/lib/parse-api-errors";
import type { PurposeCategorySortBy, SortOrder } from "./types";

/**
 * 1) Purpose categories by fiduciary
 */
export const useGetPurposeCategoriesByFiduciary = (
  dataFiduciaryId: string,
  page: number,
  limit: number,
  q?: string,
  is_active?: boolean,
  sort_by?: PurposeCategorySortBy,
  sort_order?: SortOrder
) =>
  useQuery({
    queryKey: [
      "purpose-categories",
      dataFiduciaryId,
      page,
      limit,
      q,
      is_active,
      sort_by,
      sort_order,
    ],
    queryFn: () =>
      getPurposeCategoriesByFiduciaryApi(
        dataFiduciaryId,
        page,
        limit,
        q,
        is_active,
        sort_by,
        sort_order
      ),
    enabled: Boolean(dataFiduciaryId),
    staleTime: 5_000,
  });

/**
 * 2) Purpose category analytics summary by fiduciary (DF view)
 */
export const useGetPurposeCategoriesSummaryByFiduciary = (
  dataFiduciaryId: string
) =>
  useQuery({
    queryKey: ["purpose-categories", dataFiduciaryId, "summary"],
    queryFn: () => getPurposeCategoriesSummaryByFiduciaryApi(dataFiduciaryId),
    enabled: Boolean(dataFiduciaryId),
    staleTime: 10_000,
  });

/**
 * 3) Create a new purpose category
 */
export const useCreatePurposeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      data,
    }: {
      dataFiduciaryId: string;
      data: CreatePurposeCategoryPayload;
    }) => createPurposeCategoryApi(dataFiduciaryId, data),
    onMutate: async ({ dataFiduciaryId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["purpose-categories", dataFiduciaryId] });
      const previous = queryClient.getQueriesData({ queryKey: ["purpose-categories", dataFiduciaryId] });
      // Optimistically add item to lists filtered by this fiduciary
      queryClient.setQueriesData<PurposeCategoryListApiResponse>(
        { queryKey: ["purpose-categories", dataFiduciaryId] },
        (old) => {
          if (!old?.data?.data) return old;
          const optimistic: PurposeCategoryItem = {
            purpose_category_id: `temp_${Date.now()}`,
            data_fiduciary_id: dataFiduciaryId,
            name: data.name,
            description: data.description,
            display_order: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            total_purposes: 0,
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
      queryClient.invalidateQueries({ queryKey: ["purpose-categories"] });
    },
    onError: (error, _vars, context) => {
      // rollback
      if (context?.previous) {
        context.previous.forEach(([key, data]) => queryClient.setQueryData(key, data));
      }
      toast.error(parseApiError(error));
    },
  });
};

/**
 * 4) Update a purpose category
 */
export const useUpdatePurposeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      purposeCategoryId,
      data,
    }: {
      dataFiduciaryId: string;
      purposeCategoryId: string;
      data: UpdatePurposeCategoryPayload;
    }) => updatePurposeCategoryApi(dataFiduciaryId, purposeCategoryId, data),
    onMutate: async ({ dataFiduciaryId, purposeCategoryId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["purpose-categories", dataFiduciaryId] });
      const previous = queryClient.getQueriesData({ queryKey: ["purpose-categories", dataFiduciaryId] });
      queryClient.setQueriesData<PurposeCategoryListApiResponse>(
        { queryKey: ["purpose-categories", dataFiduciaryId] },
        (old) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((c) =>
                c.purpose_category_id === purposeCategoryId
                  ? { ...c, name: data.name, description: data.description, updated_at: new Date().toISOString() }
                  : c
              ),
            },
          };
        }
      );
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message as string);
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
 * 5) Toggle purpose category active status (with optimistic update)
 */
export const useTogglePurposeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      purposeCategoryId,
    }: {
      dataFiduciaryId: string;
      purposeCategoryId: string;
    }) => togglePurposeCategoryApi(dataFiduciaryId, purposeCategoryId),
    onMutate: async ({ dataFiduciaryId, purposeCategoryId }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["purpose-categories", dataFiduciaryId],
      });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueriesData({
        queryKey: ["purpose-categories", dataFiduciaryId],
      });

      // Optimistically update to the new value
      queryClient.setQueriesData<PurposeCategoryListApiResponse>(
        { queryKey: ["purpose-categories", dataFiduciaryId] },
        (old) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.map((category: PurposeCategoryItem) =>
                category.purpose_category_id === purposeCategoryId
                  ? { ...category, is_active: !category.is_active }
                  : category
              ),
            },
          };
        }
      );

      // Return a context object with the snapshotted value
      return { previousCategories };
    },
    onSuccess: (res) => {
      toast.success(res.message as string);
      queryClient.invalidateQueries({ queryKey: ["purpose-categories"] });
    },
    onError: (error, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCategories) {
        context.previousCategories.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(parseApiError(error));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["purpose-categories"] });
    },
  });
};

/**
 * 6) Delete a purpose category
 */
export const useDeletePurposeCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      dataFiduciaryId,
      purposeCategoryId,
    }: {
      dataFiduciaryId: string;
      purposeCategoryId: string;
    }) => deletePurposeCategoryApi(dataFiduciaryId, purposeCategoryId),
    onMutate: async ({ dataFiduciaryId, purposeCategoryId }) => {
      await queryClient.cancelQueries({ queryKey: ["purpose-categories", dataFiduciaryId] });
      const previous = queryClient.getQueriesData({ queryKey: ["purpose-categories", dataFiduciaryId] });
      queryClient.setQueriesData<PurposeCategoryListApiResponse>(
        { queryKey: ["purpose-categories", dataFiduciaryId] },
        (old) => {
          if (!old?.data?.data) return old;
          return {
            ...old,
            data: {
              ...old.data,
              data: old.data.data.filter((c) => c.purpose_category_id !== purposeCategoryId),
            },
          };
        }
      );
      return { previous };
    },
    onSuccess: (res) => {
      toast.success(res.message as string);
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
