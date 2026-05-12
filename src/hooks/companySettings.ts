import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CompanyAccountSettings } from "@/features/company-settings/types";
import {
  deactivateCompanyAccount,
  getCompanyAccountSettings,
  updateCompanyAccountPassword,
  updateCompanyAccountSettings,
  uploadCompanySettingsLogo,
} from "@/services/companySettingsService";

import { queryKeys } from "@/lib/queryKeys";

export const useCompanySettings = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: queryKeys.companySettings.all,
    queryFn: getCompanyAccountSettings,
    enabled: options?.enabled ?? true,
  });

export const useUpdateCompanySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompanyAccountSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.companySettings.all, settings);
    },
  });
};

export const useUploadCompanySettingsLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadCompanySettingsLogo,
    onSuccess: ({ logoUrl }) => {
      queryClient.setQueryData<CompanyAccountSettings | undefined>(
        queryKeys.companySettings.all,
        (current) =>
          current
            ? {
                ...current,
                logoUrl,
              }
            : current,
      );
    },
  });
};

export const useUpdateCompanyPassword = () =>
  useMutation({
    mutationFn: updateCompanyAccountPassword,
  });

export const useDeactivateCompanyAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deactivateCompanyAccount,
    onSuccess: (settings) => {
      queryClient.setQueryData(queryKeys.companySettings.all, settings);
    },
  });
};
