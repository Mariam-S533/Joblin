import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostedCourses,
  deletePostedCourse,
  toggleCourseStatus,
} from "@/services/postedCoursesService";
import type { PostedCourseStatus } from "@/features/posted-courses/types";

import { queryKeys } from "@/lib/queryKeys";

export const usePostedCourses = (companyId?: string) =>
  useQuery({
    queryKey: queryKeys.postedCourses.list(companyId),
    queryFn: () => {
      if (!companyId) {
        return Promise.resolve([]);
      }
      return getPostedCourses(companyId);
    },
    enabled: Boolean(companyId),
  });

export const useDeletePostedCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePostedCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postedCourses.all });
    },
  });
};

export const useToggleCourseStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      courseId,
      newStatus,
    }: {
      courseId: string;
      newStatus: PostedCourseStatus;
    }) => toggleCourseStatus(courseId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postedCourses.all });
    },
  });
};
