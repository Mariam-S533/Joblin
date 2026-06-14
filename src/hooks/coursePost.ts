import { useMutation } from "@tanstack/react-query";
import { submitCoursePost } from "@/services/coursePostService";

export const useSubmitCoursePost = () =>
  useMutation({
    mutationFn: submitCoursePost,
  });
