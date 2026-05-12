export const queryKeys = {
  companyProfile: {
    all: ["company-profile"] as const,
  },
  companySettings: {
    all: ["company-settings"] as const,
  },
  companyHome: {
    all: ["company-home"] as const,
  },
  jobPost: {
    template: ["job-post", "template"] as const,
  },
  coursePost: {
    template: ["course-post", "template"] as const,
  },
  postedJobs: {
    all: ["posted-jobs"] as const,
    list: (params?: unknown) => ["posted-jobs", "list", params] as const,
  },
  postedCourses: {
    all: ["posted-courses"] as const,
    list: (params?: unknown) => ["posted-courses", "list", params] as const,
  },
  jobApplications: {
    all: ["job-applications"] as const,
    list: (jobId: string, params?: unknown) =>
      ["job-applications", jobId, params] as const,
  },
  courseApplications: {
    all: ["course-applications"] as const,
    list: (courseId: string, params?: unknown) =>
      ["course-applications", courseId, params] as const,
  },
} as const;
