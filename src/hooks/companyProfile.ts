import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CompanyProfile,
  TeamMember,
} from "@/features/company-profile/types";
import {
  addTeamMember,
  getCompanyProfile,
  removeTeamMember,
  updateCompanyProfile,
  uploadCompanyLogo,
  uploadCompanyPhotos,
} from "@/services/companyProfileService";

import { queryKeys } from "@/lib/queryKeys";

export const useCompanyProfile = (options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: queryKeys.companyProfile.all,
    queryFn: getCompanyProfile,
    enabled: options?.enabled ?? true,
  });

export const useUpdateCompanyProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCompanyProfile,
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.companyProfile.all, profile);
    },
  });
};

export const useUploadCompanyLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadCompanyLogo,
    onSuccess: ({ logoUrl }) => {
      queryClient.setQueryData<CompanyProfile | undefined>(
        queryKeys.companyProfile.all,
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

export const useUploadCompanyPhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadCompanyPhotos,
    onSuccess: ({ photoUrls }) => {
      queryClient.setQueryData<CompanyProfile | undefined>(
        queryKeys.companyProfile.all,
        (current) =>
          current
            ? {
                ...current,
                photos: [...(current.photos ?? []), ...photoUrls],
              }
            : current,
      );
    },
  });
};

export const useAddTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTeamMember,
    onSuccess: (member) => {
      queryClient.setQueryData<CompanyProfile | undefined>(
        queryKeys.companyProfile.all,
        (current) =>
          current
            ? {
                ...current,
                teamMembers: [...(current.teamMembers ?? []), member],
              }
            : current,
      );
    },
  });
};

export const useRemoveTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeTeamMember,
    onSuccess: (_, memberId) => {
      queryClient.setQueryData<CompanyProfile | undefined>(
        queryKeys.companyProfile.all,
        (current) =>
          current
            ? {
                ...current,
                teamMembers: (current.teamMembers ?? []).filter(
                  (member) => member.id !== memberId,
                ),
              }
            : current,
      );
    },
  });
};
