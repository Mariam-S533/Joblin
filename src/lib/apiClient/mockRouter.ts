import type { ApiClientOptions, ApiResponse, HttpMethod } from "./types";
import {
  addTeamMemberMock,
  getCompanyProfileMock,
  removeTeamMemberMock,
  updateCompanyProfileMock,
  uploadCompanyLogoMock,
  uploadCompanyPhotosMock,
} from "@/mocks/companyProfile";
import {
  deactivateCompanyAccountMock,
  getCompanySettingsMock,
  updateCompanyPasswordMock,
  updateCompanySettingsMock,
  uploadCompanySettingsLogoMock,
} from "@/mocks/companySettings";
import { getJobPostTemplateMock, submitJobPostMock } from "@/mocks/jobPost";
import {
  getCoursePostTemplateMock,
  submitCoursePostMock,
} from "@/mocks/coursePost";
import { getCompanyHomeDataMock } from "@/mocks/companyHome";
import {
  getPostedJobsMock,
  deletePostedJobMock,
  toggleJobStatusMock,
} from "@/mocks/postedJobs";
import {
  getPostedCoursesMock,
  deletePostedCourseMock,
  toggleCourseStatusMock,
} from "@/mocks/postedCourses";
import {
  getJobApplicationsMock,
  updateApplicationStatusMock,
} from "@/mocks/jobApplications";
import {
  getCourseApplicationsMock,
  updateCourseApplicationStatusMock,
} from "@/mocks/courseApplications";
import type {
  CompanyProfile,
  TeamMember,
} from "@/features/company-profile/types";
import type {
  CompanyAccountSettings,
  CompanyPasswordPayload,
} from "@/features/company-settings/types";
import type { JobPostPayload } from "@/features/job-post/types";
import type { CoursePostPayload } from "@/features/course-post/types";
import type { PostedJobStatus } from "@/features/posted-jobs/types";
import type { PostedCourseStatus } from "@/features/posted-courses/types";
import type { JobApplicationStatus } from "@/features/job-applications/types";
import type { CourseApplicationStatus } from "@/features/course-applications/types";
import {
  registerCompanyMock,
  registerSeekerMock,
  googleRegisterCompanyMock,
  forgotPasswordMock,
  resetPasswordMock,
  verifyEmailMock,
} from "@/mocks/auth";
import type {
  RegisterCompanyPayload,
  RegisterSeekerPayload,
  GoogleRegisterCompanyPayload,
} from "@/features/auth/types";

const parseJsonBody = <T>(body: unknown): T => {
  if (typeof body === "string") {
    return JSON.parse(body) as T;
  }
  return body as T;
};

