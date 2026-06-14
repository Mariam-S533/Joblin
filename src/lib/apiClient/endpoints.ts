/**
 * Centralized API endpoint paths.
 *
 * Single source of truth for all backend route paths.
 * Services import from this file instead of defining local endpoint objects.
 *
 * Paths are relative to the API base URL (configured in config.ts).
 * The proxy route (src/app/api/proxy/[...path]/route.ts) forwards these
 * to the .NET backend.
 */

export const auth = {
  login: "/Authentication/login",
  registerCompany: "/Authentication/register-company",
  registerSeeker: "/Authentication/register-seeker",
  googleRegisterCompany: "/Authentication/google-register-company",
  googleLogin: "/Authentication/google-login",
  forgotPassword: "/Authentication/forgot-password",
  resetPassword: "/Authentication/reset-password",
  verifyEmail: "/Authentication/verify-email",
};

export const companyHome = {
  home: "/CompanyHome",
};

export const companyProfile = {
  company: "/Company",
};

export const companySettings = {
  settings: "/CompanySettings",
  logo: "/CompanySettings/logo",
  password: "/CompanySettings/password",
};

export const courseApplications = {
  list: (courseId: string) => `/PostedCourses/${courseId}/applications`,
  updateStatus: (courseId: string, applicantId: string) =>
    `/PostedCourses/${courseId}/applications/${applicantId}/status`,
};

export const OFFERING_ENROLLMENTS_BY_OFFERING = (offeringId: string) =>
  `/offering-enrollments/offering/${offeringId}/applicants`;

export const OFFERING_ENROLLMENT_DETAILS = (enrollmentId: string) =>
  `/offering-enrollments/${enrollmentId}/details`;

export const OFFERING_ENROLLMENT_STATUS = (enrollmentId: string) =>
  `/offering-enrollments/${enrollmentId}/status`;

export const coursePost = {
  submit: "/offering-posts",
};

export const jobApplications = {
  list: (jobId: string) => `/PostedJobs/${jobId}/applications`,
  updateStatus: (jobId: string, applicantId: string) =>
    `/PostedJobs/${jobId}/applications/${applicantId}/status`,
};

export const APPLICATIONS_BY_JOB_POST = (jobPostId: string) =>
  `/applications/${jobPostId}/all`;

export const UPDATE_APPLICATION_STATUS = (applicationId: string) =>
  `/applications/${applicationId}/status`;

export const jobPost = {
  submit: "/job-posts",
};

export const postedCourses = {
  listByCompany: (companyId: string) => `/offering-posts/company/${companyId}`,
  getById: (courseId: string) => `/offering-posts/${courseId}`,
  delete: (courseId: string) => `/offering-posts/${courseId}`,
  toggleStatus: (courseId: string) => `/offering-posts/${courseId}/status`,
};

export const postedJobs = {
  listByCompany: "/job-posts/company",
  getById: (id: string) => `/job-posts/${id}`,
  delete: "/job-posts",
  status: "/job-posts",
};

export const seekerProfile = {
  skills: (profileId: string) => `/Profile/${profileId}/skills`,
  workExperiences: (profileId: string) => `/Profile/${profileId}/work-experiences`,
};

export const skills = {
  list: "/Skills",
};
