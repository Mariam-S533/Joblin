import type { PaginationMeta } from "@/features/posted-jobs/types";
import type { ApplicationStatus, EnumOption } from "@/features/enums";
import {
  APPLICATION_STATUS_OPTIONS,
  APPLICATION_STATUS_VALUES,
  getApplicationStatusLabel,
  normalizeApplicationStatus,
} from "@/features/enums";

// Re-export for downstream consumers
export type { ApplicationStatus as CourseApplicationStatus, EnumOption };
export {
  APPLICATION_STATUS_OPTIONS,
  APPLICATION_STATUS_VALUES,
  getApplicationStatusLabel as getCourseApplicationStatusLabel,
  normalizeApplicationStatus as normalizeCourseApplicationStatus,
};

export type CourseApplicant = {
  id: string;
  courseId: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  enrolledAt: string;
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

export type CourseApplicationsSummary = {
  total: number;
  pendingCount: number;
  underReviewCount: number;
  rejectedCount: number;
  acceptedCount: number;
  withdrawnCount: number;
};

export type CourseApplicationsPageData = {
  courseId: string;
  courseTitle: string;
  summary: CourseApplicationsSummary;
  applicants: CourseApplicant[];
  pagination: PaginationMeta;
};

export type CourseApplicationsQueryParams = {
  status?: ApplicationStatus | "all";
  sort?: "newest" | "oldest";
  search?: string;
  page?: number;
  pageSize?: number;
};

export type UpdateCourseApplicationStatusResponse = {
  id: string;
  status: ApplicationStatus;
  message: string;
};

// ─── Raw API Response Types (before normalization) ────────────────────
// The .NET backend may send enum values as numeric integers instead of
// PascalCase strings. These raw types allow `string | number` for status
// fields so the service layer can normalize before the UI consumes them.

export type RawCourseApplicant = Omit<CourseApplicant, "status"> & {
  /** Backend ApplicationStatus — may arrive as PascalCase string or numeric enum value */
  status: string | number;
};

export type RawCourseApplicationsPageData = Omit<
  CourseApplicationsPageData,
  "applicants"
> & {
  applicants: RawCourseApplicant[];
};

export type RawUpdateCourseApplicationStatusResponse = Omit<
  UpdateCourseApplicationStatusResponse,
  "status"
> & {
  status: string | number;
};
