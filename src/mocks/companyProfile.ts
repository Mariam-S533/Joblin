import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  CompanyProfile,
  TeamMember,
} from "@/features/company-profile/types";
import {
  mockProfile,
  setMockProfile,
  fileToDataUrl,
  wait,
  createResponse,
  createError,
} from "./db";

export const getCompanyProfileMock = async (): Promise<
  ApiResponse<CompanyProfile>
> => {
  await wait(500);
  return createResponse(mockProfile);
};

export const updateCompanyProfileMock = async (
  payload: CompanyProfile,
): Promise<ApiResponse<CompanyProfile>> => {
  await wait(700);
  setMockProfile({
    ...mockProfile,
    ...payload,
    id: mockProfile.id,
  });
  return createResponse(mockProfile, { message: "Profile updated" });
};

export const uploadCompanyLogoMock = async (
  file: File | null,
): Promise<ApiResponse<{ logoUrl: string }>> => {
  await wait(600);
  if (!file) {
    return createError("No file provided.");
  }

  const logoUrl = await fileToDataUrl(file);
  setMockProfile({
    ...mockProfile,
    logoUrl,
  });

  return createResponse({ logoUrl }, { message: "Logo uploaded" });
};

export const uploadCompanyPhotosMock = async (
  files: File[],
): Promise<ApiResponse<{ photoUrls: string[] }>> => {
  await wait(900);
  if (!files.length) {
    return createError("No files provided.");
  }

  const photoUrls = await Promise.all(files.map(fileToDataUrl));
  setMockProfile({
    ...mockProfile,
    photos: [...(mockProfile.photos ?? []), ...photoUrls],
  });

  return createResponse({ photoUrls }, { message: "Photos uploaded" });
};

export const addTeamMemberMock = async (
  payload: TeamMember,
): Promise<ApiResponse<TeamMember>> => {
  await wait(500);
  const newMember: TeamMember = {
    ...payload,
    id: payload.id ?? `member-${Date.now()}`,
  };
  const members = [...(mockProfile.teamMembers ?? []), newMember];

  setMockProfile({
    ...mockProfile,
    teamMembers: members,
  });

  return createResponse(newMember, { message: "Team member added" });
};

export const removeTeamMemberMock = async (
  memberId: string | null,
): Promise<ApiResponse<null>> => {
  await wait(400);
  if (!memberId) {
    return createError("Member ID is required.");
  }

  const members = (mockProfile.teamMembers ?? []).filter(
    (member) => member.id !== memberId,
  );

  setMockProfile({
    ...mockProfile,
    teamMembers: members,
  });

  return createResponse(null, { message: "Team member removed" });
};
