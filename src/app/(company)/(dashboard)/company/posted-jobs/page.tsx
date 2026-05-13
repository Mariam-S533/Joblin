"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  BriefcaseBusiness,
  UsersRound,
  Plus,
  MoreVertical,
  Eye,
  CircleDollarSign,
  Filter,
  FileX2,
  AlertCircle,
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
  usePostedJobs,
  useDeletePostedJob,
  useToggleJobStatus,
} from "@/hooks/postedJobs";
import type { PostedJobStatus } from "@/features/posted-jobs/types";

// ─── Status filter tabs ─────────────────────────────────────────────

const STATUS_TABS: { label: string; value: PostedJobStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Closed", value: "closed" },
  { label: "Draft", value: "draft" },
  { label: "Expired", value: "expired" },
];

// ─── Helpers ────────────────────────────────────────────────────────

const statusBadgeVariant = (
  status: PostedJobStatus,
): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active":
      return "default";
    case "closed":
      return "secondary";
    case "draft":
      return "outline";
    case "expired":
      return "destructive";
    default:
      return "secondary";
  }
};

const statusBadgeClasses = (status: PostedJobStatus): string => {
  switch (status) {
    case "active":
      return "bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-emerald-200";
    case "closed":
      return "bg-neutral-100 text-neutral-600 hover:bg-neutral-100 border-neutral-200";
    case "draft":
      return "bg-amber-50 text-amber-700 hover:bg-amber-50 border-amber-200";
    case "expired":
      return "bg-red-50 text-red-700 hover:bg-red-50 border-red-200";
    default:
      return "";
  }
};

// ─── Stat Card ──────────────────────────────────────────────────────

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

// ─── Skeleton Loaders ───────────────────────────────────────────────

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[142px] rounded-xl border border-neutral-200 bg-white animate-pulse"
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
          className="h-[74px] rounded-lg border border-neutral-200 bg-white animate-pulse"
        />
      ))}
    </div>
  );
}

// ─── Mutation Error Banner ──────────────────────────────────────────

function MutationErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="text-red-500 hover:text-red-700 text-xs font-medium underline"
      >
        Dismiss
      </button>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────

export default function PostedJobsPage() {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [activeTab, setActiveTab] = useState<PostedJobStatus | "all">("all");
  const [activeDepartment, setActiveDepartment] =
    useState<string>("All Departments");

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/login/company");
    }
  }, [authStatus, router]);

  // Auth guard — prevent data fetching while auth is resolving
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
    <div className="space-y-6">
      <PostedJobsContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeDepartment={activeDepartment}
        setActiveDepartment={setActiveDepartment}
      />
    </div>
  );
}

// ─── Content (separated for query key stability) ────────────────────

type PostedJobsContentProps = {
  activeTab: PostedJobStatus | "all";
  setActiveTab: (tab: PostedJobStatus | "all") => void;
  activeDepartment: string;
  setActiveDepartment: (dept: string) => void;
};

