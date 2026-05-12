import type { Department, PaginationMeta } from "@/features/posted-jobs/types";

export type PostedCourseStatus = "active" | "closed" | "draft" | "archived";

export type PostedCourse = {
  id: string;
  title: string;
  category: string;
  durationHours: number;
  status: PostedCourseStatus;
  enrollments: number;
  rating: number | null;
  price: number;
  department: Department;
  /** ISO 8601 date string from API */
  createdAt: string;
};

export type PostedCoursesPageData = {
  courses: PostedCourse[];
  /** "All Departments" (UI label) + real departments from API */
  departments: string[];
  pagination: PaginationMeta;
};

export type PostedCoursesQueryParams = {
  status?: PostedCourseStatus | "all";
  department?: string;
  search?: string;
  page?: number;
  pageSize?: number;
};

export type DeleteCourseResponse = {
  id: string;
  message: string;
};

export type ToggleCourseStatusResponse = {
  id: string;
  status: PostedCourseStatus;
  message: string;
};
