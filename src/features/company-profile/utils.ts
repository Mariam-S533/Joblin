import type {
  CompanyProfile,
  CompanyProfileFormData,
  CompanyProfileParsed,
  TeamMember,
} from "./types";

const FALLBACK_LOGO_URL =
  "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg";

const toStringValue = (value?: string | null) =>
  value === undefined || value === null ? "" : String(value);

export const parseCompanyProfile = (
  profile: CompanyProfile,
): CompanyProfileParsed => ({
  formData: {
    companyName: toStringValue(profile.companyName),
    industry: toStringValue(profile.industry),
    foundedYear: toStringValue(profile.foundedYear),
    location: toStringValue(profile.location),
    companySize: toStringValue(profile.companySize),
    email: toStringValue(profile.email),
    phone: toStringValue(profile.phone),
    website: toStringValue(profile.website),
    description: toStringValue(profile.description),
    linkedin: toStringValue(profile.socialLinks?.linkedin),
    facebook: toStringValue(profile.socialLinks?.facebook),
    instagram: toStringValue(profile.socialLinks?.instagram),
    x: toStringValue(profile.socialLinks?.x),
  },
  logoUrl: profile.logoUrl || FALLBACK_LOGO_URL,
  companyPhotos: profile.photos ?? [],
  teamMembers:
    profile.teamMembers?.map((member) => ({
      id: member.id,
      fullName: toStringValue(member.fullName),
      position: toStringValue(member.position),
      yearsOfExperience: toStringValue(member.yearsOfExperience),
      linkedin: toStringValue(member.linkedin),
      facebook: toStringValue(member.facebook),
      instagram: toStringValue(member.instagram),
    })) ?? [],
});

export const serializeCompanyProfile = ({
  id,
  formData,
  teamMembers,
  logoUrl,
  companyPhotos,
}: {
  id?: string | null;
  formData: CompanyProfileFormData;
  teamMembers: TeamMember[];
  logoUrl: string;
  companyPhotos: string[];
}): CompanyProfile => ({
  id: id ?? undefined,
  companyName: formData.companyName,
  industry: formData.industry,
  foundedYear: formData.foundedYear,
  location: formData.location,
  companySize: formData.companySize,
  email: formData.email,
  phone: formData.phone,
  website: formData.website,
  description: formData.description,
  socialLinks: {
    linkedin: formData.linkedin,
    facebook: formData.facebook,
    instagram: formData.instagram,
    x: formData.x,
  },
  logoUrl,
  photos: companyPhotos,
  teamMembers,
});
