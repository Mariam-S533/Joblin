import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as jobApplicationsService from "@/services/jobApplicationsService";
import type {
  JobApplicationsQueryParams,
  JobApplicationStatus,
  UpdateApplicationStatusPayload,
} from "@/features/job-applications/types";

import { queryKeys } from "@/lib/queryKeys";

export const useJobApplications = (
  jobId: string,
  params?: JobApplicationsQueryParams,
) =>
  useQuery({
    queryKey: queryKeys.jobApplications.list(jobId, params),
    queryFn: () => jobApplicationsService.getJobApplications(jobId, params),
    enabled: Boolean(jobId),
  });

export function useJobApplicationsByPost(jobPostId: string) {
  return useQuery({
    queryKey: queryKeys.jobApplicationsByPost(jobPostId),
    queryFn: () =>
      jobApplicationsService.getApplicationsByJobPost(jobPostId),
    enabled: !!jobPostId,
  });
}

type JobApplicationStatusUpdateVariables = {
  applicationId: string;
  jobPostId: string;
  payload: UpdateApplicationStatusPayload;
};

type LegacyJobApplicationStatusUpdateVariables = {
  applicantId: string;
  status: JobApplicationStatus;
};

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, JobApplicationStatusUpdateVariables>({
    mutationFn: ({ applicationId, payload }) =>
      jobApplicationsService.updateApplicationStatus(applicationId, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.jobApplicationsByPost(variables.jobPostId),
      });
    },
    onError: () => {
      toast.error("Failed to update application status");
    },
  });
}

export function useUpdateApplicationStatusLegacy(jobId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, LegacyJobApplicationStatusUpdateVariables>({
    mutationFn: ({ applicantId, status }) =>
      jobApplicationsService.updateApplicationStatus(jobId, applicantId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.jobApplications.all });
    },
    onError: () => {
      toast.error("Failed to update application status");
    },
  });
}

