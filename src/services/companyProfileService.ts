import { apiClient } from "@/lib/apiClient";
import type {
  CompanyDataResponse,
  UpsertCompanyPayload,
  UpsertCompanyResponse,
} from "@/features/company-profile/types";


/**
 * Endpoint paths for company profile CRUD.
 *
 * The backend only has two endpoints for company data:
 *   - GET  /api/Company/{id}  — fetch company data by user id
 *   - PUT  /api/Company/{id}  — create or update company data
 *
 * Both require the {id} path parameter (the user's id from session).
 * There is NO /CompanyProfile endpoint and NO POST at /Company.
 * Logo, photos, and team-member sub-endpoints do NOT exist.
 */
const endpoints = {
  company: "/Company",
};

/**
 * Create or update a company profile (PUT /api/Company/{id}).
 *
 * This is used both for:
 *   - Initial company creation (onboarding step after registration)
 *   - Updating existing company profile data on the dashboard
 *
 * The {id} path parameter is the user's id (from session.id).
 * userId is also included in the payload body for the backend.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact response shape is unknown.
 * The apiClient auto-wraps flat responses, so we always return
 * ApiResponse<UpsertCompanyResponse>.data.
 */
export const upsertCompany = async (
  id: string,
  payload: UpsertCompanyPayload,
) => {
  const response = await apiClient.put<UpsertCompanyResponse>(
    `${endpoints.company}/${id}`,
    payload,
  );
  return response.data;
};

/**
 * Get company profile data by user id.
 *
 * GET /api/Company/{id} — returns the company data for the given user.
 * The {id} path parameter is the user's id (from session.id).
 *
 * Used on the company-info onboarding page to check if the user
 * already has company data. If data exists, redirect to dashboard;
 * if 404, show the create form.
 *
 * Also used on the dashboard profile page to display and edit
 * company profile data.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact response shape is unknown.
 */
export const getCompanyById = async (id: string) => {
  const response = await apiClient.get<CompanyDataResponse>(
    `${endpoints.company}/${id}`,
  );
  return response.data;
};
