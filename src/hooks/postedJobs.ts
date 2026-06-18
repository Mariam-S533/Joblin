import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostedJobs,
  getJobPostById,
  deletePostedJob,
  toggleJobStatus,
} from "@/services/postedJobsService";
import type {
  PostedJobStatus,
  PostedJobsPageData,
  CompanyJobPostResponse,
} from "@/features/posted-jobs/types";

import { queryKeys } from "@/lib/queryKeys";

/**
 * Fetch all job posts for a company.
 *
 * GET /api/job-posts/company/{companyId}
 *
 * The companyId is required — the query is disabled until a valid
 * companyId is provided. The page component should obtain companyId
 * from the company profile data (CompanyDataResponse.id).
 *
 * Client-side filtering (by status, domain, search) is done in the
 * page component, not via query params, because the backend endpoint
 * returns all jobs for the company without filtering support.
 */
import type {
  GetPostedJobsParams,
} from "@/services/postedJobsService";

export const usePostedJobs = (
  companyId: string | undefined,
  params?: GetPostedJobsParams,
) =>
  useQuery({
    queryKey: queryKeys.postedJobs.list(companyId, params?.page, params?.pageSize),
    queryFn: () => getPostedJobs(companyId!, params),
    enabled: !!companyId,
  });

export const useJobPostById = (jobPostId: string | undefined) =>
  useQuery<CompanyJobPostResponse>({
    queryKey: queryKeys.postedJobs.detail(jobPostId!),
    queryFn: () => getJobPostById(jobPostId!),
    enabled: !!jobPostId,
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

    // ── Optimistic update: apply new status to cache BEFORE API call ──
    onMutate: async ({ jobId, newStatus }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: queryKeys.postedJobs.all });

      // Snapshot the previous cache data for rollback on error
      const previousData = queryClient.getQueriesData<PostedJobsPageData>({
        queryKey: queryKeys.postedJobs.all,
      });

      // Optimistically update the job status in all matching queries
      queryClient.setQueriesData<PostedJobsPageData>(
        { queryKey: queryKeys.postedJobs.all },
        (current) => {
          if (!current) return current;

          const jobs = current.jobs.map((job) =>
            job.id === jobId ? { ...job, jobStatus: newStatus } : job,
          );

          return {
            ...current,
            jobs,
            stats: {
              ...current.stats,
              activeJobs: jobs.filter((job) => job.jobStatus === "Active")
                .length,
              closedJobs: jobs.filter((job) => job.jobStatus === "Closed")
                .length,
            },
          };
        },
      );

      // Return snapshot context for onError rollback
      return { previousData };
    },

    // ── Rollback: restore previous cache data if mutation fails ──
    onError: (_err, _vars, context) => {
      if (!context?.previousData) return;
      for (const [queryKey, data] of context.previousData) {
        queryClient.setQueryData(queryKey, data);
      }
    },

    // ── Refetch: invalidate only on success so the optimistic update
    //    is confirmed with fresh backend data. On error, onError already
    //    rolls back to the snapshot, so invalidating would re-fetch stale
    //    data and overwrite the rollback — causing the "reverts to Closed" bug.
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postedJobs.all });
    },
  });
};
