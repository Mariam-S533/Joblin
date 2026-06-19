"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileX2,
  MoreVertical,
  Plus,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  usePostedCourses,
  useDeletePostedCourse,
  useToggleCourseStatus,
} from "@/hooks/postedCourses";
import type { PostedCourseStatus } from "@/features/posted-courses/types";
import {
  JOB_STATUS_OPTIONS,
  getPostedCourseStatusLabel,
  normalizePostedCourseStatus,
} from "@/features/posted-courses/types";

const statusBadgeVariant = (
  status: PostedCourseStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "Active":
      return "default";
    case "Closed":
      return "secondary";
    case "Cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

const statusBadgeClasses = (status: PostedCourseStatus): string => {
  switch (status) {
    case "Active":
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200";
    case "Closed":
      return "bg-neutral-100 text-neutral-600 hover:bg-neutral-100 border-neutral-200";
    case "Cancelled":
      return "bg-red-50 text-red-700 hover:bg-red-50 border-red-200";
    default:
      return "";
  }
};

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number | string;
};

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
          {icon}
        </div>
        <span className="text-sm font-medium text-neutral-600">{label}</span>
      </div>
      <p className="text-4xl font-semibold text-neutral-800">{value}</p>
    </div>
  );
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-35.5 rounded-xl border border-neutral-200 bg-white animate-pulse"
        />
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-19.5 rounded-lg border border-neutral-200 bg-white animate-pulse"
        />
      ))}
    </div>
  );
}

export default function PostedCoursesPage() {
  const router = useRouter();
  const { data: session, status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<PostedCourseStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const companyId = session?.id as string | undefined;

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login/generalLogin");
    }
  }, [authStatus, router]);

  useEffect(() => {
    setPage(1);
  }, [companyId]);

  if (authStatus === "loading") {
    return (
      <div className="space-y-6">
        <StatsSkeleton />
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
      companyId={companyId}
      page={page}
      setPage={setPage}
      pageSize={pageSize}
    />
  );
}

type PostedCoursesContentProps = {
  activeTab: PostedCourseStatus | "all";
  setActiveTab: (tab: PostedCourseStatus | "all") => void;
  companyId?: string;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
};

