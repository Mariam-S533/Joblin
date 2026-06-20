import type {
  CompanyJobPostResponse,
  PostedJob,
  PostedJobStats,
  PostedJobsPageData,
} from "./types";
import { normalizeJobStatus } from "@/features/enums";

// Re-export for downstream consumers that import from this module
export { normalizeJobStatus };

// ─── Days Remaining Calculation ───────────────────────────────────────

/**
 * Compute the number of days remaining until the deadline.
 *
 * Returns `null` if deadline is null/empty (no deadline was set).
 * Returns a negative number if the deadline has passed (expired).
 */
export const computeDaysRemaining = (
  deadline: string | null,
): number | null => {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  const now = new Date();

  // Use date-only comparison (ignore time of day)
  const deadlineDay = new Date(
    deadlineDate.getFullYear(),
    deadlineDate.getMonth(),
    deadlineDate.getDate(),
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = deadlineDay.getTime() - today.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
};

// ─── Stats Computation ────────────────────────────────────────────────

/**
 * Compute stats from the raw API array.
 *
 * The backend does not return a separate stats object — we derive
 * these counts from the job posts array itself.
 *
 * `applications` is always 0 because this endpoint does not provide
 * per-job application counts. A future endpoint can fill this in.
 */
export const computeStats = (
  jobs: CompanyJobPostResponse[],
  totalCount?: number,
): PostedJobStats => {
  const normalizedStatuses = jobs.map((j) => normalizeJobStatus(j.jobStatus));

  return {
    totalJobs: totalCount ?? jobs.length,
    activeJobs: normalizedStatuses.filter((s) => s === "Active").length,
    closedJobs: normalizedStatuses.filter((s) => s === "Closed").length,
    applications: 0,
  };
};

// ─── Unique Domain Extraction ─────────────────────────────────────────

/** UI-only label prepended to domain filters. Not sent by the API. */
const ALL_DOMAINS_LABEL = "All Domains";

/**
 * Extract unique technicalDomain values from the raw API array,
 * prepending the "All Domains" UI label for the filter dropdown.
 */
export const extractTechnicalDomains = (
  jobs: CompanyJobPostResponse[],
): string[] => {
  const uniqueDomains = [...new Set(jobs.map((j) => j.technicalDomain))].filter(
    Boolean,
  );
  return [ALL_DOMAINS_LABEL, ...uniqueDomains];
};

// ─── Full Transformation ──────────────────────────────────────────────

/**
 * Transform the raw API response array into UI-friendly PostedJobsPageData.
 *
 * This is the main transformation function called by the service layer.
 * It converts each CompanyJobPostResponse into a PostedJob row and
 * computes stats + technical domain filter options.
 */
export const transformCompanyJobPosts = (
  rawJobs: CompanyJobPostResponse[],
  totalCount?: number,
): PostedJobsPageData => {
  const jobs: PostedJob[] = rawJobs.map((raw) => ({
    id: raw.id,
    title: raw.title,
    jobType: raw.jobType,
    workMode: raw.workMode,
    technicalDomain: raw.technicalDomain,
    daysRemaining: computeDaysRemaining(raw.deadline),
    jobStatus: normalizeJobStatus(raw.jobStatus),
    avgSalary: raw.avgSalary,
    country: raw.country,
    city: raw.city,
    createdAt: raw.createdAt,
    deadline: raw.deadline,
    experienceLevel: raw.experienceLevel,
    requiredSkills: raw.requiredSkills,
  }));

  return {
    stats: computeStats(rawJobs, totalCount),
    jobs,
    technicalDomains: extractTechnicalDomains(rawJobs),
  };
};
