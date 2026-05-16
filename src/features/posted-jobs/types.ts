// ─── Centralized Enum Imports ────────────────────────────────────────
import type { JobStatus, EnumOption } from "@/features/enums";
import {
  JOB_STATUS_OPTIONS,
  JOB_STATUS_VALUES,
  getJobStatusLabel,
  normalizeJobStatus,
} from "@/features/enums";

// Re-export for downstream consumers
export type { JobStatus as PostedJobStatus, EnumOption };
export {
  JOB_STATUS_OPTIONS,
  JOB_STATUS_VALUES,
  getJobStatusLabel as getPostedJobStatusLabel,
  normalizeJobStatus as normalizePostedJobStatus,
};

// ─── Shared Utility Types (used by other features) ────────────────────

/**
 * Pagination metadata — shared across list endpoints.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact pagination shape is unknown.
 * Kept here because other features (job-applications, course-applications,
 * posted-courses) import it from this file.
 */
export type PaginationMeta = {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Department names — shared across features that filter by department.
 *
 * REQUIRES BACKEND CONFIRMATION: the real department values from the
 * backend are unknown. "All Departments" is a UI-only filter label.
 * Kept here because posted-courses imports it from this file.
 */
export type Department =
  | "Design"
  | "Engineering"
  | "Product"
  | "Marketing"
  | "Sales";

// ─── Raw API Response (exact mirror of backend) ──────────────────────
/**
 * Skill object returned inside each CompanyJobPostResponse.
 */
export type RequiredSkillResponse = {
  id: string;
  name: string;
};

/**
 * Exact response shape from GET /api/job-posts/company/{companyId}.
 *
 * The backend returns a flat JSON array of these objects.
 * All nullable fields use `string | null` to match the API example
 * where they can be `null`.
 *
 * IMPORTANT: Enum string fields (jobType, workMode, experienceLevel,
 * technicalDomain, jobStatus) contain the EXACT backend enum values
 * in PascalCase (e.g., "FullTime", "Onsite", "EntryLevel", "Active").
 */
export type CompanyJobPostResponse = {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  title: string;
  description: string | null;
  requirements: string | null;
  responsibilities: string | null;
  domain: string | null;
  country: string;
  city: string;
  street: string | null;
  reqExpYears: string;
  minSalary: string;
  maxSalary: string;
  salaryCurrency: string | null;
  visaSponsorship: boolean;
  contactMail: string | null;
  createdAt: string;
  deadline: string | null;
  technicalDomain: string;
  jobType: string;
  workMode: string;
  experienceLevel: string;
  /** Backend JobStatus — may arrive as PascalCase string ("Active","Closed","Cancelled")
   *  or as numeric enum value (1=Active, 2=Closed, 3=Cancelled). */
  jobStatus: string | number;
  requiredSkills: RequiredSkillResponse[];
};

// ─── UI-Friendly Models (after transformation) ───────────────────────
export type PostedJobStats = {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  /** Always 0 — application counts are not available from this endpoint.
   *  A future applications-count endpoint can fill this in. */
  applications: number;
};
/**
 * UI-friendly job post row — transformed from CompanyJobPostResponse.
 *
 * Field names are normalized for UI consumption:
 *   - title (not jobTitle)
 *   - jobStatus (normalized PostedJobStatus, not raw string)
 *   - daysRemaining (computed from deadline, not from API)
 *   - minSalary/maxSalary (strings, not numbers)
 */
export type PostedJob = {
  id: string;
  title: string;
  jobType: string;
  workMode: string;
  technicalDomain: string;
  /** Computed from deadline. null means no deadline was set. */
  daysRemaining: number | null;
  /** Normalized to PostedJobStatus (JobStatus) enum values: "Active" | "Closed" | "Cancelled" */
  jobStatus: JobStatus;
  minSalary: string;
  maxSalary: string;
  country: string;
  city: string;
  /** ISO 8601 date string from API */
  createdAt: string;
  deadline: string | null;
  experienceLevel: string;
  requiredSkills: RequiredSkillResponse[];
};
/**
 * Normalized data for UI consumption.
 *
 * The service layer transforms the raw API array into this shape
 *   - stats: computed from the array (total, active, closed counts)
 *   - jobs: transformed PostedJob[] rows
 *   - technicalDomains: unique domain values for the filter UI
 *     (prepended with "All Domains" label)
 */
export type PostedJobsPageData = {
  stats: PostedJobStats;
  jobs: PostedJob[];
  /** "All Domains" (UI label) + unique technicalDomain values from API */
  technicalDomains: string[];
};
// ─── API Payloads (for delete/toggle — paths need backend confirmation) ──
export type DeleteJobResponse = {
  id: string;
  message: string;
};
export type ToggleJobStatusResponse = void;
