import { apiClient } from "@/lib/apiClient";
import type {
  CourseApplicationsPageData,
  CourseApplicationsQueryParams,
  CourseApplicationStatus,
  UpdateCourseApplicationStatusResponse,
} from "@/features/course-applications/types";

/**
 * Endpoint paths for course applications.
 *
 * Adjust the paths below to match your .NET controller routes.
 */
const endpoints = {
  list: (courseId: string) => `/PostedCourses/${courseId}/applications`,
  updateStatus: (courseId: string, applicantId: string) =>
    `/PostedCourses/${courseId}/applications/${applicantId}/status`,
};

export const getCourseApplications = async (
  courseId: string,
  params?: CourseApplicationsQueryParams,
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
  const path = qs ? `${endpoints.list(courseId)}?${qs}` : endpoints.list(courseId);

  const response = await apiClient.get<CourseApplicationsPageData>(path);
  return response.data;
};

export const updateCourseApplicationStatus = async (
  courseId: string,
  applicantId: string,
  status: CourseApplicationStatus,
) => {
  const response = await apiClient.put<UpdateCourseApplicationStatusResponse>(
    endpoints.updateStatus(courseId, applicantId),
    { status },
  );
  return response.data;
};
