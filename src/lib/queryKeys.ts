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
  },
  postedCourses: {
    all: ["posted-courses"] as const,
    list: (companyId?: string) =>
      ["posted-courses", "list", companyId] as const,
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
  skills: {
    all: ["skills"] as const,
  },
} as const;
