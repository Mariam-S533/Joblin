import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  CourseApplicant,
  CourseApplicationsPageData,
  CourseApplicationsQueryParams,
  CourseApplicationStatus,
  UpdateCourseApplicationStatusResponse,
} from "@/features/course-applications/types";
import { mockPostedCourses } from "@/mocks/postedCourses";
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

export let mockCourseApplicants: CourseApplicant[] = [
  {
    id: "course-app-1",
    courseId: "course-1",
    name: "Hannah Reed",
    email: "hannah.reed@email.com",
    phone: "+1 (555) 901-3476",
    location: "Seattle, WA",
    enrolledAt: "2025-02-14T00:00:00Z",
    experience: "2 years design experience",
    education: "BA Digital Media, UW",
    rating: 4.7,
    status: "new",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/hannah-reed.pdf",
    resumeFileName: "hannah-reed-resume.pdf",
    skills: ["UI Design", "Figma", "Wireframing", "User Testing"],
    coverLetter:
      "I am excited to enroll in this course to strengthen my design fundamentals and build a stronger portfolio through hands-on projects.",
  },
  {
    id: "course-app-2",
    courseId: "course-1",
    name: "Daniel Ortiz",
    email: "daniel.ortiz@email.com",
    phone: "+1 (555) 662-9832",
    location: "Austin, TX",
    enrolledAt: "2025-02-11T00:00:00Z",
    experience: "3 years frontend experience",
    education: "BS Computer Science, UT Austin",
    rating: 4.5,
    status: "reviewing",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/daniel-ortiz.pdf",
    resumeFileName: "daniel-ortiz-resume.pdf",
    skills: ["React", "TypeScript", "Design Systems", "Accessibility"],
    coverLetter:
      "I want to deepen my UX knowledge to complement my frontend development skills and build more user-centered products.",
  },
  {
    id: "course-app-3",
    courseId: "course-2",
    name: "Layla Morgan",
    email: "layla.morgan@email.com",
    phone: "+1 (555) 332-1189",
    location: "New York, NY",
    enrolledAt: "2025-02-05T00:00:00Z",
    experience: "4 years UX research",
    education: "MS HCI, NYU",
    rating: 4.9,
    status: "accepted",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/layla-morgan.pdf",
    resumeFileName: "layla-morgan-resume.pdf",
    skills: ["UX Research", "Prototyping", "User Testing", "Journey Mapping"],
    coverLetter:
      "I am looking forward to expanding my toolkit with advanced UI/UX methodologies and collaborative studio work.",
  },
  {
    id: "course-app-4",
    courseId: "course-3",
    name: "Marcus Lee",
    email: "marcus.lee@email.com",
    phone: "+1 (555) 443-2277",
    location: "Chicago, IL",
    enrolledAt: "2025-01-28T00:00:00Z",
    experience: "5 years product design",
    education: "BS Design, SAIC",
    rating: 4.6,
    status: "rejected",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/marcus-lee.pdf",
    resumeFileName: "marcus-lee-resume.pdf",
    skills: ["Product Design", "UX Strategy", "Figma", "Design Leadership"],
    coverLetter:
      "I am interested in refining my advanced design strategy skills and contributing to peer critiques throughout the course.",
  },
  {
    id: "course-app-5",
    courseId: "course-2",
    name: "Priya Singh",
    email: "priya.singh@email.com",
    phone: "+1 (555) 718-4093",
    location: "San Francisco, CA",
    enrolledAt: "2025-02-01T00:00:00Z",
    experience: "1 year UX design",
    education: "Certificate in UX, General Assembly",
    rating: 4.8,
    status: "new",
    avatarUrl: null,
    resumeUrl: "https://example.com/resume/priya-singh.pdf",
    resumeFileName: "priya-singh-resume.pdf",
    skills: ["UI Design", "Prototyping", "User Interviews", "Figma"],
    coverLetter:
      "I want to build confidence in my UX practice and learn from industry mentors to accelerate my career growth.",
  },
];

export const setMockCourseApplicants = (applicants: CourseApplicant[]) => {
  mockCourseApplicants = applicants;
};

const buildSummary = (items: CourseApplicant[]) => {
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

export const getCourseApplicationsMock = async (
  courseId: string,
  params?: CourseApplicationsQueryParams,
): Promise<ApiResponse<CourseApplicationsPageData>> => {
  await wait(600);

  const allForCourse = mockCourseApplicants.filter(
    (applicant) => applicant.courseId === courseId,
  );

  let filtered = [...allForCourse];

  if (params?.status && params.status !== "all") {
    filtered = filtered.filter(
      (applicant) => applicant.status === params.status,
    );
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
        new Date(a.enrolledAt).getTime() - new Date(b.enrolledAt).getTime(),
    );
  } else {
    filtered.sort(
      (a, b) =>
        new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime(),
    );
  }

  const currentPage = params?.page ?? 1;
  const size = params?.pageSize ?? 10;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const start = (currentPage - 1) * size;
  const pagedApplicants = filtered.slice(start, start + size);

  const courseTitle =
    mockPostedCourses.find((course) => course.id === courseId)?.title ??
    "Course";

  return createResponse<CourseApplicationsPageData>({
    courseId,
    courseTitle,
    summary: buildSummary(allForCourse),
    applicants: pagedApplicants.map((applicant) => ({
      ...applicant,
      enrolledAt: formatDateLabel(applicant.enrolledAt),
    })),
    pagination: {
      totalCount,
      page: currentPage,
      pageSize: size,
      totalPages,
    },
  });
};

export const updateCourseApplicationStatusMock = async (
  courseId: string,
  applicantId: string,
  status: CourseApplicationStatus,
): Promise<ApiResponse<UpdateCourseApplicationStatusResponse>> => {
  await wait(400);

  const applicant = mockCourseApplicants.find(
    (item) => item.id === applicantId && item.courseId === courseId,
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
