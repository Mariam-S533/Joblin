import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostedCourses,
  getPostedCourseById,
  deletePostedCourse,
  toggleCourseStatus,
} from "@/services/postedCoursesService";
import type { PostedCourseStatus, PostedCoursesResponse } from "@/features/posted-courses/types";
import type { GetPostedCoursesParams } from "@/services/postedCoursesService";

import { queryKeys } from "@/lib/queryKeys";

const EMPTY_PAGED_RESULT: PostedCoursesResponse = {
  data: [],
  totalCount: 0,
  page: 1,
  pageSize: 10,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

export const usePostedCourses = (
  companyId?: string,
  params?: GetPostedCoursesParams,
) =>
  useQuery({
    queryKey: queryKeys.postedCourses.list(companyId, params?.page, params?.pageSize),
    queryFn: () => {
      if (!companyId) {
        return Promise.resolve(EMPTY_PAGED_RESULT);
      }
      return getPostedCourses(companyId, params);
    },
    enabled: Boolean(companyId),
  });

export const usePostedCourseById = (courseId: string) =>
  useQuery({
    queryKey: queryKeys.postedCourses.detail(courseId),
    queryFn: () => getPostedCourseById(courseId),
    enabled: !!courseId,
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
