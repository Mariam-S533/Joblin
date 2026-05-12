import type { PaginationMeta } from "@/features/posted-jobs/types";

export type JobApplicationStatus =
  | "new"
  | "reviewing"
  | "rejected"
  | "accepted"
  | "interviewed";

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
  status: JobApplicationStatus;
  avatarUrl?: string | null;
  resumeUrl: string;
  skills?: string[];
  coverLetter?: string;
  resumeFileName?: string;
};

export type JobApplicationsSummary = {
  total: number;
  newCount: number;
  reviewCount: number;
  rejectedCount: number;
  acceptedCount: number;
  interviewedCount: number;
};

export type JobApplicationsPageData = {
  jobId: string;
  jobTitle: string;
  summary: JobApplicationsSummary;
  applicants: JobApplicant[];
  pagination: PaginationMeta;
};

export type JobApplicationsQueryParams = {
  status?: JobApplicationStatus | "all";
  sort?: "newest" | "oldest";
  search?: string;
  page?: number;
  pageSize?: number;
};

export type UpdateApplicationStatusResponse = {
  id: string;
  status: JobApplicationStatus;
  message: string;
};
