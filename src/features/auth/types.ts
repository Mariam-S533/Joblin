// ─── Registration Payloads ──────────────────────────────────────────

export type RegisterCompanyPayload = {
  companyName: string;
  domain: string | null;
  description: string | null;
  email: string;
  password: string;
  confirmPassword: string;
};

export type RegisterSeekerPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

// ─── Password / Verification Payloads ───────────────────────────────

export type ForgotPasswordPayload = {
  email: string;
};

export type ResetPasswordPayload = {
  password: string;
  repassword: string;
  token?: string;
};

export type VerifyEmailPayload = {
  verifyCode: string;
};

// ─── Google OAuth Payloads ──────────────────────────────────────────

/**
 * Payload for google-register-company endpoint.
 * idToken comes from Google OAuth; companyName/domain/description
 * come from the registration form (stored in cookies before OAuth redirect).
 */
export type GoogleRegisterCompanyPayload = {
  idToken: string;
  companyName: string;
  domain: string | null;
  description: string | null;
};

/**
 * Payload for google-login endpoint.
 * idToken comes from Google OAuth (obtained by NextAuth during the redirect).
 * This endpoint is shared between company and seeker login — the backend
 * determines the user type from the existing account associated with the Google email.
 */
export type GoogleLoginPayload = {
  idToken: string;
};

// ─── Responses ──────────────────────────────────────────────────────

/**
 * Returned by register-company and register-seeker endpoints.
 * The .NET backend returns this as a flat JSON object (no envelope).
 * The apiClient auto-wraps it into ApiResponse<AuthUserResponse>.
 */
export type AuthUserResponse = {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
  token: string;
};

/**
 * Returned by forgot-password, reset-password, and verify-email endpoints.
 * These endpoints return a simple message string.
 */
export type AuthMessageResponse = {
  message: string;
};

/**
 * .NET ProblemDetails response (RFC 7807).
 * Returned by google-register-company and google-login according to the
 * current API contract. NEEDS BACKEND CONFIRMATION: this shape does not
 * include the app JWT, user id, role, or email needed for authenticated
 * downstream API calls after Google auth.
 */
export type ProblemDetailsResponse = {
  type: string | null;
  title: string | null;
  status: string | null;
  detail: string | null;
  instance: string | null;
};

export type GoogleAuthResponse = ProblemDetailsResponse;

/**
 * @deprecated Use AuthUserResponse or AuthMessageResponse instead.
 * Kept temporarily for backward compatibility during migration.
 */
export type AuthResponse = AuthMessageResponse;
