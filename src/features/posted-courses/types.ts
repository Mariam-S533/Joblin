import type { JobStatus, EnumOption } from "@/features/enums";
import {
  JOB_STATUS_OPTIONS,
  JOB_STATUS_VALUES,
  getJobStatusLabel,
  normalizeJobStatus,
} from "@/features/enums";
import type { PagedResultResponse } from "@/features/shared/types";

// Re-export for downstream consumers
export type { JobStatus as PostedCourseStatus, EnumOption };
export {
  JOB_STATUS_OPTIONS,
  JOB_STATUS_VALUES,
  getJobStatusLabel as getPostedCourseStatusLabel,
  normalizeJobStatus as normalizePostedCourseStatus,
};

export type ProvidedSkill = {
  id: string;
  name: string;
};

export type PostedCourse = {
  id: string;
  companyId: string;
  companyName: string;
  companyLogoUrl: string | null;
  /** ISO 8601 date string from API */
  createdAt: string;
  /** ISO 8601 date-time or null */
  deadline: string | null;
  title: string;
  description: string | null;
  duration: string;
  startDate: string | null;
  endDate: string | null;
  country: string;
  city: string;
  street: string | null;
  price: string;
  currency: string | null;
  enrollmentUrl: string;
  hasCertificate: boolean;
  outcomeDescription: string | null;
  technicalDomain: string;
  deliveryMode: string;
  difficultyLevel: string;
  offeringStatus: string | number;
  providedSkills: ProvidedSkill[];
};

export type PostedCoursesResponse = PagedResultResponse<PostedCourse>;
