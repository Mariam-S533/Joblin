import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  AuthUserResponse,
  AuthMessageResponse,
  GoogleRegisterResponse,
  GoogleRegisterCompanyPayload,
  RegisterCompanyPayload,
  RegisterSeekerPayload,
} from "@/features/auth/types";
import { createResponse, wait } from "./db";

/**
 * Mock for register-company endpoint.
 * Returns AuthUserResponse mirroring the real .NET backend response shape.
 * Uses payload data to generate a realistic mock response.
 */
export const registerCompanyMock = async (
  payload?: Partial<RegisterCompanyPayload>,
): Promise<ApiResponse<AuthUserResponse>> => {
  await wait(800);
  return createResponse({
    id: "mock-company-id-" + Math.random().toString(36).slice(2, 9),
    displayName: payload?.companyName ?? "Mock Company",
    email: payload?.email ?? "mock-company@test.com",
    roles: ["Company"],
    token: "mock-jwt-token-" + Math.random().toString(36).slice(2, 15),
  });
};

/**
 * Mock for register-seeker endpoint.
 * Returns AuthUserResponse mirroring the real .NET backend response shape.
 */
export const registerSeekerMock = async (
  payload?: Partial<RegisterSeekerPayload>,
): Promise<ApiResponse<AuthUserResponse>> => {
  await wait(800);
  return createResponse({
    id: "mock-seeker-id-" + Math.random().toString(36).slice(2, 9),
    displayName:
      payload?.firstName && payload?.lastName
        ? `${payload.firstName} ${payload.lastName}`
        : "Mock Seeker",
    email: payload?.email ?? "mock-seeker@test.com",
    roles: ["Seeker"],
    token: "mock-jwt-token-" + Math.random().toString(36).slice(2, 15),
  });
};

/**
 * Mock for google-register-company endpoint.
 * Returns an ENVELOPED response: { success, data: { userId, email, token } }
 * This mirrors the real .NET backend response shape for this endpoint.
 */
export const googleRegisterCompanyMock = async (
  payload?: Partial<GoogleRegisterCompanyPayload>,
): Promise<ApiResponse<GoogleRegisterResponse>> => {
  await wait(800);
  return createResponse({
    userId: "mock-google-company-" + Math.random().toString(36).slice(2, 9),
    email: payload?.idToken ? "google-company@test.com" : "mock-google-company@test.com",
    token: "mock-google-jwt-" + Math.random().toString(36).slice(2, 15),
  });
};

export const forgotPasswordMock = async (): Promise<
  ApiResponse<AuthMessageResponse>
> => {
  await wait(600);
  return createResponse({ message: "Password reset link sent." });
};

export const resetPasswordMock = async (): Promise<
  ApiResponse<AuthMessageResponse>
> => {
  await wait(600);
  return createResponse({ message: "Password reset successful." });
};

export const verifyEmailMock = async (): Promise<
  ApiResponse<AuthMessageResponse>
> => {
  await wait(600);
  return createResponse({ message: "Email verified successfully." });
};
