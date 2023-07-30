// usePaginatedTransactions.ts

import { useCallback, useState } from "react";
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types";
import { PaginatedTransactionsResult } from "./types";
import { useCustomFetch } from "./useCustomFetch";

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(
    null
  );

  const fetchAll = useCallback(async () => {
    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions?.nextPage ?? 0,
      }
    );

    setPaginatedTransactions((previousResponse) => {
      if (response === null) {
        return previousResponse;
      }

      if (previousResponse === null || response.nextPage === 0) {
        return response;
      }

      return {
        data: [...(previousResponse.data ?? []), ...response.data], // Merge existing data with the new data
        nextPage: response.nextPage,
      };
    });
  }, [fetchWithCache, paginatedTransactions]);

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  return { data: paginatedTransactions, loading, fetchAll, invalidateData };
}
