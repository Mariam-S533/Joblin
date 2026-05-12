import { useMutation, useQuery } from "@tanstack/react-query";
import { getJobPostTemplate, submitJobPost } from "@/services/jobPostService";

import { queryKeys } from "@/lib/queryKeys";

export const useJobPostTemplate = () =>
  useQuery({
    queryKey: queryKeys.jobPost.template,
    queryFn: getJobPostTemplate,
  });

export const useSubmitJobPost = () =>
  useMutation({
    mutationFn: submitJobPost,
  });
