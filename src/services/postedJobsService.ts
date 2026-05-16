import { apiClient } from "@/lib/apiClient";
import type {
  CompanyJobPostResponse,
  PostedJobsPageData,
  DeleteJobResponse,
  ToggleJobStatusResponse,
  PostedJobStatus,
} from "@/features/posted-jobs/types";
import { transformCompanyJobPosts } from "@/features/posted-jobs/utils";

/**
 * Endpoint paths for posted jobs CRUD.
 *
 * These paths are appended to API_BASE_URL when calling the .NET backend
 * via the proxy route.
 *
 * Confirmed backend endpoints:
 *   - GET /api/job-posts/company/{companyId}
 *   - PATCH /api/job-posts/{id}/status with { jobStatus }
 *
 * REQUIRES BACKEND CONFIRMATION:
 *   - DELETE /api/job-posts/{id} — assumed, not confirmed
 */
const endpoints = {
  /** GET /api/job-posts/company/{companyId} — fetch all jobs for a company */
  listByCompany: "/job-posts/company",
  /** DELETE /api/job-posts/{id} — delete a job post (assumed) */
  delete: "/job-posts",
  /** PATCH /api/job-posts/{id}/status — update job status */
  status: "/job-posts",
};

/**
 * Fetch all job posts for a given company.
 *
 * GET /api/job-posts/company/{companyId}
 *
 * The backend returns a flat JSON array of CompanyJobPostResponse objects.
 * The apiClient auto-wraps the response into ApiResponse<CompanyJobPostResponse[]>,
 * so we access response.data to get the raw array.
 *
 * We then transform the raw array into PostedJobsPageData for UI consumption:
 *   - Normalize jobStatus strings to PostedJobStatus enum values
 *   - Compute daysRemaining from deadline
 *   - Compute stats (total, active, closed counts)
 *   - Extract unique technicalDomain values for the filter UI
 */
export const getPostedJobs = async (
  companyId: string,
): Promise<PostedJobsPageData> => {
  const response = await apiClient.get<CompanyJobPostResponse[]>(
    `${endpoints.listByCompany}/${companyId}`,
  );

  const rawJobs = response.data;
  console.log(
    "[getPostedJobs] raw first job before transformation:",
    rawJobs[0],
  );
  return transformCompanyJobPosts(rawJobs);
};

/**
 * Delete a job post by ID.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact endpoint path and response
 * shape are unknown. Assumed to be DELETE /api/job-posts/{id}.
 */
export const deletePostedJob = async (jobId: string) => {
  const response = await apiClient.delete<DeleteJobResponse>(
    `${endpoints.delete}/${jobId}`,
  );
  return response.data;
};

/**
 * Update a job post's status.
 *
 * PATCH /api/job-posts/{id}/status
 * Body: { jobStatus: "Active" | "Closed" | "Cancelled" }
 */
export const toggleJobStatus = async (
  jobId: string,
  newStatus: PostedJobStatus,
) => {
  const response = await apiClient.patch<ToggleJobStatusResponse>(
    `${endpoints.status}/${jobId}/status`,
    { jobStatus: newStatus },
  );
  return response.data;
};
