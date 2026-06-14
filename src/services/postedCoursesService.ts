import { apiClient } from "@/lib/apiClient";
import { postedCourses as endpoints } from "@/lib/apiClient/endpoints";
import type {
  PostedCoursesResponse,
  PostedCourseStatus,
  PostedCourse,
} from "@/features/posted-courses/types";

export const getPostedCourses = async (companyId: string) => {
  const response = await apiClient.get<PostedCoursesResponse>(
    endpoints.listByCompany(companyId),
  );
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
