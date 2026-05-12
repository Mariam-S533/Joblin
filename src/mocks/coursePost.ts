import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  CoursePostTemplate,
  SubmitCoursePostResponse,
} from "@/features/course-post/types";
import {
  mockCoursePostTemplate,
  setMockCoursePostTemplate,
  wait,
  createResponse,
  createError,
} from "./db";

export const getCoursePostTemplateMock = async (): Promise<
  ApiResponse<CoursePostTemplate>
> => {
  await wait(500);
  return createResponse(mockCoursePostTemplate);
};

export const submitCoursePostMock = async (
  payload: CoursePostTemplate,
): Promise<ApiResponse<SubmitCoursePostResponse>> => {
  await wait(900);

  if (!payload.courseTitle || !payload.courseDescription) {
    return createError("Course title and description are required.");
  }

  setMockCoursePostTemplate({
    ...payload,
  });

  return createResponse(
    {
      id: `course-${Date.now()}`,
      status: "published",
      message: "Course posted successfully.",
    },
    { message: "Course posted successfully." },
  );
};
