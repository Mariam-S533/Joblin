import { apiClient } from "@/lib/apiClient";
import type {
  JobPostPayload,
  JobPostTemplate,
  SubmitJobPostResponse,
} from "@/features/job-post/types";

/**
 * Endpoint paths for job post CRUD.
 *
 * These paths are appended to API_BASE_URL when calling the .NET backend.
 * Example: API_BASE_URL=https://localhost:5001/api → full URL becomes
 *   https://localhost:5001/api/JobPost/template
 *
 * Adjust the paths below to match your .NET controller routes.
 */
const endpoints = {
  template: "/JobPost/template",
  submit: "/JobPost",
};

export const getJobPostTemplate = async () => {
  const response = await apiClient.get<JobPostTemplate>(endpoints.template);
  return response.data;
};

export const submitJobPost = async (payload: JobPostPayload) => {
  const response = await apiClient.post<SubmitJobPostResponse>(
    endpoints.submit,
    payload,
  );
  return response.data;
};
