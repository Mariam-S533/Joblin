import { signOut } from "next-auth/react";
import { useQueryClient, useMutation } from "@tanstack/react-query";

/**
 * Logout mutation hook.
 *
 * Clears React Query cache, localStorage, and calls NextAuth signOut.
 * Returns a standard useMutation result object (mutate, isPending, isError, etc.).
 *
 * Navigation MUST be handled by the caller via onSuccess callback:
 *   const { mutate: logout } = useLogout();
 *   logout(undefined, { onSuccess: () => { window.location.href = "/login/company"; } });
 *
 * Hook contains NO navigation logic — follows UI → Hook → Service → apiClient rule.
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, void>({
    mutationFn: async () => {
      // 1. Clear React Query cache so no sensitive or stale data remains in UI
      queryClient.clear();

      // 2. Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.clear();
      }

      // 3. Perform NextAuth sign-out without automatic reload
      await signOut({ redirect: false });
    },
  });
};
