import { apiClient } from "@/lib/apiClient";
import { postedCourses as endpoints } from "@/lib/apiClient/endpoints";
import type {
  PostedCoursesResponse,
  PostedCourseStatus,
} from "@/features/posted-courses/types";

export const getPostedCourses = async (companyId: string) => {
  const response = await apiClient.get<PostedCoursesResponse>(
    endpoints.listByCompany(companyId),
  );
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
