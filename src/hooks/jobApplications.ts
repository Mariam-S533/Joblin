import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getJobApplications,
  updateApplicationStatus,
} from "@/services/jobApplicationsService";
import type {
  JobApplicationsQueryParams,
  JobApplicationStatus,
} from "@/features/job-applications/types";

import { queryKeys } from "@/lib/queryKeys";

export const useJobApplications = (
  jobId: string,
  params?: JobApplicationsQueryParams,
) =>
  useQuery({
    queryKey: queryKeys.jobApplications.list(jobId, params),
    queryFn: () => getJobApplications(jobId, params),
    enabled: Boolean(jobId),
  });

export const useUpdateApplicationStatus = (jobId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      applicantId,
      status,
    }: {
      applicantId: string;
      status: JobApplicationStatus;
    }) => updateApplicationStatus(jobId, applicantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobApplications.all });
    },
  });
};