function PostedJobsContent({
  activeTab,
  setActiveTab,
  activeDepartment,
  setActiveDepartment,
}: PostedJobsContentProps) {
  const router = useRouter();

  const queryOptions = useMemo(
    () => ({ status: activeTab, department: activeDepartment }),
    [activeTab, activeDepartment]
  );
  const { data, isLoading, isError } = usePostedJobs(queryOptions);

  const deleteJob = useDeletePostedJob();
  const toggleStatus = useToggleJobStatus();

  // Track mutation errors for UI feedback
  const [mutationError, setMutationError] = useState<string | null>(null);

  // Auto-clear mutation error after 5 seconds
  useEffect(() => {
    if (!mutationError) return;
    const timer = setTimeout(() => setMutationError(null), 5000);
    return () => clearTimeout(timer);
  }, [mutationError]);

  const stats = data?.stats;
  const jobs = data?.jobs ?? [];
  const departments = data?.departments ?? [];

  const handleDismissError = useCallback(() => setMutationError(null), []);

  const handleDeleteJob = useCallback(
    (jobId: string) => {
      setMutationError(null);
      deleteJob.mutate(jobId, {
        onError: (err) =>
          setMutationError(err.message || "Failed to delete job."),
      });
    },
    [deleteJob],
  );

  const handleToggleStatus = useCallback(
    (jobId: string, newStatus: PostedJobStatus) => {
      setMutationError(null);
      toggleStatus.mutate(
        { jobId, newStatus },
        {
          onError: (err) =>
            setMutationError(err.message || "Failed to update job status."),
        },
      );
    },
    [toggleStatus],
  );

  return (
    <>
      {/* ── Mutation Error Banner ──────────────────────────────────── */}
      {mutationError && (
        <MutationErrorBanner
          message={mutationError}
          onDismiss={handleDismissError}
        />
      )}

      {/* ── Stats Cards ──────────────────────────────────────────── */}
      {isLoading ? (
        <StatsSkeleton />
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
          Failed to load job statistics. Please try again.
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Briefcase className="h-5 w-5 text-neutral-600" />}
            label="Total Jobs"
            value={stats.totalJobs}
          />
          <StatCard
            icon={<BriefcaseBusiness className="h-5 w-5 text-emerald-600" />}
            label="Active Jobs"
            value={stats.activeJobs}
          />
          <StatCard
            icon={<FileX2 className="h-5 w-5 text-neutral-500" />}
            label="Closed Jobs"
            value={stats.closedJobs}
          />
          <StatCard
            icon={<UsersRound className="h-5 w-5 text-blue-600" />}
            label="Applications"
            value={stats.applications.toLocaleString()}
          />
        </div>
      ) : null}

      {/* ── Posted Jobs Section ──────────────────────────────────── */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
              <Briefcase className="h-5 w-5 text-neutral-600" />
            </div>
            <h2 className="text-xl font-semibold text-neutral-800">
              Posted Jobs
            </h2>
          </div>
          <Button
            onClick={() => router.push("/company/post-job")}
            className="h-10 gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <Plus className="h-4 w-4" />
            Post Job
          </Button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 px-6 pb-4">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "bg-emerald-600 text-white"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Department Filter */}
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

        {/* Table Header */}
        <div className="border-t border-neutral-200 px-6 py-3">
          <div className="grid grid-cols-[1fr_120px_140px_120px_140px] items-center gap-4">
            <span className="text-xs font-medium uppercase text-neutral-500">
              Job Title
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Status
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Applications
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500">
              Salary
            </span>
            <span className="text-xs font-medium uppercase text-neutral-500 text-right">
              Actions
            </span>
          </div>
        </div>

        {/* Table Body */}
        {isLoading ? (
          <div className="px-6 pb-6">
            <TableSkeleton />
          </div>
        ) : isError ? (
          <div className="px-6 py-10 text-center text-sm text-red-600">
            Failed to load jobs. Please try again.
          </div>
        ) : jobs.length === 0 ? (
          <div className="px-6 py-10 text-center">
            <Briefcase className="mx-auto h-10 w-10 text-neutral-300" />
            <p className="mt-3 text-sm text-neutral-500">
              No jobs found matching your filters.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setActiveTab("all");
                setActiveDepartment("All Departments");
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="grid grid-cols-[1fr_120px_140px_120px_140px] items-center gap-4 px-6 py-4 hover:bg-neutral-50/50 transition-colors"
              >
                {/* Job Title */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {job.jobTitle}
                  </p>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
                    <span>{job.employmentType}</span>
                    <span>•</span>
                    <span>
                      {job.daysRemaining > 0
                        ? `${job.daysRemaining} days remaining`
                        : "Expired"}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <Badge
                    variant={statusBadgeVariant(job.status)}
                    className={`text-xs capitalize ${statusBadgeClasses(job.status)}`}
                  >
                    {job.status}
                  </Badge>
                </div>

                {/* Applications */}
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <UsersRound className="h-4 w-4 text-neutral-400" />
                  <span>{job.applications} Applications</span>
                </div>

                {/* Salary */}
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <CircleDollarSign className="h-4 w-4 text-neutral-400" />
                  <span>
                    ${job.salaryMin} - ${job.salaryMax}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs gap-1.5"
                    onClick={() => {
                      router.push(`/company/posted-jobs/${job.id}/applications`);
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      {job.status === "active" && (
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(job.id, "closed")}
                        >
                          Close Job
                        </DropdownMenuItem>
                      )}
                      {job.status === "closed" && (
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(job.id, "active")}
                        >
                          Reopen Job
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        Delete Job
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
