"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  Clock,
  Filter,
  MoreVertical,
  Plus,
  Star,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  usePostedCourses,
  useDeletePostedCourse,
  useToggleCourseStatus,
} from "@/hooks/postedCourses";
import type { PostedCourseStatus } from "@/features/posted-courses/types";

const STATUS_TABS: { label: string; value: PostedCourseStatus | "all" }[] = [
  { label: "All Courses", value: "all" },
  { label: "Active", value: "active" },
  { label: "Closed", value: "closed" },
  { label: "Draft", value: "draft" },
];

const statusBadgeVariant = (
  status: PostedCourseStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active":
      return "default";
    case "closed":
      return "secondary";
    case "draft":
      return "outline";
    case "archived":
      return "destructive";
    default:
      return "secondary";
  }
};

const statusBadgeClasses = (status: PostedCourseStatus): string => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200";
    case "closed":
      return "bg-neutral-100 text-neutral-600 hover:bg-neutral-100 border-neutral-200";
    case "draft":
      return "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200";
    case "archived":
      return "bg-red-50 text-red-700 hover:bg-red-50 border-red-200";
    default:
      return "";
  }
};

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-[78px] rounded-lg border border-neutral-200 bg-white animate-pulse"
        />
      ))}
    </div>
  );
}

export default function PostedCoursesPage() {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<PostedCourseStatus | "all">("all");
  const [activeDepartment, setActiveDepartment] =
    useState<string>("All Departments");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login/company");
    }
  }, [authStatus, router]);

  if (authStatus === "loading") {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return null;
  }

  return (
    <PostedCoursesContent
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      activeDepartment={activeDepartment}
      setActiveDepartment={setActiveDepartment}
    />
  );
}

type PostedCoursesContentProps = {
  activeTab: PostedCourseStatus | "all";
  setActiveTab: (tab: PostedCourseStatus | "all") => void;
  activeDepartment: string;
  setActiveDepartment: (dept: string) => void;
};

function PostedCoursesContent({
  activeTab,
  setActiveTab,
  activeDepartment,
  setActiveDepartment,
}: PostedCoursesContentProps) {
  const router = useRouter();

  const queryOptions = useMemo(
    () => ({ status: activeTab, department: activeDepartment }),
    [activeTab, activeDepartment]
  );
  const { data, isLoading, isError } = usePostedCourses(queryOptions);

  const deleteMutation = useDeletePostedCourse();
  const toggleMutation = useToggleCourseStatus();

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteMutation.mutateAsync(courseId);
    }
  };

  const handleToggleStatus = async (
    courseId: string,
    newStatus: PostedCourseStatus,
  ) => {
    await toggleMutation.mutateAsync({ courseId, newStatus });
  };

  const courses = data?.courses ?? [];
  const departments = data?.departments ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <BookOpen className="h-5 w-5 text-neutral-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800">
              Posted Courses
            </h2>
          </div>
          <Button
            onClick={() => router.push("/company/post-course")}
            className="h-10 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Post New Course
          </Button>
        </div>

        <div className="flex items-center gap-2 px-6 pb-4">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="px-6 pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-neutral-400" />
            <span className="text-sm text-neutral-500">
              Filter by Department
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDepartment(dept)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors border ${
                  activeDepartment === dept
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-200 px-6 py-3">
          <div className="grid grid-cols-[1.5fr_120px_160px_180px_140px] items-center gap-4">
            <span className="text-xs font-medium uppercase text-neutral-500">
              Course Title
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Status
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Enrollments
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Rating and Prices
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500 text-right">
              Actions
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 pb-6">
            <TableSkeleton />
          </div>
        ) : isError ? (
          <div className="px-6 py-10 text-center text-sm text-red-600">
            Failed to load courses. Please try again.
          </div>
        ) : courses.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-neutral-500">
            No courses found matching your filters.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {courses.map((course) => (
              <div
                key={course.id}
                className="grid grid-cols-[1.5fr_120px_160px_180px_140px] items-center gap-4 px-6 py-4 hover:bg-neutral-50/50 transition-colors"
              >
                <div className="min-w-0 space-y-2">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {course.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                    <Badge
                      variant="outline"
                      className="rounded-md border-emerald-300 bg-emerald-50 px-2 py-0.5 text-emerald-700"
                    >
                      {course.category}
                    </Badge>
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      {course.durationHours} hours
                    </span>
                  </div>
                </div>

                <div>
                  <Badge
                    variant={statusBadgeVariant(course.status)}
                    className={`text-xs capitalize ${statusBadgeClasses(
                      course.status,
                    )}`}
                  >
                    {course.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <UsersRound className="h-4 w-4 text-neutral-400" />
                  <span>{course.enrollments} Students</span>
                </div>

                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  {course.rating !== null ? (
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500" />
                      {course.rating.toFixed(1)}
                    </span>
                  ) : (
                    <span className="text-neutral-500">No ratings yet</span>
                  )}
                  <span className="text-neutral-800 font-medium">
                    ${course.price}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() =>
                      router.push(
                        `/company/posted-courses/${course.id}/applications`,
                      )
                    }
                  >
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="More actions"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {course.status === "active" && (
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(course.id, "closed")}
                        >
                          Close Course
                        </DropdownMenuItem>
                      )}
                      {course.status === "closed" && (
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(course.id, "active")}
                        >
                          Reopen Course
                        </DropdownMenuItem>
                      )}
                      {course.status === "draft" && (
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(course.id, "active")}
                        >
                          Publish Course
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        Delete Course
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
