import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CompanyDataResponse,
  UpsertCompanyPayload,
  UpsertCompanyResponse,
} from "@/features/company-profile/types";
import {
  getCompanyById,
  upsertCompany,
} from "@/services/companyProfileService";

import { queryKeys } from "@/lib/queryKeys";

/**
 * Input type for the upsertCompany mutation.
 *
 * The {id} path parameter (user's id from session) is required
 * alongside the payload body, since the backend route is
 * PUT /api/Company/{id}.
 */
export type UpsertCompanyInput = {
  id: string;
  payload: UpsertCompanyPayload;
  logoFile?: File;
};

/**
 * Create or update a company profile (PUT /api/Company/{id}).
 *
 * Mutation input: UpsertCompanyInput (id + payload)
 * Mutation result: UpsertCompanyResponse
 *
 * On success, invalidates the company-data query so the dashboard
 * profile page and onboarding page pick up the updated data.
 */
export const useUpsertCompany = () => {
  const queryClient = useQueryClient();

  return useMutation<UpsertCompanyResponse, Error, UpsertCompanyInput>({
    mutationFn: ({ id, payload }) =>
      upsertCompany(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.companyData.all });
    },
  });
};

/**
 * Get company data by user id (GET /api/Company/{id}).
 *
 * Used on both:
 *   - The company-info onboarding page to determine whether
 *     the user already has company data:
 *       - If data exists → redirect to dashboard
 *       - If 404 → show the create form (PUT /api/Company/{id})
 *   - The dashboard profile page to display and edit company data
 *
 * The query is disabled by default and must be explicitly enabled
 * once the session (with user id) is available.
 */
export const useGetCompanyById = (
  id: string | undefined,
  options?: { enabled?: boolean },
) =>
  useQuery<CompanyDataResponse, Error>({
    queryKey: queryKeys.companyData.detail(id),
    queryFn: () => getCompanyById(id!),
    enabled: options?.enabled ?? !!id,
  });
