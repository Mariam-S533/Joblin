import { apiClient } from "@/lib/apiClient";
import { companyHome as endpoints } from "@/lib/apiClient/endpoints";
import type { CompanyHomeData } from "@/features/company-home/types";

export const getCompanyHomeData = async () => {
  const response = await apiClient.get<CompanyHomeData>(endpoints.home);
  return response.data;
};
