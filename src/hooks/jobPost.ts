import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitJobPost } from "@/services/jobPostService";
import { mapLegacyFormToApiPayload, mapFormToApiPayload } from "@/features/job-post/utils";
import type {
  CreateJobPostApiPayload,
  CreateJobPostFormPayload,
  LegacyJobPostFormState,
  SkillResponse,
  SubmitJobPostResponse,
} from "@/features/job-post/types";

import { queryKeys } from "@/lib/queryKeys";

/**
 * Submit a new job post (POST /api/job-posts).
 *
 * Accepts LegacyJobPostFormState (the page local state shape)
 * and transforms it to CreateJobPostApiPayload via mapLegacyFormToApiPayload().
 *
 * The skillsData parameter comes from GET /api/Skills and is used to
 * map user-typed skill names to IDs for the requiredSkillIds field.
 *
 * On success, invalidates:
 *   - postedJobs.all — so the new job appears in the posted-jobs list
 *
 * The page component reads mutation.isPending / mutation.isError / mutation.error
 * for loading/error feedback. This keeps the hook UI-agnostic.
 */
export const useSubmitJobPost = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SubmitJobPostResponse,
    Error,
    { formState: LegacyJobPostFormState; skillsData?: SkillResponse[] }
  >({
    mutationFn: ({ formState, skillsData }) => {
      const apiPayload: CreateJobPostApiPayload =
        mapLegacyFormToApiPayload(formState, skillsData);
      return submitJobPost(apiPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postedJobs.all });
    },
  });
};

/**
 * Submit a new job post using the NEW form payload shape (CreateJobPostFormPayload).
 *
 * Accepts CreateJobPostFormPayload directly — skill ID collection happens
 * in the page before calling this hook, so no skillsData param is needed.
 *
 * Inside, mapFormToApiPayload(payload) is called before submitJobPost.
 *
 * On success, invalidates:
 *   - postedJobs.all — so the new job appears in the posted-jobs list
 */
export const useSubmitJobPostV2 = () => {
  const queryClient = useQueryClient();

  return useMutation<SubmitJobPostResponse, Error, CreateJobPostFormPayload>({
    mutationFn: (formPayload) => {
      const apiPayload = mapFormToApiPayload(formPayload);
      return submitJobPost(apiPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.postedJobs.all });
    },
  });
};
