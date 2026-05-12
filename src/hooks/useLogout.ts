import { signOut } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = async (callbackUrl: string = "/login/company") => {
    // 1. Clear React Query cache so no sensitive or stale data remains in UI
    queryClient.clear();
    
    // 2. Clear localStorage
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    
    // 3. Perform NextAuth sign-out without automatic reload
    await signOut({ redirect: false });
    
    // 4. Hard redirect to bypass Next.js client-side cache completely
    // This absolutely guarantees that proxy.ts evaluates the request without a token.
    window.location.href = callbackUrl;
  };

  return logout;
};
