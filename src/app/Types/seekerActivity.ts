

export interface ApplyAjob{
  id: string;
  jobPostId: string;
  jobTitle: string;
  companyName: string;
  companyLogoUrl: string | null;
  city: string;
  country: string;
  jobType: string;
  workMode: string;
  applicationStatus: string;
  matchingScore: string;
  appliedAt: string;
  updatedAt: string;
}

export interface RequiredSkill {
  id: string;
  name: string;
}

export interface JobPost {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string;
  title: string;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  domain: string | null;
  country: string;
  city: string;
  street: string | null;
  reqExpYears: string;
  avgSalary: string;
  salaryCurrency: string | null;
  contactMail: string | null;
  createdAt: string;
  deadline: string | null;
  technicalDomain: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  jobStatus: string;
  requiredSkills: RequiredSkill[];
}

