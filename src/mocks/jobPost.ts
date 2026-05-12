import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  JobPostTemplate,
  SubmitJobPostResponse,
} from "@/features/job-post/types";
import {
  mockJobPostTemplate,
  setMockJobPostTemplate,
  wait,
  createResponse,
  createError,
} from "./db";

export const getJobPostTemplateMock = async (): Promise<
  ApiResponse<JobPostTemplate>
> => {
  await wait(500);
  return createResponse(mockJobPostTemplate);
};

export const submitJobPostMock = async (
  payload: JobPostTemplate,
): Promise<ApiResponse<SubmitJobPostResponse>> => {
  await wait(900);

  if (!payload.jobTitle || !payload.jobDescriptionAndRequiredSkills) {
    return createError("Job title and description are required.");
  }

  setMockJobPostTemplate({
    ...payload,
  });

  return createResponse(
    {
      id: `job-${Date.now()}`,
      status: "published",
      message: "Job posted successfully.",
    },
    { message: "Job posted successfully." },
  );
};
