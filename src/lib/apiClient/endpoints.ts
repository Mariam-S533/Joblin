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

export const coursePost = {
  template: "/CoursePost/template",
  submit: "/CoursePost",
};

export const jobApplications = {
  list: (jobId: string) => `/PostedJobs/${jobId}/applications`,
  updateStatus: (jobId: string, applicantId: string) =>
    `/PostedJobs/${jobId}/applications/${applicantId}/status`,
};

export const jobPost = {
  submit: "/job-posts",
};

export const postedCourses = {
  list: "/PostedCourses",
  delete: "/PostedCourses",
  toggleStatus: "/PostedCourses/status",
};

export const postedJobs = {
  listByCompany: "/job-posts/company",
  delete: "/job-posts",
  status: "/job-posts",
};

export const skills = {
  list: "/Skills",
};