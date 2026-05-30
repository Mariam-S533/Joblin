import { apiClient } from "@/lib/apiClient";
import { coursePost as endpoints } from "@/lib/apiClient/endpoints";
import type {
  CoursePostPayload,
  CoursePostTemplate,
  SubmitCoursePostResponse,
} from "@/features/course-post/types";

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
