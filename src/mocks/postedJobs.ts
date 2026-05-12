import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  PostedJobsPageData,
  PostedJobStats,
  PostedJob,
  DeleteJobResponse,
  ToggleJobStatusResponse,
  PostedJobStatus,
} from "@/features/posted-jobs/types";
import { createResponse, createError, wait } from "./db";

// ─── Seed Data ──────────────────────────────────────────────────────

export let mockPostedJobs: PostedJob[] = [
  {
    id: "job-1",
    jobTitle: "UI/UX Designer",
    employmentType: "Full Time",
    daysRemaining: 27,
    status: "active",
    applications: 798,
    salaryMin: 11,
    salaryMax: 22,
    department: "Design",
    createdAt: "2025-04-08T00:00:00Z",
  },
  {
    id: "job-2",
    jobTitle: "Frontend Developer",
    employmentType: "Full Time",
    daysRemaining: 27,
    status: "active",
    applications: 654,
    salaryMin: 15,
    salaryMax: 30,
    department: "Engineering",
    createdAt: "2025-04-08T00:00:00Z",
  },
  {
    id: "job-3",
    jobTitle: "Product Manager",
    employmentType: "Full Time",
    daysRemaining: 27,
    status: "active",
    applications: 432,
    salaryMin: 20,
    salaryMax: 40,
    department: "Product",
    createdAt: "2025-04-08T00:00:00Z",
  },
  {
    id: "job-4",
    jobTitle: "Marketing Specialist",
    employmentType: "Part Time",
    daysRemaining: 27,
    status: "active",
    applications: 512,
    salaryMin: 10,
    salaryMax: 18,
    department: "Marketing",
    createdAt: "2025-04-08T00:00:00Z",
  },
  {
    id: "job-5",
    jobTitle: "Sales Representative",
    employmentType: "Full Time",
    daysRemaining: 0,
    status: "closed",
    applications: 316,
    salaryMin: 8,
    salaryMax: 15,
    department: "Sales",
    createdAt: "2025-03-10T00:00:00Z",
  },
];

export const setMockPostedJobs = (jobs: PostedJob[]) => {
  mockPostedJobs = jobs;
};

// ─── Mock Handlers ──────────────────────────────────────────────────

export const getPostedJobsMock = async (
  status?: string,
  department?: string,
  page?: number,
  pageSize?: number,
): Promise<ApiResponse<PostedJobsPageData>> => {
  await wait(600);

  let filtered = [...mockPostedJobs];

  if (status && status !== "all") {
    filtered = filtered.filter((job) => job.status === status);
  }

  if (department && department !== "All Departments") {
    filtered = filtered.filter((job) => job.department === department);
  }

  // Stats are computed from ALL jobs (not filtered) to match real API behavior
  const activeCount = mockPostedJobs.filter(
    (j) => j.status === "active",
  ).length;
  const closedCount = mockPostedJobs.filter(
    (j) => j.status === "closed",
  ).length;
  const totalApps = mockPostedJobs.reduce((sum, j) => sum + j.applications, 0);

  const stats: PostedJobStats = {
    totalJobs: mockPostedJobs.length,
    activeJobs: activeCount,
    closedJobs: closedCount,
    applications: totalApps,
  };

  // Derive departments dynamically from seed data (no "All Departments" — service adds it)
  const departments: string[] = [
    ...new Set(mockPostedJobs.map((j) => j.department)),
  ].sort();

  // Pagination
  const currentPage = page ?? 1;
  const size = pageSize ?? 10;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const start = (currentPage - 1) * size;
  const pagedJobs = filtered.slice(start, start + size);

  return createResponse<PostedJobsPageData>({
    stats,
    jobs: pagedJobs,
    departments,
    pagination: {
      totalCount,
      page: currentPage,
      pageSize: size,
      totalPages,
    },
  });
};

export const deletePostedJobMock = async (
  jobId: string,
): Promise<ApiResponse<DeleteJobResponse>> => {
  await wait(400);

  const job = mockPostedJobs.find((j) => j.id === jobId);
  if (!job) {
    return createError("Job not found.");
  }

  mockPostedJobs = mockPostedJobs.filter((j) => j.id !== jobId);

  return createResponse({
    id: jobId,
    message: "Job deleted successfully.",
  });
};

export const toggleJobStatusMock = async (
  jobId: string,
  newStatus: PostedJobStatus,
): Promise<ApiResponse<ToggleJobStatusResponse>> => {
  await wait(400);

  const job = mockPostedJobs.find((j) => j.id === jobId);
  if (!job) {
    return createError("Job not found.");
  }

  job.status = newStatus;

  return createResponse({
    id: jobId,
    status: newStatus,
    message: `Job status updated to ${newStatus}.`,
  });
};
