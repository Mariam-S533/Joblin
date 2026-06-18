import { apiClient } from "@/lib/apiClient";
import { postedCourses as endpoints } from "@/lib/apiClient/endpoints";
import type {
  PostedCoursesResponse,
  PostedCourseStatus,
  PostedCourse,
} from "@/features/posted-courses/types";
import type { PagedResultResponse } from "@/features/shared/types";

export type GetPostedCoursesParams = {
  page?: number;
  pageSize?: number;
};

export const getPostedCourses = async (
  companyId: string,
  params?: GetPostedCoursesParams,
): Promise<PostedCoursesResponse> => {
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const url = `${endpoints.listByCompany(companyId)}?Page=${page}&PageSize=${pageSize}`;

  const response = await apiClient.get<PagedResultResponse<PostedCourse>>(url);
  return response.data;
};

export const getPostedCourseById = async (courseId: string): Promise<PostedCourse> => {
  const response = await apiClient.get<PostedCourse>(endpoints.getById(courseId));
  return response.data;
};

export const deletePostedCourse = async (courseId: string) => {
  await apiClient.delete(endpoints.delete(courseId));
};

export const toggleCourseStatus = async (
  courseId: string,
  newStatus: PostedCourseStatus,
) => {
  await apiClient.patch(endpoints.toggleStatus(courseId), {
    offeringStatus: newStatus,
  });
};
