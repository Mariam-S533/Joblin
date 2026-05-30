import { apiClient } from "@/lib/apiClient";
import { courseApplications as endpoints } from "@/lib/apiClient/endpoints";
import type {
  CourseApplicationsPageData,
  CourseApplicationsQueryParams,
  CourseApplicationStatus,
  UpdateCourseApplicationStatusResponse,
  RawCourseApplicationsPageData,
  RawUpdateCourseApplicationStatusResponse,
} from "@/features/course-applications/types";
import { normalizeCourseApplicationStatus } from "@/features/course-applications/types";

/**
 * Normalize raw API response data so that all ApplicationStatus values
 * are PascalCase strings regardless of whether the backend sent them
 * as numeric integers, stringified integers, or PascalCase strings.
 */
const normalizeCourseApplicationsPageData = (
  raw: RawCourseApplicationsPageData,
): CourseApplicationsPageData => ({
  ...raw,
  applicants: raw.applicants.map((applicant) => ({
    ...applicant,
    status: normalizeCourseApplicationStatus(applicant.status),
  })),
});

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
  const path = qs
    ? `${endpoints.list(courseId)}?${qs}`
    : endpoints.list(courseId);

  const response = await apiClient.get<RawCourseApplicationsPageData>(path);
  return normalizeCourseApplicationsPageData(response.data);
};

export const updateCourseApplicationStatus = async (
  courseId: string,
  applicantId: string,
  status: CourseApplicationStatus,
) => {
  const response =
    await apiClient.put<RawUpdateCourseApplicationStatusResponse>(
      endpoints.updateStatus(courseId, applicantId),
      { status },
    );
  return {
    ...response.data,
    status: normalizeCourseApplicationStatus(response.data.status),
  } satisfies UpdateCourseApplicationStatusResponse;
};
