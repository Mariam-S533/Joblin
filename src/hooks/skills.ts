import { useQuery } from "@tanstack/react-query";
import { getSkills } from "@/services/skillsService";
import { queryKeys } from "@/lib/queryKeys";
import type { SkillResponse } from "@/features/job-post/types";

/**
 * Fetch all available skills (GET /api/Skills).
 *
 * Returns SkillResponse[] ({ id, name }) for use in the post-job page
 * to map user-typed skill names to IDs for requiredSkillIds.
 *
 * The query is enabled only when the user is authenticated.
 * Skills are cached for 30 minutes since they rarely change.
 */
export const useSkills = (enabled = true) => {
  return useQuery<SkillResponse[], Error>({
    queryKey: queryKeys.skills.all,
    queryFn: () => getSkills(),
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
