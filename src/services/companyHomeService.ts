import { apiClient } from "@/lib/apiClient";
import type { CompanyHomeData } from "@/features/company-home/types";

/**
 * Endpoint path for company home page data.
 *
 * This path is appended to API_BASE_URL when calling the .NET backend.
 * Example: API_BASE_URL=https://localhost:5001/api → full URL becomes
 *   https://localhost:5001/api/CompanyHome
 *
 * Adjust the path below to match your .NET controller route.
 */
const endpoints = {
  home: "/CompanyHome",
};

export const getCompanyHomeData = async () => {
  const response = await apiClient.get<CompanyHomeData>(endpoints.home);
  return response.data;
};
