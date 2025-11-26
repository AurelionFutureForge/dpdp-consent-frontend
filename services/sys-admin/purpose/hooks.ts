import { useQuery } from "@tanstack/react-query";
import { getPurposesByFiduciaryApi } from "./api";

/**
 * Fetch purposes by category
 */
export const useGetPurposesByFiduciary = (
  dataFiduciaryId: string,
  categoryId: string,
  page: number,
  limit: number,
  q?: string
) =>
  useQuery({
    queryKey: [
      "purposes",
      dataFiduciaryId,
      categoryId,
      page,
      limit,
      q,
    ],
    queryFn: () =>
      getPurposesByFiduciaryApi(
        dataFiduciaryId,
        categoryId,
        page,
        limit,
        q
      ),
    enabled: Boolean(dataFiduciaryId) && Boolean(categoryId),
    staleTime: 5_000,
  });
