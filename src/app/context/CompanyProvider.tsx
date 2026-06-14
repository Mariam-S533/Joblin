"use client";

import { useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { setLogoutQueryClient } from "@/hooks/useLogout";

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
            staleTime: 3 * 60 * 1000,
          },
        },
      }),
  );

  setLogoutQueryClient(queryClient);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
