import { apiClient } from "@/lib/apiClient";
import { auth as endpoints } from "@/lib/apiClient/endpoints";
import type {
  RegisterCompanyPayload,
  RegisterSeekerPayload,
  LoginPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  GoogleRegisterCompanyPayload,
  GoogleLoginPayload,
  AuthUserResponse,
  AuthMessageResponse,
  GoogleAuthResponse,
} from "@/features/auth/types";

export const login = async (payload: LoginPayload) => {
  const response = await apiClient.post<AuthUserResponse>(
    endpoints.login,
    payload,
    { auth: false },
  );
  return response.data;
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
    { auth: false },
  );
  return response.data;
};

/**
 * Register a new company account via Google OAuth.
 *
 * The current backend contract returns a ProblemDetails-shaped body on
 * success. NEEDS BACKEND CONFIRMATION: it does not include the app token.
 */
export const googleRegisterCompany = async (
  payload: GoogleRegisterCompanyPayload,
) => {
  const response = await apiClient.post<GoogleAuthResponse>(
    endpoints.googleRegisterCompany,
    payload,
    { auth: false },
  );
  return response.data;
};

/**
 * Login via Google OAuth.
 *
 * This endpoint is shared between company and seeker login.
 * NEEDS BACKEND CONFIRMATION: current response contract omits user details
 * and app JWT, so NextAuth derives route role from the auth_action cookie.
 */
export const googleLogin = async (payload: GoogleLoginPayload) => {
  const response = await apiClient.post<GoogleAuthResponse>(
    endpoints.googleLogin,
    payload,
    { auth: false },
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
    { auth: false },
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
    { auth: false },
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
    { auth: false },
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
    { auth: false },
  );
  return response.data;
};
