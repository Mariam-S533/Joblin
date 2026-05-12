import { apiClient } from "@/lib/apiClient";
import type {
  PostedJobsPageData,
  PostedJobsQueryParams,
  DeleteJobResponse,
  ToggleJobStatusResponse,
  PostedJobStatus,
} from "@/features/posted-jobs/types";

/**
 * Endpoint paths for posted jobs CRUD.
 *
 * These paths are appended to API_BASE_URL when calling the .NET backend.
 * Adjust the paths below to match your .NET controller routes.
 */
const endpoints = {
  list: "/PostedJobs",
  delete: "/PostedJobs",
  toggleStatus: "/PostedJobs/status",
};

/** UI-only label prepended to department filters. Not sent by the API. */
const ALL_DEPARTMENTS_LABEL = "All Departments";

/**
 * Fetch posted jobs with optional filters.
 *
 * Normalization: the API returns real department names only.
 * We prepend "All Departments" here so the UI always has the "no filter" option
 * without the backend needing to know about it.
 */
export const getPostedJobs = async (params?: PostedJobsQueryParams) => {
  const queryParams = new URLSearchParams();
  if (params?.status && params.status !== "all") {
    queryParams.set("status", params.status);
  }
  if (params?.department && params.department !== ALL_DEPARTMENTS_LABEL) {
    queryParams.set("department", params.department);
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
  const path = qs ? `${endpoints.list}?${qs}` : endpoints.list;

  const response = await apiClient.get<PostedJobsPageData>(path);

  // Normalize: prepend "All Departments" for the UI filter
  const data = response.data;
  return {
    ...data,
    departments: [ALL_DEPARTMENTS_LABEL, ...data.departments],
  } satisfies PostedJobsPageData;
};

export const deletePostedJob = async (jobId: string) => {
  const response = await apiClient.delete<DeleteJobResponse>(
    `${endpoints.delete}/${jobId}`,
  );
  return response.data;
};

export const toggleJobStatus = async (
  jobId: string,
  newStatus: PostedJobStatus,
) => {
  const response = await apiClient.put<ToggleJobStatusResponse>(
    `${endpoints.toggleStatus}/${jobId}`,
    { status: newStatus },
  );
  return response.data;
};
