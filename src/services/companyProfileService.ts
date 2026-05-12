import { apiClient } from "@/lib/apiClient";
import type {
  CompanyProfile,
  TeamMember,
} from "@/features/company-profile/types";

/**
 * Endpoint paths for company profile CRUD.
 *
 * These paths are appended to API_BASE_URL when calling the .NET backend.
 * Example: API_BASE_URL=https://localhost:5001/api → full URL becomes
 *   https://localhost:5001/api/CompanyProfile
 *
 * Adjust the paths below to match your .NET controller routes.
 */
const endpoints = {
  profile: "/CompanyProfile",
  logo: "/CompanyProfile/logo",
  photos: "/CompanyProfile/photos",
  teamMembers: "/CompanyProfile/team-members",
};

export const getCompanyProfile = async () => {
  const response = await apiClient.get<CompanyProfile>(endpoints.profile);
  return response.data;
};

export const updateCompanyProfile = async (payload: CompanyProfile) => {
  const response = await apiClient.put<CompanyProfile>(
    endpoints.profile,
    payload,
  );
  return response.data;
};

export const uploadCompanyLogo = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await apiClient.post<{ logoUrl: string }>(
    endpoints.logo,
    formData,
  );
  return response.data;
};

export const uploadCompanyPhotos = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));
  const response = await apiClient.post<{ photoUrls: string[] }>(
    endpoints.photos,
    formData,
  );
  return response.data;
};

export const addTeamMember = async (payload: TeamMember) => {
  const response = await apiClient.post<TeamMember>(
    endpoints.teamMembers,
    payload,
  );
  return response.data;
};

export const removeTeamMember = async (id: string) => {
  const response = await apiClient.delete<null>(
    `${endpoints.teamMembers}?id=${id}`,
  );
  return response.data;
};
