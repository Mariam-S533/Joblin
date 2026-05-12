import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCourseApplications,
  updateCourseApplicationStatus,
} from "@/services/courseApplicationsService";
import type {
  CourseApplicationsQueryParams,
  CourseApplicationStatus,
} from "@/features/course-applications/types";

import { queryKeys } from "@/lib/queryKeys";

export const useCourseApplications = (
  courseId: string,
  params?: CourseApplicationsQueryParams,
) =>
  useQuery({
    queryKey: queryKeys.courseApplications.list(courseId, params),
    queryFn: () => getCourseApplications(courseId, params),
    enabled: Boolean(courseId),
  });

export const useUpdateCourseApplicationStatus = (courseId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicantId,
      status,
    }: {
      applicantId: string;
      status: CourseApplicationStatus;
    }) => updateCourseApplicationStatus(courseId, applicantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courseApplications.all });
    },
  });
};
