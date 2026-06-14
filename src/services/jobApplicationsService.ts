import { apiClient } from "@/lib/apiClient";
import {
  jobApplications as endpoints,
  APPLICATIONS_BY_JOB_POST,
  UPDATE_APPLICATION_STATUS,
} from "@/lib/apiClient/endpoints";
import type {
  JobApplicationsPageData,
  JobApplicationsQueryParams,
  JobApplicationStatus,
  UpdateApplicationStatusResponse,
  RawJobApplicationsPageData,
  RawUpdateApplicationStatusResponse,
  JobApplicationRecord,
  RawJobApplicationRecord,
  UpdateApplicationStatusPayload,
} from "@/features/job-applications/types";
import { normalizeJobApplicationStatus } from "@/features/job-applications/types";

/**
 * Normalize raw API response data so that all ApplicationStatus values
 * are PascalCase strings regardless of whether the backend sent them
 * as numeric integers, stringified integers, or PascalCase strings.
 */
const normalizeJobApplicationsPageData = (
  raw: RawJobApplicationsPageData,
): JobApplicationsPageData => ({
  ...raw,
  applicants: raw.applicants.map((applicant) => ({
    ...applicant,
    status: normalizeJobApplicationStatus(applicant.status),
  })),
});

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

  const response = await apiClient.get<RawJobApplicationsPageData>(path);
  return normalizeJobApplicationsPageData(response.data);
};

export const getApplicationsByJobPost = async (
  jobPostId: string,
): Promise<JobApplicationRecord[]> => {
  const response = await apiClient.get<RawJobApplicationRecord[]>(
    APPLICATIONS_BY_JOB_POST(jobPostId),
  );

  return response.data.map((record) => ({
    ...record,
    applicationStatus: normalizeJobApplicationStatus(record.applicationStatus),
  }));
};

export const updateApplicationStatus = async (
  firstArg: string,
  secondArg: string | UpdateApplicationStatusPayload,
  thirdArg?: JobApplicationStatus,
): Promise<UpdateApplicationStatusResponse | void> => {
  if (typeof secondArg === "object" && secondArg !== null) {
    await apiClient.patch<void>(
      UPDATE_APPLICATION_STATUS(firstArg),
      secondArg,
    );
    return;
  }

  const response = await apiClient.put<RawUpdateApplicationStatusResponse>(
    endpoints.updateStatus(firstArg, secondArg),
    { status: thirdArg },
  );
  return {
    ...response.data,
    status: normalizeJobApplicationStatus(response.data.status),
  } satisfies UpdateApplicationStatusResponse;
};
