import { apiClient } from "@/lib/apiClient";
import type {
  JobApplicationsPageData,
  JobApplicationsQueryParams,
  JobApplicationStatus,
  UpdateApplicationStatusResponse,
} from "@/features/job-applications/types";

/**
 * Endpoint paths for job applications.
 *
 * Adjust the paths below to match your .NET controller routes.
 */
const endpoints = {
  list: (jobId: string) => `/PostedJobs/${jobId}/applications`,
  updateStatus: (jobId: string, applicantId: string) =>
    `/PostedJobs/${jobId}/applications/${applicantId}/status`,
};

export const getJobApplications = async (
  jobId: string,
  params?: JobApplicationsQueryParams,
) => {
  const queryParams = new URLSearchParams();
  if (params?.status && params.status !== "all") {
    queryParams.set("status", params.status);
  }
  if (params?.sort) {
    queryParams.set("sort", params.sort);
  }
  if (params?.search) {
    queryParams.set("search", params.search);
  }
  if (params?.page) {
    queryParams.set("page", String(params.page));
  }
  if (params?.pageSize) {
    queryParams.set("pageSize", String(params.pageSize));
  }

  const qs = queryParams.toString();
  const path = qs ? `${endpoints.list(jobId)}?${qs}` : endpoints.list(jobId);

  const response = await apiClient.get<JobApplicationsPageData>(path);
  return response.data;
};

export const updateApplicationStatus = async (
  jobId: string,
  applicantId: string,
  status: JobApplicationStatus,
) => {
  const response = await apiClient.put<UpdateApplicationStatusResponse>(
    endpoints.updateStatus(jobId, applicantId),
    { status },
  );
  return response.data;
};
