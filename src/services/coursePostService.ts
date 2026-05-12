import { apiClient } from "@/lib/apiClient";
import type {
  CoursePostPayload,
  CoursePostTemplate,
  SubmitCoursePostResponse,
} from "@/features/course-post/types";

/**
 * Endpoint paths for course post CRUD.
 *
 * These paths are appended to API_BASE_URL when calling the .NET backend.
 * Example: API_BASE_URL=https://localhost:5001/api → full URL becomes
 *   https://localhost:5001/api/CoursePost/template
 *
 * Adjust the paths below to match your .NET controller routes.
 */
const endpoints = {
  template: "/CoursePost/template",
  submit: "/CoursePost",
};

export const getCoursePostTemplate = async () => {
  const response = await apiClient.get<CoursePostTemplate>(endpoints.template);
  return response.data;
};

export const submitCoursePost = async (payload: CoursePostPayload) => {
  const response = await apiClient.post<SubmitCoursePostResponse>(
    endpoints.submit,
    payload,
  );
  return response.data;
};
