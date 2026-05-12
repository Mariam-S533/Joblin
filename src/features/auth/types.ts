// ─── Registration Payloads ──────────────────────────────────────────

export type RegisterCompanyPayload = {
  companyName: string;
  domain: string;
  description: string;
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

// ─── Responses ──────────────────────────────────────────────────────

export type AuthResponse = {
  message: string;
};
