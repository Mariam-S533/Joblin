export type SocialLinks = {
  linkedin?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
};

export type TeamMember = {
  id?: string;
  fullName?: string;
  position?: string;
  yearsOfExperience?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
};

export type CompanyProfile = {
  id?: string;
  companyName?: string;
  industry?: string;
  foundedYear?: string;
  location?: string;
  companySize?: string;
  email?: string;
  phone?: string;
  website?: string;
  description?: string;
  socialLinks?: SocialLinks;
  logoUrl?: string;
  photos?: string[];
  teamMembers?: TeamMember[];
};

export type CompanyProfileFormData = {
  companyName: string;
  industry: string;
  foundedYear: string;
  location: string;
  companySize: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  linkedin: string;
  facebook: string;
  instagram: string;
  x: string;
};

export type CompanyProfileParsed = {
  formData: CompanyProfileFormData;
  logoUrl: string;
  companyPhotos: string[];
  teamMembers: TeamMember[];
};
