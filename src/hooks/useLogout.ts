import { signOut } from "next-auth/react";
import { useState, useCallback } from "react";
import { invalidateAuthTokenCache } from "@/lib/apiClient";

import type { QueryClient } from "@tanstack/react-query";
let _queryClient: QueryClient | null = null;

export const setLogoutQueryClient = (client: QueryClient) => {
  _queryClient = client;
};

export const useLogout = () => {
  const [isPending, setIsPending] = useState(false);

  const mutate = useCallback(
    async (
      _variables?: unknown,
      options?: { onSuccess?: () => void; onError?: (err: Error) => void },
    ) => {
      setIsPending(true);
      try {
        invalidateAuthTokenCache();

        if (_queryClient) {
          _queryClient.clear();
        }

        if (typeof window !== "undefined") {
          localStorage.clear();
        }

        await signOut({ redirect: false });
        options?.onSuccess?.();
      } catch (err) {
        options?.onError?.(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsPending(false);
      }
    },
    [],
  );

  return { mutate, isPending, isError: false, isPending: isPending };
};
