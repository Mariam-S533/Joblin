import type { PaginationMeta } from "@/features/posted-jobs/types";

export type CourseApplicationStatus =
  | "new"
  | "reviewing"
  | "rejected"
  | "accepted"
  | "interviewed";

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
  status: CourseApplicationStatus;
  avatarUrl?: string | null;
  resumeUrl: string;
  skills?: string[];
  coverLetter?: string;
  resumeFileName?: string;
};

export type CourseApplicationsSummary = {
  total: number;
  newCount: number;
  reviewCount: number;
  rejectedCount: number;
  acceptedCount: number;
  interviewedCount: number;
};

export type CourseApplicationsPageData = {
  courseId: string;
  courseTitle: string;
  summary: CourseApplicationsSummary;
  applicants: CourseApplicant[];
  pagination: PaginationMeta;
};

export type CourseApplicationsQueryParams = {
  status?: CourseApplicationStatus | "all";
  sort?: "newest" | "oldest";
  search?: string;
  page?: number;
  pageSize?: number;
};

export type UpdateCourseApplicationStatusResponse = {
  id: string;
  status: CourseApplicationStatus;
  message: string;
};
