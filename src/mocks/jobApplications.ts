import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  JobApplicant,
  JobApplicationsPageData,
  JobApplicationsQueryParams,
  JobApplicationStatus,
  UpdateApplicationStatusResponse,
} from "@/features/job-applications/types";
import { mockPostedJobs } from "@/mocks/postedJobs";
import { createError, createResponse, wait } from "./db";

const formatDateLabel = (isoDate: string) => {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return isoDate;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export let mockJobApplicants: JobApplicant[] = [
  {
    id: "app-1",
    jobId: "job-1",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA",
    appliedAt: "2025-01-20T00:00:00Z",
    experience: "5 years experience",
    education: "BS Design, Stanford",
    rating: 4.8,
    status: "new",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/sarah-johnson.pdf",
    resumeFileName: "sarah-johnson-resume.pdf",
    skills: [
      "UI Design",
      "Figma",
      "UX Research",
      "Prototyping",
      "User Testing",
      "Wire Framing",
    ],
    coverLetter:
      "I am excited to apply for the UI/UX Designer position. With a strong background in user-centered design and extensive experience collaborating with cross-functional teams, I bring a passion for creating intuitive digital experiences.",
  },
  {
    id: "app-2",
    jobId: "job-1",
    name: "James Cooper",
    email: "james.cooper@email.com",
    phone: "+1 (555) 876-2211",
    location: "Los Angeles, CA",
    appliedAt: "2025-01-18T00:00:00Z",
    experience: "4 years experience",
    education: "BA Design, UCLA",
    rating: 4.6,
    status: "new",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/james-cooper.pdf",
    resumeFileName: "james-cooper-resume.pdf",
    skills: ["UI Design", "Design Systems", "Figma", "User Research"],
    coverLetter:
      "I am thrilled to submit my application for the UI/UX Designer role. I specialize in crafting scalable design systems and translating research insights into polished product experiences.",
  },
  {
    id: "app-3",
    jobId: "job-1",
    name: "Emily Carter",
    email: "emily.carter@email.com",
    phone: "+1 (555) 947-2211",
    location: "Seattle, WA",
    appliedAt: "2025-01-16T00:00:00Z",
    experience: "6 years experience",
    education: "MS Design, UW",
    rating: 4.9,
    status: "accepted",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/emily-carter.pdf",
    resumeFileName: "emily-carter-resume.pdf",
    skills: ["UX Research", "Prototyping", "Interaction Design", "Accessibility"],
    coverLetter:
      "Thank you for considering my application. I am passionate about creating inclusive experiences and have led multiple redesigns that improved usability and accessibility metrics.",
  },
  {
    id: "app-4",
    jobId: "job-1",
    name: "Olivia Davis",
    email: "olivia.davis@email.com",
    phone: "+1 (555) 412-8899",
    location: "Austin, TX",
    appliedAt: "2025-01-14T00:00:00Z",
    experience: "3 years experience",
    education: "BS Design, UT Austin",
    rating: 4.7,
    status: "rejected",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/olivia-davis.pdf",
    resumeFileName: "olivia-davis-resume.pdf",
    skills: ["UI Design", "Branding", "Illustration", "Figma"],
    coverLetter:
      "I appreciate your time reviewing my application. My background blends visual design and product strategy, and I enjoy transforming complex requirements into engaging interfaces.",
  },
  {
    id: "app-5",
    jobId: "job-1",
    name: "Noah Brooks",
    email: "noah.brooks@email.com",
    phone: "+1 (555) 111-4930",
    location: "New York, NY",
    appliedAt: "2025-01-12T00:00:00Z",
    experience: "5 years experience",
    education: "BS Design, NYU",
    rating: 4.8,
    status: "reviewing",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/noah-brooks.pdf",
    resumeFileName: "noah-brooks-resume.pdf",
    skills: ["UX Strategy", "User Testing", "Wireframing", "Prototyping"],
    coverLetter:
      "I am eager to join your team as a UI/UX Designer. My work focuses on aligning business goals with user needs through iterative testing and rapid prototyping.",
  },
];

export const setMockJobApplicants = (applicants: JobApplicant[]) => {
  mockJobApplicants = applicants;
};

const buildSummary = (items: JobApplicant[]) => {
  const summary = {
    total: items.length,
    newCount: 0,
    reviewCount: 0,
    rejectedCount: 0,
    acceptedCount: 0,
    interviewedCount: 0,
  };

  items.forEach((applicant) => {
    switch (applicant.status) {
      case "new":
        summary.newCount += 1;
        break;
      case "reviewing":
        summary.reviewCount += 1;
        break;
      case "rejected":
        summary.rejectedCount += 1;
        break;
      case "accepted":
        summary.acceptedCount += 1;
        break;
      case "interviewed":
        summary.interviewedCount += 1;
        break;
      default:
        break;
    }
  });

  return summary;
};

export const getJobApplicationsMock = async (
  jobId: string,
  params?: JobApplicationsQueryParams,
): Promise<ApiResponse<JobApplicationsPageData>> => {
  await wait(600);

  const allForJob = mockJobApplicants.filter(
    (applicant) => applicant.jobId === jobId,
  );

  let filtered = [...allForJob];

  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((applicant) => applicant.status === params.status);
  }

  if (params?.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(
      (applicant) =>
        applicant.name.toLowerCase().includes(query) ||
        applicant.email.toLowerCase().includes(query),
    );
  }

  if (params?.sort === "oldest") {
    filtered.sort(
      (a, b) =>
        new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime(),
    );
  } else {
    filtered.sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime(),
    );
  }

  const currentPage = params?.page ?? 1;
  const size = params?.pageSize ?? 10;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const start = (currentPage - 1) * size;
  const pagedApplicants = filtered.slice(start, start + size);

  const jobTitle =
    mockPostedJobs.find((job) => job.id === jobId)?.jobTitle ??
    "UI/UX Designer";

  return createResponse<JobApplicationsPageData>({
    jobId,
    jobTitle,
    summary: buildSummary(allForJob),
    applicants: pagedApplicants.map((applicant) => ({
      ...applicant,
      appliedAt: formatDateLabel(applicant.appliedAt),
    })),
    pagination: {
      totalCount,
      page: currentPage,
      pageSize: size,
      totalPages,
    },
  });
};

export const updateApplicationStatusMock = async (
  jobId: string,
  applicantId: string,
  status: JobApplicationStatus,
): Promise<ApiResponse<UpdateApplicationStatusResponse>> => {
  await wait(400);

  const applicant = mockJobApplicants.find(
    (item) => item.id === applicantId && item.jobId === jobId,
  );

  if (!applicant) {
    return createError("Applicant not found.");
  }

  applicant.status = status;

  return createResponse({
    id: applicantId,
    status,
    message: "Application status updated.",
  });
};
