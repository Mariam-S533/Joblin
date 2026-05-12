export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Remote"
  | "On-Site"
  | "Hybrid"
  | "Internship";

export type ExperienceLevel =
  | "No experience"
  | "Less than 1 year"
  | "1-3 year"
  | "+3 year";

export type ExperiencePreference =
  | "Experience in sales, shopping centers, or stores is preferred"
  | "Accepting interns and beginners";

export type CommunicationSkill =
  | "Conflict Resolution Skill"
  | "Collabration Skill"
  | "Time management"
  | "Interpersonal skill"
  | "Adaptability";

export type SkillPair = {
  field: string;
  level: string;
};

export type JobPostTemplate = {
  jobTitle: string;
  jobCategory: string;
  organizationIndustry: string;
  organizationalLevel: string;
  department: string;
  employmentTypes: EmploymentType[];
  selectedEmploymentTypes: EmploymentType[];
  country: string;
  city: string;
  selectedLocations: string[];
  minimumSalaryAmount: string;
  displaySalaryInPost: boolean;
  selectedSalaryBadges: string[];
  experienceLevels: ExperienceLevel[];
  selectedExperienceLevels: ExperienceLevel[];
  experiencePreferences: ExperiencePreference[];
  selectedExperiencePreferences: ExperiencePreference[];
  languageSkills: SkillPair[];
  softwareSkills: SkillPair[];
  communicationSkills: CommunicationSkill[];
  selectedCommunicationSkills: CommunicationSkill[];
  workingHoursAndDays: string;
  jobDescriptionAndRequiredSkills: string;
};

export type JobPostPayload = JobPostTemplate;

export type SubmitJobPostResponse = {
  id: string;
  status: "draft" | "published";
  message: string;
};
