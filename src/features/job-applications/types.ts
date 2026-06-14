import type { PaginationMeta } from "@/features/shared/types";
import type { ApplicationStatus, EnumOption } from "@/features/enums";
import {
  APPLICATION_STATUS_OPTIONS,
  APPLICATION_STATUS_VALUES,
  getApplicationStatusLabel,
  normalizeApplicationStatus,
} from "@/features/enums";

// Re-export for downstream consumers
export type { ApplicationStatus as JobApplicationStatus, EnumOption };
export {
  APPLICATION_STATUS_OPTIONS,
  APPLICATION_STATUS_VALUES,
  getApplicationStatusLabel as getJobApplicationStatusLabel,
  normalizeApplicationStatus as normalizeJobApplicationStatus,
};

export type JobApplicant = {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedAt: string;
  experience: string;
  education: string;
  rating: number;
  /** Backend ApplicationStatus enum value: "Pending" | "UnderReview" | "Accepted" | "Rejected" | "Withdrawn" */
  status: ApplicationStatus;
  avatarUrl?: string | null;
  resumeUrl: string;
  skills?: string[];
  coverLetter?: string;
  resumeFileName?: string;
};

export interface JobApplicationRecord {
  applicationId: string;
  seekerId: string;
  seekerFirstName: string;
  seekerLastName: string;
  seekerProfilePictureUrl: string | null;
  seekerProfileId: string;
  seekerProfileName: string;
  technicalDomain: string;
  skills: string[];
  applicationStatus: ApplicationStatus;
  matchingScore: string;
  appliedAt: string;
  updatedAt: string;
}

export interface RawJobApplicationRecord
  extends Omit<JobApplicationRecord, "applicationStatus"> {
  applicationStatus: string | number;
}

export interface UpdateApplicationStatusPayload {
  applicationStatus: string;
}

export type JobApplicationsSummary = {
  total: number;
  pendingCount: number;
  underReviewCount: number;
  rejectedCount: number;
  acceptedCount: number;
  withdrawnCount: number;
};

export type JobApplicationsPageData = {
  jobId: string;
  jobTitle: string;
  summary: JobApplicationsSummary;
  applicants: JobApplicant[];
  pagination: PaginationMeta;
};

export type JobApplicationsQueryParams = {
  status?: ApplicationStatus | "all";
  sort?: "newest" | "oldest";
  search?: string;
  page?: number;
  pageSize?: number;
};

export type UpdateApplicationStatusResponse = {
  id: string;
  status: ApplicationStatus;
  message: string;
};

// ─── Raw API Response Types (before normalization) ────────────────────
// The .NET backend may send enum values as numeric integers instead of
// PascalCase strings. These raw types allow `string | number` for status
// fields so the service layer can normalize before the UI consumes them.

export type RawJobApplicant = Omit<JobApplicant, "status"> & {
  /** Backend ApplicationStatus — may arrive as PascalCase string or numeric enum value */
  status: string | number;
};

export type RawJobApplicationsPageData = Omit<
  JobApplicationsPageData,
  "applicants"
> & {
  applicants: RawJobApplicant[];
};

export type RawUpdateApplicationStatusResponse = Omit<
  UpdateApplicationStatusResponse,
  "status"
> & {
  status: string | number;
};
