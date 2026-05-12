// ─── Enums ──────────────────────────────────────────────────────────

export type PostedJobStatus = "active" | "closed" | "draft" | "expired";

/** Real department names returned by the API. "All Departments" is a UI-only filter label. */
export type Department =
  | "Design"
  | "Engineering"
  | "Product"
  | "Marketing"
  | "Sales";

// ─── Data Models ────────────────────────────────────────────────────

export type PostedJobStats = {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  applications: number;
};

export type PaginationMeta = {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type PostedJob = {
  id: string;
  jobTitle: string;
  /** Align with backend enum when available (e.g. "Full Time", "Part Time") */
  employmentType: string;
  daysRemaining: number;
  status: PostedJobStatus;
  applications: number;
  salaryMin: number;
  salaryMax: number;
  department: string;
  /** ISO 8601 date string from API */
  createdAt: string;
};

/**
 * Normalized data for UI consumption.
 * Service layer prepends "All Departments" to departments for the filter UI.
 */
export type PostedJobsPageData = {
  stats: PostedJobStats;
  jobs: PostedJob[];
  /** "All Departments" (UI label) + real departments from API */
  departments: string[];
  pagination: PaginationMeta;
};

// ─── API Payloads ───────────────────────────────────────────────────

export type PostedJobsQueryParams = {
  status?: PostedJobStatus | "all";
  department?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type DeleteJobResponse = {
  id: string;
  message: string;
};

export type ToggleJobStatusResponse = {
  id: string;
  status: PostedJobStatus;
  message: string;
};
