// ─── Shared Utility Types ────────────────────────────────────────────
//
// Types that are used across multiple feature domains.
// Previously these lived in posted-jobs/types.ts, which created
// a cross-feature dependency. Moving them here establishes a
// proper dependency graph: features → shared (no circular deps).

/**
 * Pagination metadata — shared across list endpoints.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact pagination shape is unknown.
 * Used by: posted-jobs, posted-courses, job-applications, course-applications.
 */
export type PaginationMeta = {
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type PagedResultResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * Department names — shared across features that filter by department.
 *
 * REQUIRES BACKEND CONFIRMATION: the real department values from the
 * backend are unknown. "All Departments" is a UI-only filter label.
 * Used by: posted-jobs, posted-courses.
 */
export type Department =
  | "Design"
  | "Engineering"
  | "Product"
  | "Marketing"
  | "Sales";
