import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  CompanyAccountSettings,
  CompanyPasswordPayload,
} from "@/features/company-settings/types";
import {
  createError,
  createResponse,
  fileToDataUrl,
  mockCompanySettings,
  setMockCompanySettings,
  wait,
} from "./db";

export const getCompanySettingsMock = async (): Promise<
  ApiResponse<CompanyAccountSettings>
> => {
  await wait(500);
  return createResponse(mockCompanySettings);
};

export const updateCompanySettingsMock = async (
  payload: CompanyAccountSettings,
): Promise<ApiResponse<CompanyAccountSettings>> => {
  await wait(700);

  if (!payload.companyName?.trim()) {
    return createError("Company name is required.");
  }

  if (!payload.primaryContact?.email?.trim()) {
    return createError("Primary contact email is required.");
  }

  if (!payload.supportEmail?.trim()) {
    return createError("Support email is required.");
  }

  setMockCompanySettings({
    ...mockCompanySettings,
    ...payload,
    id: mockCompanySettings.id,
  });

  return createResponse(mockCompanySettings, {
    message: "Account settings updated.",
  });
};

export const uploadCompanySettingsLogoMock = async (
  file: File | null,
): Promise<ApiResponse<{ logoUrl: string }>> => {
  await wait(600);
  if (!file) {
    return createError("No file provided.");
  }

  const logoUrl = await fileToDataUrl(file);
  setMockCompanySettings({
    ...mockCompanySettings,
    logoUrl,
  });

  return createResponse(
    { logoUrl },
    {
      message: "Logo updated.",
    },
  );
};

export const updateCompanyPasswordMock = async (
  payload: CompanyPasswordPayload,
): Promise<ApiResponse<{ updatedAt: string }>> => {
  await wait(800);

  if (!payload.currentPassword || !payload.newPassword) {
    return createError("Current and new passwords are required.");
  }

  if (payload.newPassword.length < 8) {
    return createError("Password must be at least 8 characters.");
  }

  const updatedAt = new Date().toISOString();
  setMockCompanySettings({
    ...mockCompanySettings,
    security: {
      ...mockCompanySettings.security,
      lastPasswordChangeAt: updatedAt,
    },
  });

  return createResponse(
    { updatedAt },
    {
      message: "Password updated.",
    },
  );
};

export const deactivateCompanyAccountMock = async (): Promise<
  ApiResponse<CompanyAccountSettings>
> => {
  await wait(600);
  setMockCompanySettings({
    ...mockCompanySettings,
    accountStatus: "deactivated",
  });

  return createResponse(mockCompanySettings, {
    message: "Account deactivated.",
  });
};
