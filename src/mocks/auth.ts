import type { ApiResponse } from "@/lib/apiClient/types";
import type { AuthResponse } from "@/features/auth/types";
import { createResponse, wait } from "./db";

export const registerCompanyMock = async (): Promise<
  ApiResponse<AuthResponse>
> => {
  await wait(800);
  return createResponse({ message: "Company registered successfully." });
};

export const registerSeekerMock = async (): Promise<
  ApiResponse<AuthResponse>
> => {
  await wait(800);
  return createResponse({ message: "Job seeker registered successfully." });
};

export const forgotPasswordMock = async (): Promise<
  ApiResponse<AuthResponse>
> => {
  await wait(600);
  return createResponse({ message: "Password reset link sent." });
};

export const resetPasswordMock = async (): Promise<
  ApiResponse<AuthResponse>
> => {
  await wait(600);
  return createResponse({ message: "Password reset successful." });
};

export const verifyEmailMock = async (): Promise<
  ApiResponse<AuthResponse>
> => {
  await wait(600);
  return createResponse({ message: "Email verified successfully." });
};
