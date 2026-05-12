import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostedJobs,
  deletePostedJob,
  toggleJobStatus,
} from "@/services/postedJobsService";
import type {
  PostedJobsQueryParams,
  PostedJobStatus,
} from "@/features/posted-jobs/types";

import { queryKeys } from "@/lib/queryKeys";

export const usePostedJobs = (params?: PostedJobsQueryParams) =>
  useQuery({
    queryKey: queryKeys.postedJobs.list(params),
    queryFn: () => getPostedJobs(params),
  });

export const useDeletePostedJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePostedJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postedJobs.all });
    },
    // onError is intentionally not set here — the page component reads
    // mutation.isError / mutation.error to display feedback.
    // This keeps the hook UI-agnostic and avoids coupling to toast/notification libraries.
  });
};

export const useToggleJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      jobId,
      newStatus,
    }: {
      jobId: string;
      newStatus: PostedJobStatus;
    }) => toggleJobStatus(jobId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postedJobs.all });
    },
    // Same as delete — page component handles error feedback via mutation state.
  });
};
