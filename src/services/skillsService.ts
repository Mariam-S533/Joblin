import { apiClient } from "@/lib/apiClient";
import { skills as endpoints } from "@/lib/apiClient/endpoints";
import type { SkillResponse } from "@/features/job-post/types";

/**
 * Fetch all available skills (GET /api/Skills).
 *
 * Returns a flat array of SkillResponse objects ({ id, name }).
 * Used by the post-job page to map user-typed skill names to IDs
 * for the requiredSkillIds field in POST /api/job-posts.
 */
export const getSkills = async (): Promise<SkillResponse[]> => {
  const response = await apiClient.get<SkillResponse[]>(endpoints.list);
  // apiClient wraps in ApiResponse<T>, so response.data is SkillResponse[]
  return response.data;
};
