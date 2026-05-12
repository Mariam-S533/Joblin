import { apiClient } from "@/lib/apiClient";
import type {
  PostedCoursesPageData,
  PostedCoursesQueryParams,
  DeleteCourseResponse,
  ToggleCourseStatusResponse,
  PostedCourseStatus,
} from "@/features/posted-courses/types";

/**
 * Endpoint path for posted courses list.
 *
 * This path is appended to API_BASE_URL when calling the .NET backend.
 * Adjust the path below to match your .NET controller route.
 */
const endpoints = {
  list: "/PostedCourses",
  delete: "/PostedCourses",
  toggleStatus: "/PostedCourses/status",
};

/** UI-only label prepended to department filters. Not sent by the API. */
const ALL_DEPARTMENTS_LABEL = "All Departments";

export const getPostedCourses = async (params?: PostedCoursesQueryParams) => {
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

  const response = await apiClient.get<PostedCoursesPageData>(path);

  const data = response.data;
  return {
    ...data,
    departments: [ALL_DEPARTMENTS_LABEL, ...data.departments],
  } satisfies PostedCoursesPageData;
};

export const deletePostedCourse = async (courseId: string) => {
  const response = await apiClient.delete<DeleteCourseResponse>(
    `${endpoints.delete}/${courseId}`,
  );
  return response.data;
};

export const toggleCourseStatus = async (
  courseId: string,
  newStatus: PostedCourseStatus,
) => {
  const response = await apiClient.put<ToggleCourseStatusResponse>(
    `${endpoints.toggleStatus}/${courseId}`,
    { status: newStatus },
  );
  return response.data;
};

