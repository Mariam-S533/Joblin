export type ProfileSkill = {
  id: string;
  name: string;
};

export type WorkExperience = {
  id: string;
  companyName: string;
  jobTitle: string;
  description: string;
  jobType: string;
  country: string | null;
  city: string | null;
  startDate: string | null;
  endDate: string | null;
  isCurrentRole: boolean;
};
