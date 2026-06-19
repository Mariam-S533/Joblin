// ─── Upsert Company (PUT /Company) ─────────────────────────────────

/**
 * Address sub-object for the upsert-company payload.
 *
 * Required fields: branchName, country, city
 * Optional/nullable fields: regionOrState, postalCode
 * isHeadQuarters defaults to true.
 */
export type AddressPayload = {
  branchName: string;
  country: string;
  city: string;
  regionOrState?: string | null;
  postalCode?: string | null;
  isHeadQuarters?: boolean;
};

/**
 * Payload for PUT /api/Company — create or update company profile.
 *
 * This is used both for:
 *   - Initial company creation (onboarding step after registration)
 *   - Updating existing company profile data on the dashboard
 *
 * userId comes from the authenticated session (not from user input).
 *
 * Required fields: userId, companyName
 * Optional/nullable fields: publicContactMail, domain, description, logoUrl, companySize
 * addresses must contain at least one entry with required address fields.
 *
 * Note: companySize is a NUMBER in the API contract (not a string).
 */
export type UpsertCompanyPayload = {
  userId: string;
  companyName: string;
  publicContactMail?: string | null;
  domain?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  companySize?: number | null;
  addresses: AddressPayload[];
};

/**
 * Response from PUT /api/Company.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact response shape is unknown.
 * The .NET backend may return the created/updated Company object (flat),
 * a ProblemDetails response, or an enveloped response.
 * The apiClient auto-wraps flat responses into ApiResponse<T>,
 * so the service layer will always return ApiResponse<UpsertCompanyResponse>.data.
 *
 * For now, we define a minimal response type that covers the most likely shape.
 * Update this once the backend response is confirmed.
 */
export type UpsertCompanyResponse = {
  id?: string;
  companyName?: string;
  userId?: string;
  message?: string;
  status?: number;
};

// ─── Get Company Data (GET /Company/{id}) ───────────────────────────

/**
 * Address sub-object returned by GET /api/Company/{id}.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact response shape for addresses
 * is unknown. This mirrors AddressPayload but adds optional `id` field
 * since persisted addresses likely have a database-generated id.
 */
export type AddressResponse = {
  id?: string;
  branchName?: string;
  country?: string;
  city?: string;
  regionOrState?: string | null;
  postalCode?: string | null;
  isHeadQuarters?: boolean;
};

/**
 * Response from GET /api/Company/{id} — company profile data.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact response shape is unknown.
 * Fields are all optional because the response shape may differ from what we expect.
 *
 * The {id} path parameter is the user's id (from session.id),
 * since the backend identifies the company by the owning user.
 */
export type CompanyDataResponse = {
  id?: string;
  userId?: string;
  companyName?: string;
  publicContactMail?: string | null;
  domain?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  companySize?: number | null;
  addresses?: AddressResponse[];
};

// ─── Dashboard Profile Edit Form ────────────────────────────────────

/**
 * Form data for editing company profile on the dashboard.
 *
 * Maps to editable fields from CompanyDataResponse.
 * companySize is a string in the form, converted to number for the API.
 */
export type CompanyEditFormData = {
  companyName: string;
  publicContactMail: string;
  domain: string;
  companySize: string;
  description: string;
};
