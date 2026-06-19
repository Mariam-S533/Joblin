import { useQuery } from "@tanstack/react-query";
import {
  getProfileSkills,
  getProfileWorkExperiences,
} from "@/services/seekerProfileService";
import type { ProfileSkill, WorkExperience } from "@/features/seeker-profile/types";
import { queryKeys } from "@/lib/queryKeys";

export const useProfileSkills = (profileId: string | undefined) =>
  useQuery<ProfileSkill[]>({
    queryKey: queryKeys.seekerProfile.skills(profileId!),
    queryFn: () => getProfileSkills(profileId!),
    enabled: !!profileId,
  });

export const useProfileWorkExperiences = (profileId: string | undefined) =>
  useQuery<WorkExperience[]>({
    queryKey: queryKeys.seekerProfile.workExperiences(profileId!),
    queryFn: () => getProfileWorkExperiences(profileId!),
    enabled: !!profileId,
  });
