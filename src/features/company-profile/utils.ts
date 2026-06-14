import type { CompanyDataResponse, CompanyEditFormData } from "./types";

const toStringValue = (value?: string | null) =>
  value === undefined || value === null ? "" : String(value);

const toNumberOrNull = (value?: number | null) =>
  value === undefined || value === null ? "" : String(value);

/**
 * Map CompanyDataResponse (from GET /Company/{id}) to CompanyEditFormData
 * for the dashboard profile editing form.
 */
export const mapCompanyDataToEditForm = (
  data: CompanyDataResponse,
): CompanyEditFormData => ({
  companyName: toStringValue(data.companyName),
  publicContactMail: toStringValue(data.publicContactMail),
  domain: toStringValue(data.domain),
  companySize: toNumberOrNull(data.companySize),
  description: toStringValue(data.description),
});

/**
 * Map CompanyEditFormData + userId + addresses back to UpsertCompanyPayload
 * for PUT /api/Company.
 */
export const mapEditFormToUpsertPayload = (
  userId: string,
  formData: CompanyEditFormData,
  addresses: {
    branchName: string;
    country: string;
    city: string;
    regionOrState?: string | null;
    postalCode?: string | null;
    isHeadQuarters?: boolean;
  }[],
  logoUrl?: string | null,
): {
  userId: string;
  companyName: string;
  publicContactMail?: string | null;
  domain?: string | null;
  description?: string | null;
  logoUrl?: string | null;
  companySize?: number | null;
  addresses: {
    branchName: string;
    country: string;
    city: string;
    regionOrState?: string | null;
    postalCode?: string | null;
    isHeadQuarters?: boolean;
  }[];
} => ({
  userId,
  companyName: formData.companyName,
  publicContactMail: formData.publicContactMail || null,
  domain: formData.domain || null,
  description: formData.description || null,
  logoUrl: logoUrl ?? null,
  companySize: formData.companySize ? Number(formData.companySize) : null,
  addresses,
});
