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
import type { PagedResultResponse } from "@/features/shared/types";

export type GetPostedJobsParams = {
  page?: number;
  pageSize?: number;
};

export const getPostedJobs = async (
  companyId: string,
  params?: GetPostedJobsParams,
): Promise<PostedJobsPageData> => {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const url = `${endpoints.listByCompany}/${companyId}?Page=${page}&PageSize=${pageSize}`;

  const response = await apiClient.get<PagedResultResponse<CompanyJobPostResponse>>(url);
  const pagedResult = response.data;
  const rawJobs = pagedResult.data;

  return {
    ...transformCompanyJobPosts(rawJobs, pagedResult.totalCount),
    pagination: {
      page: pagedResult.page,
      pageSize: pagedResult.pageSize,
      totalCount: pagedResult.totalCount,
      totalPages: pagedResult.totalPages,
      hasNextPage: pagedResult.hasNextPage,
      hasPreviousPage: pagedResult.hasPreviousPage,
    },
  };
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
