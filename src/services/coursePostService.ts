import { apiClient } from "@/lib/apiClient";
import { coursePost as endpoints } from "@/lib/apiClient/endpoints";
import type {
  CoursePostPayload,
  SubmitCoursePostResponse,
} from "@/features/course-post/types";

export const submitCoursePost = async (payload: CoursePostPayload) => {
  const response = await apiClient.post<SubmitCoursePostResponse>(
    endpoints.submit,
    payload,
  );
  return response.data;
};
