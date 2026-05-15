import { apiClient } from "@/lib/apiClient";
import type {
  RegisterCompanyPayload,
  RegisterSeekerPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  GoogleRegisterCompanyPayload,
  AuthUserResponse,
  AuthMessageResponse,
  GoogleRegisterResponse,
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
  googleRegisterCompany: "/Authentication/google-register-company",
  forgotPassword: "/Authentication/forgot-password",
  resetPassword: "/Authentication/reset-password",
  verifyEmail: "/Authentication/verify-email",
};

/**
 * Strip null/undefined fields from the payload before sending to the backend.
 * The .NET backend treats null fields as missing required values, so we
 * normalize by removing them to avoid validation errors on optional fields.
 */
const stripNulls = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      result[key] = value;
    }
  }
  return result as Partial<T>;
};

/**
 * Register a new company account.
 *
 * Returns AuthUserResponse containing the user id, displayName, email,
 * roles, and JWT token. The .NET backend returns this as a flat JSON
 * object — the apiClient auto-wraps it into ApiResponse<AuthUserResponse>.
 */
export const registerCompany = async (payload: RegisterCompanyPayload) => {
  const normalized = stripNulls(payload);
  const response = await apiClient.post<AuthUserResponse>(
    endpoints.registerCompany,
    normalized,
  );
  return response.data;
};

/**
 * Register a new company account via Google OAuth.
 *
 * Unlike register-company, this endpoint returns an ENVELOPED response:
 * { success: true, data: { userId, email, token } }
 * The apiClient auto-wraps flat responses, but since this response already
 * has a `success` field, it will be treated as enveloped and the `data`
 * property will be extracted automatically.
 *
 * Note: This function is primarily for mock mode testing. In production,
 * NextAuth's jwt callback calls the backend directly (server-side fetch).
 */
export const googleRegisterCompany = async (payload: GoogleRegisterCompanyPayload) => {
  const normalized = stripNulls(payload);
  const response = await apiClient.post<GoogleRegisterResponse>(
    endpoints.googleRegisterCompany,
    normalized,
  );
  return response.data;
};

/**
 * Register a new job seeker account.
 *
 * Returns AuthUserResponse (same shape as company registration).
 */
export const registerSeeker = async (payload: RegisterSeekerPayload) => {
  const response = await apiClient.post<AuthUserResponse>(
    endpoints.registerSeeker,
    payload,
  );
  return response.data;
};

/**
 * Request a password reset link via email.
 *
 * Returns AuthMessageResponse with a confirmation message.
 */
export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await apiClient.post<AuthMessageResponse>(
    endpoints.forgotPassword,
    payload,
  );
  return response.data;
};

/**
 * Reset password using the token from the reset link.
 *
 * Returns AuthMessageResponse with a confirmation message.
 */
export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await apiClient.post<AuthMessageResponse>(
    endpoints.resetPassword,
    payload,
  );
  return response.data;
};

/**
 * Verify email address using the OTP code sent to the user.
 *
 * Returns AuthMessageResponse with a confirmation message.
 */
export const verifyEmail = async (payload: VerifyEmailPayload) => {
  const response = await apiClient.post<AuthMessageResponse>(
    endpoints.verifyEmail,
    payload,
  );
  return response.data;
};
