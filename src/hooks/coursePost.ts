import { useMutation, useQuery } from "@tanstack/react-query";
import { getCoursePostTemplate, submitCoursePost } from "@/services/coursePostService";

import { queryKeys } from "@/lib/queryKeys";

export const useCoursePostTemplate = () =>
  useQuery({
    queryKey: queryKeys.coursePost.template,
    queryFn: getCoursePostTemplate,
  });

export const useSubmitCoursePost = () =>
  useMutation({
    mutationFn: submitCoursePost,
  });
