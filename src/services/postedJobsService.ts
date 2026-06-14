import { apiClient } from "@/lib/apiClient";
import { postedJobs as endpoints } from "@/lib/apiClient/endpoints";
import type {
  CompanyJobPostResponse,
  PostedJobsPageData,
  DeleteJobResponse,
  ToggleJobStatusResponse,
  PostedJobStatus,
} from "@/features/posted-jobs/types";
import { transformCompanyJobPosts } from "@/features/posted-jobs/utils";
import { normalizePostedJobStatus } from "@/features/posted-jobs/types";

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
  return transformCompanyJobPosts(rawJobs);
};

export const getJobPostById = async (
  jobPostId: string,
): Promise<CompanyJobPostResponse> => {
  const response = await apiClient.get<CompanyJobPostResponse>(
    endpoints.getById(jobPostId),
  );
  return response.data;
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
