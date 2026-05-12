import type { ApiResponse } from "@/lib/apiClient/types";
import type { CompanyHomeData } from "@/features/company-home/types";
import { mockCompanyHomeData, wait, createResponse } from "./db";

export const getCompanyHomeDataMock = async (): Promise<
  ApiResponse<CompanyHomeData>
> => {
  await wait(400);
  return createResponse(mockCompanyHomeData);
};
