import type { ApiResponse } from "@/lib/apiClient/types";
import type {
  PostedCourse,
  PostedCoursesPageData,
  PostedCourseStatus,
  DeleteCourseResponse,
  ToggleCourseStatusResponse,
} from "@/features/posted-courses/types";
import { createResponse, createError, wait } from "./db";

export let mockPostedCourses: PostedCourse[] = [
  {
    id: "course-1",
    title: "Complete Web Development Bootcamp",
    category: "Web Development",
    durationHours: 40,
    status: "active",
    enrollments: 1254,
    rating: 4.8,
    price: 199,
    department: "Engineering",
    createdAt: "2025-03-12T00:00:00Z",
  },
  {
    id: "course-2",
    title: "UI/UX Design Fundamentals",
    category: "Design",
    durationHours: 25,
    status: "active",
    enrollments: 842,
    rating: 4.9,
    price: 149,
    department: "Design",
    createdAt: "2025-02-18T00:00:00Z",
  },
  {
    id: "course-3",
    title: "Advanced React & TypeScript",
    category: "Programming",
    durationHours: 35,
    status: "active",
    enrollments: 567,
    rating: 4.7,
    price: 179,
    department: "Engineering",
    createdAt: "2025-04-02T00:00:00Z",
  },
  {
    id: "course-4",
    title: "Python for Data Science",
    category: "Data Science",
    durationHours: 50,
    status: "draft",
    enrollments: 0,
    rating: null,
    price: 229,
    department: "Engineering",
    createdAt: "2025-04-22T00:00:00Z",
  },
  {
    id: "course-5",
    title: "Digital Marketing Mastery",
    category: "Marketing",
    durationHours: 30,
    status: "active",
    enrollments: 423,
    rating: 4.6,
    price: 129,
    department: "Marketing",
    createdAt: "2025-03-29T00:00:00Z",
  },
  {
    id: "course-6",
    title: "Mobile App Development",
    category: "Mobile Development",
    durationHours: 45,
    status: "archived",
    enrollments: 1856,
    rating: 4.5,
    price: 199,
    department: "Engineering",
    createdAt: "2025-01-10T00:00:00Z",
  },
];

export const setMockPostedCourses = (courses: PostedCourse[]) => {
  mockPostedCourses = courses;
};

export const getPostedCoursesMock = async (
  status?: string,
  department?: string,
  page?: number,
  pageSize?: number,
  search?: string,
): Promise<ApiResponse<PostedCoursesPageData>> => {
  await wait(600);

  let filtered = [...mockPostedCourses];

  if (status && status !== "all") {
    filtered = filtered.filter((course) => course.status === status);
  }

  if (department && department !== "All Departments") {
    filtered = filtered.filter((course) => course.department === department);
  }

  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (course) =>
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query),
    );
  }

  const departments: string[] = [
    ...new Set(mockPostedCourses.map((course) => course.department)),
  ].sort();

  const currentPage = page ?? 1;
  const size = pageSize ?? 10;
  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / size));
  const start = (currentPage - 1) * size;
  const pagedCourses = filtered.slice(start, start + size);

  return createResponse<PostedCoursesPageData>({
    courses: pagedCourses,
    departments,
    pagination: {
      totalCount,
      page: currentPage,
      pageSize: size,
      totalPages,
    },
  });
};

export const deletePostedCourseMock = async (
  courseId: string,
): Promise<ApiResponse<DeleteCourseResponse>> => {
  await wait(400);

  const course = mockPostedCourses.find((c) => c.id === courseId);
  if (!course) {
    return createError("Course not found.");
  }

  mockPostedCourses = mockPostedCourses.filter((c) => c.id !== courseId);

  return createResponse({
    id: courseId,
    message: "Course deleted successfully.",
  });
};

export const toggleCourseStatusMock = async (
  courseId: string,
  newStatus: PostedCourseStatus,
): Promise<ApiResponse<ToggleCourseStatusResponse>> => {
  await wait(400);

  const course = mockPostedCourses.find((c) => c.id === courseId);
  if (!course) {
    return createError("Course not found.");
  }

  course.status = newStatus;

  return createResponse({
    id: courseId,
    status: newStatus,
    message: `Course status updated to ${newStatus}.`,
  });
};
