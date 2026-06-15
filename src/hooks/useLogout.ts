import { signOut } from "next-auth/react";
import { useCallback } from "react";
import { invalidateAuthTokenCache } from "@/lib/apiClient";
import { useQueryClient } from "@tanstack/react-query";

export const useLogout = (callbackUrl: string) => {
  const queryClient = useQueryClient();

  const logout = useCallback(
    async () => {
      invalidateAuthTokenCache();
      queryClient.clear();

      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      await signOut({ callbackUrl });
    },
    [callbackUrl, queryClient],
  );

  return { logout };
};
