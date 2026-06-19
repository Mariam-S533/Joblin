import type { ApplicationStatus, EnumOption } from "@/features/enums";
import {
  APPLICATION_STATUS_OPTIONS,
  APPLICATION_STATUS_VALUES,
  normalizeApplicationStatus,
} from "@/features/enums";

export type { ApplicationStatus as CourseApplicationStatus, EnumOption };
export {
  APPLICATION_STATUS_OPTIONS,
  APPLICATION_STATUS_VALUES,
  normalizeApplicationStatus as normalizeCourseApplicationStatus,
};

export type OfferingEnrollment = {
  enrollmentId: string;
  seekerId: string;
  seekerProfileId: string;
  seekerName: string;
  profilePictureUrl: string | null;
  seekerEmail: string;
  phone: string | null;
  location: string | null;
  status: ApplicationStatus;
  appliedAt: string;
  latestEducation: string | null;
  experienceYears: string;
};

export type OfferingEnrollmentDetail = OfferingEnrollment & {
  skills: string[];
  resumeUrl: string | null;
};

export type RawOfferingEnrollment = Omit<OfferingEnrollment, "status"> & {
  status: string | number;
};

export type RawOfferingEnrollmentDetail = Omit<OfferingEnrollmentDetail, "status"> & {
  status: string | number;
};

export type UpdateEnrollmentStatusPayload = {
  status: string;
};