export const mockRouter = async <T>(
  path: string,
  options: ApiClientOptions = {},
): Promise<ApiResponse<T>> => {
  const method =
    ((options.method ?? "GET").toUpperCase() as HttpMethod) ?? "GET";
  const url = new URL(path, "http://localhost");
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // ─── Company Profile ────────────────────────────────────────────
  if (pathname === "/CompanyProfile" && method === "GET") {
    return (await getCompanyProfileMock()) as ApiResponse<T>;
  }

  if (pathname === "/CompanyProfile" && method === "PUT") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }
    return (await updateCompanyProfileMock(
      parseJsonBody<CompanyProfile>(options.body),
    )) as ApiResponse<T>;
  }

  if (pathname === "/CompanyProfile/logo" && method === "POST") {
    const formData = options.body as FormData;
    if (!formData || !(formData instanceof FormData)) {
      return {
        success: false,
        data: undefined as T,
        error: "Form data is required.",
      };
    }
    const file = formData?.get("file");
    return (await uploadCompanyLogoMock(
      file instanceof File ? file : null,
    )) as ApiResponse<T>;
  }

  if (pathname === "/CompanyProfile/photos" && method === "POST") {
    const formData = options.body as FormData;
    if (!formData || !(formData instanceof FormData)) {
      return {
        success: false,
        data: undefined as T,
        error: "Form data is required.",
      };
    }
    const files = formData?.getAll("files") ?? [];
    const fileList = files.filter((file): file is File => file instanceof File);
    return (await uploadCompanyPhotosMock(fileList)) as ApiResponse<T>;
  }

  if (pathname === "/CompanyProfile/team-members" && method === "POST") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }
    return (await addTeamMemberMock(
      parseJsonBody<TeamMember>(options.body),
    )) as ApiResponse<T>;
  }

  if (pathname === "/CompanyProfile/team-members" && method === "DELETE") {
    const memberId = searchParams.get("id");
    return (await removeTeamMemberMock(memberId)) as ApiResponse<T>;
  }

  // ─── Company Account Settings ───────────────────────────────────
  if (pathname === "/CompanySettings" && method === "GET") {
    return (await getCompanySettingsMock()) as ApiResponse<T>;
  }

  if (pathname === "/CompanySettings" && method === "PUT") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }
    return (await updateCompanySettingsMock(
      parseJsonBody<CompanyAccountSettings>(options.body),
    )) as ApiResponse<T>;
  }

  if (pathname === "/CompanySettings/logo" && method === "POST") {
    const formData = options.body as FormData;
    if (!formData || !(formData instanceof FormData)) {
      return {
        success: false,
        data: undefined as T,
        error: "Form data is required.",
      };
    }
    const file = formData?.get("file");
    return (await uploadCompanySettingsLogoMock(
      file instanceof File ? file : null,
    )) as ApiResponse<T>;
  }

  if (pathname === "/CompanySettings/password" && method === "POST") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }
    return (await updateCompanyPasswordMock(
      parseJsonBody<CompanyPasswordPayload>(options.body),
    )) as ApiResponse<T>;
  }

  if (pathname === "/CompanySettings" && method === "DELETE") {
    return (await deactivateCompanyAccountMock()) as ApiResponse<T>;
  }

  // ─── Job Post ───────────────────────────────────────────────────
  if (pathname === "/JobPost/template" && method === "GET") {
    return (await getJobPostTemplateMock()) as ApiResponse<T>;
  }

  if (pathname === "/JobPost" && method === "POST") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }

    return (await submitJobPostMock(
      parseJsonBody<JobPostPayload>(options.body),
    )) as ApiResponse<T>;
  }

  // ─── Course Post ────────────────────────────────────────────────
  if (pathname === "/CoursePost/template" && method === "GET") {
    return (await getCoursePostTemplateMock()) as ApiResponse<T>;
  }

  if (pathname === "/CoursePost" && method === "POST") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }

    return (await submitCoursePostMock(
      parseJsonBody<CoursePostPayload>(options.body),
    )) as ApiResponse<T>;
  }

  // ─── Company Home ───────────────────────────────────────────────
  if (pathname === "/CompanyHome" && method === "GET") {
    return (await getCompanyHomeDataMock()) as ApiResponse<T>;
  }

  // ─── Posted Jobs ────────────────────────────────────────────────
  if (pathname === "/PostedJobs" && method === "GET") {
    const status = searchParams.get("status") ?? undefined;
    const department = searchParams.get("department") ?? undefined;
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : undefined;
    const pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : undefined;
    return (await getPostedJobsMock(
      status,
      department,
      page,
      pageSize,
    )) as ApiResponse<T>;
  }

  if (
    pathname.startsWith("/PostedJobs/") &&
    pathname.endsWith("/applications") &&
    method === "GET"
  ) {
    const parts = pathname.split("/");
    const jobId = parts[2];
    if (!jobId) {
      return {
        success: false,
        data: undefined as T,
        error: "Job ID is required.",
      };
    }
    const status = searchParams.get("status") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : undefined;
    const pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : undefined;
    return (await getJobApplicationsMock(jobId, {
      status: status as JobApplicationStatus | "all" | undefined,
      sort: sort as "newest" | "oldest" | undefined,
      search,
      page,
      pageSize,
    })) as ApiResponse<T>;
  }

  if (
    pathname.startsWith("/PostedJobs/") &&
    pathname.includes("/applications/") &&
    pathname.endsWith("/status") &&
    method === "PUT"
  ) {
    const parts = pathname.split("/");
    const jobId = parts[2];
    const applicantId = parts[4];
    if (!jobId || !applicantId || !options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Job ID, applicant ID, and status body are required.",
      };
    }
    const body = parseJsonBody<{ status: JobApplicationStatus }>(options.body);
    return (await updateApplicationStatusMock(
      jobId,
      applicantId,
      body.status,
    )) as ApiResponse<T>;
  }

  if (
    pathname.startsWith("/PostedCourses/") &&
    pathname.endsWith("/applications") &&
    method === "GET"
  ) {
    const parts = pathname.split("/");
    const courseId = parts[2];
    if (!courseId) {
      return {
        success: false,
        data: undefined as T,
        error: "Course ID is required.",
      };
    }
    const status = searchParams.get("status") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const search = searchParams.get("search") ?? undefined;
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : undefined;
    const pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : undefined;
    return (await getCourseApplicationsMock(courseId, {
      status: status as CourseApplicationStatus | "all" | undefined,
      sort: sort as "newest" | "oldest" | undefined,
      search,
      page,
      pageSize,
    })) as ApiResponse<T>;
  }

  if (
    pathname.startsWith("/PostedCourses/") &&
    pathname.includes("/applications/") &&
    pathname.endsWith("/status") &&
    method === "PUT"
  ) {
    const parts = pathname.split("/");
    const courseId = parts[2];
    const applicantId = parts[4];
    if (!courseId || !applicantId || !options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Course ID, applicant ID, and status body are required.",
      };
    }
    const body = parseJsonBody<{ status: CourseApplicationStatus }>(
      options.body,
    );
    return (await updateCourseApplicationStatusMock(
      courseId,
      applicantId,
      body.status,
    )) as ApiResponse<T>;
  }

  if (pathname.startsWith("/PostedJobs/") && method === "DELETE") {
    const jobId = pathname.split("/").pop();
    if (!jobId) {
      return {
        success: false,
        data: undefined as T,
        error: "Job ID is required.",
      };
    }
    return (await deletePostedJobMock(jobId)) as ApiResponse<T>;
  }

  if (pathname.startsWith("/PostedJobs/status/") && method === "PUT") {
    const jobId = pathname.split("/").pop();
    if (!jobId || !options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Job ID and status body are required.",
      };
    }
    const body = parseJsonBody<{ status: PostedJobStatus }>(options.body);
    return (await toggleJobStatusMock(jobId, body.status)) as ApiResponse<T>;
  }

  // ─── Posted Courses ──────────────────────────────────────────────
  if (pathname === "/PostedCourses" && method === "GET") {
    const status = searchParams.get("status") ?? undefined;
    const department = searchParams.get("department") ?? undefined;
    const page = searchParams.get("page")
      ? Number(searchParams.get("page"))
      : undefined;
    const pageSize = searchParams.get("pageSize")
      ? Number(searchParams.get("pageSize"))
      : undefined;
    const search = searchParams.get("search") ?? undefined;
    return (await getPostedCoursesMock(
      status,
      department,
      page,
      pageSize,
      search,
    )) as ApiResponse<T>;
  }

  if (pathname.startsWith("/PostedCourses/") && method === "DELETE") {
    const courseId = pathname.split("/").pop();
    if (!courseId) {
      return {
        success: false,
        data: undefined as T,
        error: "Course ID is required.",
      };
    }
    return (await deletePostedCourseMock(courseId)) as ApiResponse<T>;
  }

  if (pathname.startsWith("/PostedCourses/status/") && method === "PUT") {
    const courseId = pathname.split("/").pop();
    if (!courseId || !options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Course ID and status body are required.",
      };
    }
    const body = parseJsonBody<{ status: PostedCourseStatus }>(options.body);
    return (await toggleCourseStatusMock(courseId, body.status)) as ApiResponse<T>;
  }

  // ─── Authentication ──────────────────────────────────────────────
  if (pathname === "/Authentication/register-company" && method === "POST") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }
    return (await registerCompanyMock(
      parseJsonBody<RegisterCompanyPayload>(options.body),
    )) as ApiResponse<T>;
  }

  if (pathname === "/Authentication/register-seeker" && method === "POST") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }
    return (await registerSeekerMock(
      parseJsonBody<RegisterSeekerPayload>(options.body),
    )) as ApiResponse<T>;
  }

  if (pathname === "/Authentication/google-register-company" && method === "POST") {
    if (!options.body) {
      return {
        success: false,
        data: undefined as T,
        error: "Request body is required.",
      };
    }
    return (await googleRegisterCompanyMock(
      parseJsonBody<GoogleRegisterCompanyPayload>(options.body),
    )) as ApiResponse<T>;
  }

  if (pathname === "/Authentication/forgot-password" && method === "POST") {
    return (await forgotPasswordMock()) as ApiResponse<T>;
  }

  if (pathname === "/Authentication/reset-password" && method === "POST") {
    return (await resetPasswordMock()) as ApiResponse<T>;
  }

  if (pathname === "/Authentication/verify-email" && method === "POST") {
    return (await verifyEmailMock()) as ApiResponse<T>;
  }

  return {
    success: false,
    data: undefined as T,
    error: "Unknown mock endpoint.",
  };
};
