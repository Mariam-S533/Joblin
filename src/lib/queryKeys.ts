export const queryKeys = {
  companyData: {
    all: ["company-data"] as const,
    detail: (id?: string) => ["company-data", id] as const,
  },
  companySettings: {
    all: ["company-settings"] as const,
  },
  companyHome: {
    all: ["company-home"] as const,
  },
  jobPost: {
    all: ["job-post"] as const,
  },
  coursePost: {
    template: ["course-post", "template"] as const,
  },
  postedJobs: {
    all: ["posted-jobs"] as const,
    list: (companyId?: string) => ["posted-jobs", "list", companyId] as const,
    detail: (jobPostId: string) => ["posted-jobs", "detail", jobPostId] as const,
  },
  postedCourses: {
    all: ["posted-courses"] as const,
    list: (companyId?: string) =>
      ["posted-courses", "list", companyId] as const,
    detail: (courseId: string) =>
      ["posted-courses", "detail", courseId] as const,
  },
  jobApplications: {
    all: ["job-applications"] as const,
    list: (jobId: string, params?: unknown) =>
      ["job-applications", jobId, params] as const,
  },
  jobApplicationsByPost: (jobPostId: string) =>
    ["jobApplications", "byPost", jobPostId] as const,
  applicationDetail: (applicationId: string) =>
    ["jobApplications", "detail", applicationId] as const,
  courseApplications: {
    all: ["course-applications"] as const,
    list: (courseId: string, params?: unknown) =>
      ["course-applications", courseId, params] as const,
    enrollmentsByOffering: (offeringId: string) =>
      ["course-applications", "enrollments", offeringId] as const,
    enrollmentDetails: (enrollmentId: string) =>
      ["course-applications", "enrollment-details", enrollmentId] as const,
  },
  skills: {
    all: ["skills"] as const,
  },
  seekerProfile: {
    skills: (profileId: string) => ["seeker-profile", "skills", profileId] as const,
    workExperiences: (profileId: string) => ["seeker-profile", "work-experiences", profileId] as const,
  },
} as const;
