import { apiClient } from "@/lib/apiClient";
import { jobPost as endpoints } from "@/lib/apiClient/endpoints";
import type {
  CreateJobPostApiPayload,
  SubmitJobPostResponse,
} from "@/features/job-post/types";

/**
 * Strip null/undefined fields from the payload before sending to the backend.
 *
 * The .NET backend treats null fields as missing required values and may
 * return 400 validation errors. This is the same pattern used in authService.
 */
const stripNullsAndEmptyArrays = <T extends Record<string, unknown>>(
  obj: T,
): Partial<T> => {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && value !== undefined) {
      // Also strip empty arrays — .NET may reject [] for collection fields
      if (Array.isArray(value) && value.length === 0) continue;
      result[key] = value;
    }
  }
  return result as Partial<T>;
};

/**
 * Submit a new job post (POST /api/job-posts).
 *
 * Accepts a pre-normalized CreateJobPostApiPayload (not raw form state).
 * The hook layer calls mapLegacyFormToApiPayload() before passing data here.
 *
 * Null/undefined fields are stripped before sending to avoid .NET 400 errors
 * on optional fields that the backend doesn't accept as null.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact response shape is unknown.
 * The apiClient auto-wraps flat responses into ApiResponse<T>,
 * so we always return ApiResponse<SubmitJobPostResponse>.data.
 */
export const submitJobPost = async (
  payload: CreateJobPostApiPayload,
): Promise<SubmitJobPostResponse> => {
  // Strip null/undefined fields and empty arrays — .NET may reject them
  const cleaned = stripNullsAndEmptyArrays(payload);

  const response = await apiClient.post<SubmitJobPostResponse>(
    endpoints.submit,
    cleaned,
  );
  return response.data;
};
