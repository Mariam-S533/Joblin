import { apiClient } from "@/lib/apiClient";
import { seekerProfile as endpoints } from "@/lib/apiClient/endpoints";
import type { ProfileSkill, WorkExperience } from "@/features/seeker-profile/types";

export const getProfileSkills = async (
  profileId: string,
): Promise<ProfileSkill[]> => {
  const response = await apiClient.get<ProfileSkill[]>(
    endpoints.skills(profileId),
  );
  return response.data;
};

export const getProfileWorkExperiences = async (
  profileId: string,
): Promise<WorkExperience[]> => {
  const response = await apiClient.get<WorkExperience[]>(
    endpoints.workExperiences(profileId),
  );
  return response.data;
};