function PostedCoursesContent({
  activeTab,
  setActiveTab,
  companyId,
  page,
  setPage,
  pageSize,
}: PostedCoursesContentProps) {
  const router = useRouter();
  const { data, isLoading, isError } = usePostedCourses(companyId, { page, pageSize });

  const deleteMutation = useDeletePostedCourse();
  const toggleMutation = useToggleCourseStatus();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const isDeletingRef = useRef(false);

  const handleDeleteCourse = useCallback((courseId: string) => {
    setPendingDeleteId(courseId);
  }, []);

  const confirmDeleteCourse = useCallback(async () => {
    if (!pendingDeleteId || isDeletingRef.current) return;
    isDeletingRef.current = true;
    try {
      await deleteMutation.mutateAsync(pendingDeleteId);
      setPendingDeleteId(null);
    } finally {
      isDeletingRef.current = false;
    }
  }, [deleteMutation, pendingDeleteId]);

  const handleToggleStatus = useCallback(
    async (courseId: string, newStatus: PostedCourseStatus) => {
      await toggleMutation.mutateAsync({ courseId, newStatus });
    },
    [toggleMutation],
  );

  const courses = useMemo(() => data?.data ?? [], [data]);
  const totalCount = data?.totalCount ?? 0;
  const stats = useMemo(() => {
    const normalizedStatuses = courses.map((course) =>
      normalizePostedCourseStatus(course.offeringStatus),
    );
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const upcomingStartDates = courses.filter((course) => {
      if (!course.startDate) return false;
      const start = new Date(course.startDate);
      if (Number.isNaN(start.getTime())) return false;
      return start >= todayStart;
    }).length;

    return {
      totalCourses: totalCount,
      activeCourses: normalizedStatuses.filter((s) => s === "Active").length,
      closedCourses: normalizedStatuses.filter((s) => s === "Closed").length,
      upcomingStartDates,
    };
  }, [courses, totalCount]);

  const statusTabs = useMemo<
    { label: string; value: PostedCourseStatus | "all" }[]
  >(() => [
    { label: "All Courses", value: "all" },
    ...JOB_STATUS_OPTIONS.map((opt) => ({
      label: opt.label,
      value: opt.value as PostedCourseStatus,
    })),
  ], []);

  const filteredCourses =
    activeTab === "all"
      ? courses
      : courses.filter(
          (course) =>
            normalizePostedCourseStatus(course.offeringStatus) === activeTab,
        );

  return (
    <div className="space-y-6">
      {isLoading ? (
        <StatsSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          Failed to load course statistics. Please try again.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<BookOpen className="h-5 w-5 text-neutral-600" />}
            label="Total Courses"
            value={stats.totalCourses}
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            label="Active Courses"
            value={stats.activeCourses}
          />
          <StatCard
            icon={<FileX2 className="h-5 w-5 text-neutral-500" />}
            label="Closed Courses"
            value={stats.closedCourses}
          />
          <StatCard
            icon={<CalendarClock className="h-5 w-5 text-blue-600" />}
            label="Upcoming Start Dates"
            value={stats.upcomingStartDates}
          />
        </div>
      )}

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
          {statusTabs.map((tab) => (
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

        <div className="border-t border-neutral-200 px-6 py-3">
          <div className="grid grid-cols-[1.5fr_120px_160px_180px_140px_140px] items-center gap-4">
            <span className="text-xs font-medium uppercase text-neutral-500">
              Course Title
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Status
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Duration
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Location
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500 text-right">
              Price
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
        ) : filteredCourses.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-neutral-500">
            No courses found matching your filters.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="grid grid-cols-[1.5fr_120px_160px_180px_140px_140px] items-center gap-4 px-6 py-4 hover:bg-neutral-50/50 transition-colors"
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
                      {course.technicalDomain}
                    </Badge>
                    <span className="flex items-center gap-1 text-neutral-500">
                      <Clock className="h-3.5 w-3.5 text-neutral-400" />
                      {course.duration}
                    </span>
                    <span className="text-neutral-500">
                      {course.deliveryMode} · {course.difficultyLevel}
                    </span>
                  </div>
                </div>

                <div>
                  {(() => {
                    const normalizedStatus = normalizePostedCourseStatus(
                      course.offeringStatus,
                    );
                    return (
                      <Badge
                        variant={statusBadgeVariant(normalizedStatus)}
                        className={`text-xs capitalize ${statusBadgeClasses(
                          normalizedStatus,
                        )}`}
                      >
                        {getPostedCourseStatusLabel(normalizedStatus)}
                      </Badge>
                    );
                  })()}
                </div>

                <div className="text-sm text-neutral-600">
                  {course.duration}
                </div>

                <div className="text-sm text-neutral-600">
                  {course.city}, {course.country}
                </div>

                <div className="text-right text-sm text-neutral-800 font-medium">
                  {course.price}
                  {course.currency ? ` ${course.currency}` : ""}
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
                      {normalizePostedCourseStatus(course.offeringStatus) ===
                        "Active" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleStatus(course.id, "Closed")
                          }
                        >
                          Close Course
                        </DropdownMenuItem>
                      )}
                      {normalizePostedCourseStatus(course.offeringStatus) ===
                        "Closed" && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleToggleStatus(course.id, "Active")
                          }
                        >
                          Reopen Course
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

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-4">
            <span className="text-sm text-neutral-500">
              Page {data.page} of {data.totalPages} ({data.totalCount} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                disabled={!data.hasPreviousPage}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1"
                disabled={!data.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open && !isDeletingRef.current) setPendingDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The course will be removed from your
              posted courses list.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmDeleteCourse();
              }}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
