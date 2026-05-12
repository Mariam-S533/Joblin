import { apiClient } from "@/lib/apiClient";
import type {
  CompanyAccountSettings,
  CompanyLogoResponse,
  CompanyPasswordPayload,
  CompanyPasswordResponse,
} from "@/features/company-settings/types";

/**
 * Endpoint paths for company account settings CRUD.
 *
 * These paths are appended to API_BASE_URL when calling the .NET backend.
 * Example: API_BASE_URL=https://localhost:5001/api → full URL becomes
 *   https://localhost:5001/api/CompanySettings
 */
const endpoints = {
  settings: "/CompanySettings",
  logo: "/CompanySettings/logo",
  password: "/CompanySettings/password",
};

export const getCompanyAccountSettings = async () => {
  const response = await apiClient.get<CompanyAccountSettings>(
    endpoints.settings,
  );
  return response.data;
};

export const updateCompanyAccountSettings = async (
  payload: CompanyAccountSettings,
) => {
  const response = await apiClient.put<CompanyAccountSettings>(
    endpoints.settings,
    payload,
  );
  return response.data;
};

export const uploadCompanySettingsLogo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<CompanyLogoResponse>(
    endpoints.logo,
    formData,
  );
  return response.data;
};

export const updateCompanyAccountPassword = async (
  payload: CompanyPasswordPayload,
) => {
  const response = await apiClient.post<CompanyPasswordResponse>(
    endpoints.password,
    payload,
  );
  return response.data;
};

export const deactivateCompanyAccount = async () => {
  const response = await apiClient.delete<CompanyAccountSettings>(
    endpoints.settings,
  );
  return response.data;
};
