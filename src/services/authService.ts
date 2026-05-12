import { apiClient } from "@/lib/apiClient";
import type {
  RegisterCompanyPayload,
  RegisterSeekerPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  AuthResponse,
} from "@/features/auth/types";

/**
 * Endpoint paths for authentication operations.
 *
 * These paths are appended to API_BASE_URL when calling the .NET backend.
 * Adjust the paths below to match your .NET controller routes.
 */
const endpoints = {
  registerCompany: "/Authentication/register-company",
  registerSeeker: "/Authentication/register-seeker",
  forgotPassword: "/Authentication/forgot-password",
  resetPassword: "/Authentication/reset-password",
  verifyEmail: "/Authentication/verify-email",
};

export const registerCompany = async (payload: RegisterCompanyPayload) => {
  const response = await apiClient.post<AuthResponse>(
    endpoints.registerCompany,
    payload,
  );
  return response.data;
};

export const registerSeeker = async (payload: RegisterSeekerPayload) => {
  const response = await apiClient.post<AuthResponse>(
    endpoints.registerSeeker,
    payload,
  );
  return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await apiClient.post<AuthResponse>(
    endpoints.forgotPassword,
    payload,
  );
  return response.data;
};

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await apiClient.post<AuthResponse>(
    endpoints.resetPassword,
    payload,
  );
  return response.data;
};

export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const response = await apiClient.post<AuthResponse>(
    endpoints.verifyEmail,
    payload,
  );
  return response.data;
};
