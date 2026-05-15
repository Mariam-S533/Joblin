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
 * Returned by google-register-company and google-register-seeker endpoints.
 * Unlike register-company/register-seeker, these endpoints return an
 * ENVELOPED response: { success: true, data: { userId, email, token } }.
 * Note: field names differ from AuthUserResponse (userId vs id, no displayName/roles).
 */
export type GoogleRegisterResponse = {
  userId: string;
  email: string;
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
 * @deprecated Use AuthUserResponse or AuthMessageResponse instead.
 * Kept temporarily for backward compatibility during migration.
 */
export type AuthResponse = AuthMessageResponse;
