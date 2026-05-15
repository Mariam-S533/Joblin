import { useMutation } from "@tanstack/react-query";
import {
  registerCompany,
  registerSeeker,
  googleRegisterCompany,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "@/services/authService";
import type {
  RegisterCompanyPayload,
  RegisterSeekerPayload,
  GoogleRegisterCompanyPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyEmailPayload,
  AuthUserResponse,
  AuthMessageResponse,
  GoogleRegisterResponse,
} from "@/features/auth/types";

/**
 * Register a new company account.
 *
 * Mutation input: RegisterCompanyPayload
 * Mutation result: AuthUserResponse (id, displayName, email, roles, token)
 *
 * Usage:
 *   const mutation = useRegisterCompany();
 *   mutation.mutate(payload, { onSuccess: (data) => router.push('/login/company') });
 */
export const useRegisterCompany = () =>
  useMutation<AuthUserResponse, Error, RegisterCompanyPayload>({
    mutationFn: registerCompany,
  });

/**
 * Register a new job seeker account.
 *
 * Mutation input: RegisterSeekerPayload
 * Mutation result: AuthUserResponse (id, displayName, email, roles, token)
 */
export const useRegisterSeeker = () =>
  useMutation<AuthUserResponse, Error, RegisterSeekerPayload>({
    mutationFn: registerSeeker,
  });
  
  /**
   * Register a new company account via Google OAuth.
   *
   * Note: This hook is primarily for mock mode testing. In production,
   * the Google OAuth flow is handled by NextAuth's jwt callback (server-side).
   * The hook allows testing the service/mock layer from a React component.
   *
   * Mutation input: GoogleRegisterCompanyPayload
   * Mutation result: GoogleRegisterResponse (userId, email, token)
   */
  export const useGoogleRegisterCompany = () =>
    useMutation<GoogleRegisterResponse, Error, GoogleRegisterCompanyPayload>({
      mutationFn: googleRegisterCompany,
    });
  
  /**
   * Request a password reset link.
 *
 * Mutation input: ForgotPasswordPayload
 * Mutation result: AuthMessageResponse
 */
export const useForgotPassword = () =>
  useMutation<AuthMessageResponse, Error, ForgotPasswordPayload>({
    mutationFn: forgotPassword,
  });

/**
 * Reset password using token from reset link.
 *
 * Mutation input: ResetPasswordPayload
 * Mutation result: AuthMessageResponse
 */
export const useResetPassword = () =>
  useMutation<AuthMessageResponse, Error, ResetPasswordPayload>({
    mutationFn: resetPassword,
  });

/**
 * Verify email address with OTP code.
 *
 * Mutation input: VerifyEmailPayload
 * Mutation result: AuthMessageResponse
 */
export const useVerifyEmail = () =>
  useMutation<AuthMessageResponse, Error, VerifyEmailPayload>({
    mutationFn: verifyEmail,
  });
