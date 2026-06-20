"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  Calendar,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  X,
  ChevronDown,
  Search,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { getErrorMessage } from "@/lib/apiClient/error";
import { toast } from "sonner";
import {
  useOfferingEnrollments,
  useOfferingEnrollmentDetails,
  useUpdateEnrollmentStatus,
} from "@/hooks/courseApplications";
import { usePostedCourseById } from "@/hooks/postedCourses";
import type {
  OfferingEnrollment,
  CourseApplicationStatus,
} from "@/features/course-applications/types";
import {
  APPLICATION_STATUS_OPTIONS,
  normalizeCourseApplicationStatus,
} from "@/features/course-applications/types";

const STATUS_TABS: { label: string; value: CourseApplicationStatus | "all" }[] =
  [
    { label: "All", value: "all" },
    ...APPLICATION_STATUS_OPTIONS.map((opt) => ({
      label: opt.label,
      value: opt.value as CourseApplicationStatus,
    })),
  ];

const statusLabelMap: Record<CourseApplicationStatus, string> = {
  Pending: "New",
  UnderReview: "Under Review",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Withdrawn: "Withdrawn",
};

const statusBadgeClasses = (status: CourseApplicationStatus): string => {
  switch (status) {
    case "Pending":
      return "bg-status-pending-bg text-status-pending border-status-pending";
    case "UnderReview":
      return "bg-status-review-bg text-status-review border-status-review";
    case "Accepted":
      return "bg-status-accepted-bg text-status-accepted border-status-accepted";
    case "Rejected":
      return "bg-status-rejected-bg text-status-rejected border-status-rejected-border";
    case "Withdrawn":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "";
  }
};

function hasValue(v: string | number | null | undefined): boolean {
  if (v == null) return false;
  const str = String(v).trim();
  return str !== "" && str !== "0" && str !== "null" && str !== "string";
}

function SummaryCard({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border-[0.8px] border-solid px-5 py-3 flex flex-col gap-1 ${className ?? ""}`}
    >
      <span className="text-[12px] font-medium text-muted-foreground">{label}</span>
      <span className="text-[20px] font-semibold">{value}</span>
    </div>
  );
}

function EnrollmentSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-50 rounded-2xl border-[0.8px] border-border-light bg-card animate-pulse"
        />
      ))}
    </div>
  );
}

function computeSummary(enrollments: OfferingEnrollment[]) {
  let pending = 0, underReview = 0, accepted = 0, rejected = 0, withdrawn = 0;
  for (const e of enrollments) {
    switch (e.status) {
      case "Pending": pending++; break;
      case "UnderReview": underReview++; break;
      case "Accepted": accepted++; break;
      case "Rejected": rejected++; break;
      case "Withdrawn": withdrawn++; break;
    }
  }
  return {
    total: enrollments.length,
    pendingCount: pending,
    underReviewCount: underReview,
    acceptedCount: accepted,
    rejectedCount: rejected,
    withdrawnCount: withdrawn,
  };
}

export default function CourseApplicationsPage() {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const params = useParams();
  const courseId = useMemo(() => {
    const raw = params?.courseId;
    return typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : "";
  }, [params]);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.replace("/login/generalLogin");
    }
  }, [authStatus, router]);

  if (authStatus === "loading") {
    return (
      <div className="space-y-6">
        <EnrollmentSkeleton />
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="rounded-2xl border-[0.8px] border-border-light bg-card p-6 text-[14px] text-content-secondary">
        Course enrollments could not be found.
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    );
  }

  return <CourseEnrollmentsContent offeringId={courseId} />;
}

function CourseEnrollmentsContent({ offeringId }: { offeringId: string }) {
  const [activeTab, setActiveTab] = useState<CourseApplicationStatus | "all">("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: enrollments, isLoading, isError, error } = useOfferingEnrollments(offeringId);
  const { data: courseInfo } = usePostedCourseById(offeringId);
  const updateStatus = useUpdateEnrollmentStatus();
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    enrollmentId: string;
    newStatus: CourseApplicationStatus;
    enrollmentName: string;
  } | null>(null);

  useEffect(() => {
    if (!mutationError) return;
    const timer = setTimeout(() => setMutationError(null), 5000);
    return () => clearTimeout(timer);
  }, [mutationError]);

  const normalizedEnrollments = useMemo(() =>
    (enrollments ?? []).map((e) => ({
      ...e,
      status: normalizeCourseApplicationStatus(e.status),
    })),
    [enrollments],
  );

  const summary = useMemo(() => computeSummary(normalizedEnrollments), [normalizedEnrollments]);

  const filteredEnrollments = useMemo(() => {
    let filtered = normalizedEnrollments;
    if (activeTab !== "all") {
      filtered = filtered.filter((e) => e.status === activeTab);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.seekerName.toLowerCase().includes(q) ||
          e.seekerEmail.toLowerCase().includes(q),
      );
    }
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return filtered;
  }, [normalizedEnrollments, activeTab, searchQuery, sortOrder]);

  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string | null>(null);
  const currentEnrollment = useMemo(() => {
    if (!selectedEnrollmentId) return null;
    return normalizedEnrollments.find((e) => e.enrollmentId === selectedEnrollmentId) ?? null;
  }, [normalizedEnrollments, selectedEnrollmentId]);

  const setSelectedEnrollment = useCallback(
    (enrollment: OfferingEnrollment) => setSelectedEnrollmentId(enrollment.enrollmentId),
    [],
  );

  const handleStatusChange = useCallback(
    (enrollmentId: string, newStatus: CourseApplicationStatus) => {
      const enrollment = normalizedEnrollments.find((e) => e.enrollmentId === enrollmentId);
      setPendingStatusChange({
        enrollmentId,
        newStatus,
        enrollmentName: enrollment?.seekerName ?? "this applicant",
      });
    },
    [normalizedEnrollments],
  );

  const confirmStatusChange = useCallback(() => {
    if (!pendingStatusChange) return;
    setMutationError(null);
    const { enrollmentId, newStatus } = pendingStatusChange;
    updateStatus.mutate(
      { enrollmentId, offeringId, payload: { status: newStatus } },
      {
        onSuccess: () => {
          toast.success(`Status updated to "${statusLabelMap[newStatus]}" successfully.`);
          setPendingStatusChange(null);
        },
        onError: (err) => {
          setMutationError(getErrorMessage(err, "Failed to update enrollment status."));
          setPendingStatusChange(null);
        },
      },
    );
  }, [pendingStatusChange, updateStatus, offeringId]);

  return (
    <div className="space-y-6">
      {(isError || mutationError) && (
        <div className="rounded-2xl border-[0.8px] border-status-rejected-border bg-status-rejected-bg px-5 py-3 text-[13px] text-status-rejected">
          {mutationError ||
            getErrorMessage(error, "Failed to load enrollments.")}
        </div>
      )}

      <div className="rounded-3xl border-[0.8px] border-border-light bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-[20px] font-semibold text-foreground">
              Course Enrollments for &ldquo;{courseInfo?.title ?? "..."}&rdquo;
            </h2>
            <p className="text-[12px] text-muted-foreground">
              Manage and review all enrollments for this course
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl border-[0.8px] border-border bg-card text-[13px] w-60 pl-9"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            label="Total"
            value={summary.total}
            className="border-border bg-card text-foreground"
          />
          <SummaryCard
            label="Pending"
            value={summary.pendingCount}
            className="border-status-pending bg-status-pending-bg text-status-pending"
          />
          <SummaryCard
            label="Under Review"
            value={summary.underReviewCount}
            className="border-status-review bg-status-review-bg text-status-review"
          />
          <SummaryCard
            label="Rejected"
            value={summary.rejectedCount}
            className="border-status-rejected-border bg-status-rejected-bg text-status-rejected"
          />
          <SummaryCard
            label="Accepted"
            value={summary.acceptedCount}
            className="border-status-accepted bg-status-accepted-bg text-status-accepted"
          />
        </div>
      </div>

      <div className="rounded-3xl border-[0.8px] border-border-light bg-card p-5 space-y-5">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-xl px-4 py-2 text-[14px] font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-brand-primary text-white"
                    : "border-[0.8px] border-border text-content-secondary hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="gap-2 text-content-secondary border-border"
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
          >
            {sortOrder === "newest" ? "Newest" : "Oldest"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {currentEnrollment && typeof document !== "undefined"
          ? createPortal(
              <div
                className="fixed inset-0 z-50 bg-black/40 overflow-y-auto"
                onClick={() => {
                  setSelectedEnrollmentId(null);
                }}
              >
                <div className="flex min-h-full items-center justify-center p-4">
                  <div
                    className="w-full max-w-4xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <EnrollmentDetailsPanel
                      enrollment={currentEnrollment}
                      offeringId={offeringId}
                      onClose={() => {
                        setSelectedEnrollmentId(null);
                      }}
                      onStatusChange={handleStatusChange}
                      isUpdating={updateStatus.isPending}
                    />
                  </div>
                </div>
              </div>,
              document.body,
            )
          : null}

        {isLoading ? (
          <EnrollmentSkeleton />
        ) : filteredEnrollments.length === 0 ? (
          <div className="text-center text-[13px] text-muted-foreground py-12">
            No enrollments found for this filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredEnrollments.map((enrollment) => (
              <EnrollmentCard
                key={enrollment.enrollmentId}
                enrollment={enrollment}
                offeringId={offeringId}
                onViewDetails={setSelectedEnrollment}
                onStatusChange={handleStatusChange}
                isUpdating={updateStatus.isPending}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog
        open={pendingStatusChange !== null}
        onOpenChange={(open) => {
          if (!open && !updateStatus.isPending) setPendingStatusChange(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Change status to &ldquo;{statusLabelMap[pendingStatusChange?.newStatus ?? "Pending"]}&rdquo;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              You are about to change the enrollment status of {pendingStatusChange?.enrollmentName ?? "this applicant"} to &ldquo;{statusLabelMap[pendingStatusChange?.newStatus ?? "Pending"]}&rdquo;. This action will be visible to the applicant.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updateStatus.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                confirmStatusChange();
              }}
              disabled={updateStatus.isPending}
              className={
                pendingStatusChange?.newStatus === "Accepted"
                  ? "bg-status-accepted hover:bg-green-700 text-white"
                  : pendingStatusChange?.newStatus === "Rejected"
                    ? "bg-status-rejected hover:bg-red-700 text-white"
                    : "bg-brand-primary hover:bg-brand-primary-hover text-white"
              }
            >
              {updateStatus.isPending ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

const EnrollmentCard = memo(function EnrollmentCard({
  enrollment,
  offeringId,
  onViewDetails,
  onStatusChange,
  isUpdating,
}: {
  enrollment: OfferingEnrollment;
  offeringId: string;
  onViewDetails: (enrollment: OfferingEnrollment) => void;
  onStatusChange: (enrollmentId: string, newStatus: CourseApplicationStatus) => void;
  isUpdating: boolean;
}) {
  const displayName = enrollment.seekerName || "Unknown Applicant";
  const status = enrollment.status;
  const statusLabel = statusLabelMap[status];

  const canStartReview = status === "Pending";
  const canAcceptOrReject = status === "Pending" || status === "UnderReview";

  return (
    <div className="rounded-xl border-[0.8px] border-border-light bg-card p-5">
      <div className="flex items-start gap-4">
        <div className="border-[0.8px] border-border rounded-xl overflow-hidden size-20 flex items-center justify-center bg-muted shrink-0 p-[0.8px]">
          {enrollment.profilePictureUrl ? (
            <img
              src={enrollment.profilePictureUrl}
              alt={displayName}
              className="size-[78.4px] object-cover"
            />
          ) : (
            <span className="text-[24px] font-semibold text-content-secondary">
              {displayName.charAt(0)}
            </span>
          )}
        </div>
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <p className="text-[18px] font-semibold text-foreground leading-7">
                {displayName}
              </p>
              {hasValue(enrollment.seekerEmail) && (
                <p className="text-[14px] font-medium text-brand-primary leading-5">
                  {enrollment.seekerEmail}
                </p>
              )}
            </div>
            <Badge
              className={`rounded-sm px-2 py-1 text-[12px] border whitespace-nowrap ${statusBadgeClasses(status)}`}
            >
              {statusLabel}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-0">
            {hasValue(enrollment.seekerEmail) && (
              <InfoItem icon={Mail} text={enrollment.seekerEmail!} />
            )}
            {hasValue(enrollment.phone) && (
              <InfoItem icon={Phone} text={enrollment.phone!} />
            )}
            {hasValue(enrollment.location) && (
              <InfoItem icon={MapPin} text={enrollment.location!} />
            )}
            <InfoItem icon={Calendar} text={`Applied: ${new Date(enrollment.appliedAt).toLocaleDateString()}`} />
          </div>

          <div className="flex items-start gap-6 flex-wrap">
            {hasValue(enrollment.experienceYears) && (
              <div className="flex items-center gap-2 h-5">
                <Briefcase className="h-[14px] w-3.5 text-brand-primary" />
                <span className="text-[12px] text-content-secondary leading-5">
                  {enrollment.experienceYears} years experience
                </span>
              </div>
            )}
            {hasValue(enrollment.latestEducation) && (
              <div className="flex items-center gap-2 h-5">
                <GraduationCap className="h-[14px] w-[14px] text-brand-primary" />
                <span className="text-[12px] text-content-secondary leading-5">
                  {enrollment.latestEducation}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button
              className="bg-brand-primary hover:bg-brand-primary-hover text-white h-8 rounded-lg px-4 gap-2"
              size="sm"
              onClick={() => onViewDetails(enrollment)}
            >
              <FileText className="h-4 w-4" />
              View Details
            </Button>
            {canStartReview && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-status-review text-status-review px-4 gap-2"
                onClick={() => onStatusChange(enrollment.enrollmentId, "UnderReview")}
                disabled={isUpdating}
              >
                <Clock className="h-4 w-4" />
                Start Review
              </Button>
            )}
            {canAcceptOrReject && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg border-status-accepted text-status-accepted px-4"
                  onClick={() => onStatusChange(enrollment.enrollmentId, "Accepted")}
                  disabled={isUpdating}
                >
                  Accept
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg border-status-rejected text-status-rejected px-4"
                  onClick={() => onStatusChange(enrollment.enrollmentId, "Rejected")}
                  disabled={isUpdating}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

function EnrollmentDetailsPanel({
  enrollment,
  offeringId,
  onClose,
  onStatusChange,
  isUpdating,
}: {
  enrollment: OfferingEnrollment;
  offeringId: string;
  onClose: () => void;
  onStatusChange: (enrollmentId: string, newStatus: CourseApplicationStatus) => void;
  isUpdating: boolean;
}) {
  const displayName = enrollment.seekerName || "Unknown Applicant";
  const status = enrollment.status;
  const statusLabel = statusLabelMap[status];

  const canStartReview = status === "Pending";
  const canAcceptOrReject = status === "Pending" || status === "UnderReview";

  const { data: details, isLoading: detailsLoading } = useOfferingEnrollmentDetails(
    enrollment.enrollmentId,
    true,
  );

  const skills = details?.skills ?? [];

  return (
    <div className="rounded-2xl border-[0.8px] border-border-light bg-card overflow-hidden max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="px-8 py-4 border-b-[0.8px] border-border-light flex justify-between items-center h-20">
        <div className="flex items-center gap-4">
          <div className="border-[0.8px] border-border rounded-xl overflow-hidden size-16 p-[0.8px] flex items-center justify-center bg-muted shrink-0">
            {enrollment.profilePictureUrl ? (
              <img
                src={enrollment.profilePictureUrl}
                alt={displayName}
                className="size-[62px] object-cover"
              />
            ) : (
              <span className="text-[24px] font-semibold text-content-secondary">
                {displayName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-[24px] font-semibold text-foreground leading-9">
              {displayName}
            </p>
            {hasValue(enrollment.seekerEmail) && (
              <p className="text-[14px] text-brand-primary leading-5">
                {enrollment.seekerEmail}
              </p>
            )}
          </div>
        </div>
        <button
          type="button"
          className="size-10 rounded-lg flex justify-center items-center hover:bg-muted transition-colors"
          onClick={onClose}
          aria-label="Close enrollment details"
        >
          <X className="h-6 w-6 text-foreground" />
        </button>
      </div>

      <div className="px-8 py-6 flex flex-col gap-6">
        <div className="flex justify-between items-center h-10">
          <Badge
            className={`rounded-lg px-2 py-1 text-[14px] border whitespace-nowrap h-8 flex justify-center items-center ${statusBadgeClasses(status)}`}
          >
            {statusLabel}
          </Badge>
        </div>

        <div className="bg-muted px-5 py-5 rounded-xl flex flex-col gap-4">
          <h4 className="text-[16px] font-semibold text-foreground leading-7">
            Contact Information
          </h4>
          <div className="grid grid-cols-2 gap-x-0 gap-y-4">
            <DetailInfoItem icon={Mail} label="Email" value={hasValue(enrollment.seekerEmail) ? enrollment.seekerEmail! : "N/A"} />
            <DetailInfoItem icon={Phone} label="Phone" value={hasValue(enrollment.phone) ? enrollment.phone! : "N/A"} />
            <DetailInfoItem icon={MapPin} label="Location" value={hasValue(enrollment.location) ? enrollment.location! : "N/A"} />
            <DetailInfoItem
              icon={Calendar}
              label="Applied Date"
              value={new Date(enrollment.appliedAt).toLocaleDateString()}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[18px]">
          {hasValue(enrollment.experienceYears) && (
            <div className="bg-muted px-5 py-5 rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-3 h-6">
                <Briefcase className="h-5 w-5 text-brand-primary" />
                <span className="text-[14px] font-semibold text-foreground leading-6">Experience</span>
              </div>
              <p className="text-[14px] text-content-secondary leading-5">
                {enrollment.experienceYears} years experience
              </p>
            </div>
          )}
          {hasValue(enrollment.latestEducation) && (
            <div className="bg-muted px-5 py-5 rounded-xl flex flex-col gap-3">
              <div className="flex items-center gap-3 h-6">
                <GraduationCap className="h-5 w-5 text-brand-primary" />
                <span className="text-[14px] font-semibold text-foreground leading-6">Education</span>
              </div>
              <p className="text-[14px] text-content-secondary leading-5">
                {enrollment.latestEducation}
              </p>
            </div>
          )}
        </div>

        <div className="bg-muted px-5 py-5 rounded-xl flex flex-col gap-4">
          <h4 className="text-[16px] font-semibold text-foreground leading-7">
            Skills & Expertise
          </h4>
          {detailsLoading ? (
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-9 w-20 rounded-lg bg-border-light animate-pulse" />
              ))}
            </div>
          ) : skills.length === 0 ? (
            <p className="text-[14px] text-muted-foreground">
              No skills listed for this applicant.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  className="rounded-lg px-2 py-1 h-9 border border-brand-primary bg-status-accepted-bg text-brand-primary text-[14px] flex justify-center items-center whitespace-nowrap"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="bg-muted px-5 py-5 rounded-xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="size-12 bg-card rounded-lg flex justify-center items-center">
                <FileText className="h-6 w-6 text-brand-primary" />
              </div>
              <div className="flex flex-col">
                <p className="text-[16px] font-semibold text-foreground leading-6">
                  Resume / CV
                </p>
                {hasValue(details?.resumeUrl)
                  ? (
                    <p className="text-[12px] text-muted-foreground leading-5">
                      {details!.resumeUrl!.split("/").pop()!}
                    </p>
                  )
                  : (
                    <p className="text-[12px] text-muted-foreground leading-5">
                      No resume attached
                    </p>
                  )}
              </div>
            </div>
            {hasValue(details?.resumeUrl)
              ? (
                <a
                  href={details!.resumeUrl ?? undefined}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white h-10 rounded-lg px-4 gap-2"
                  >
                    <Download className="h-5 w-5" />
                    Download
                  </Button>
                </a>
              )
              : (
                <Button
                  disabled
                  className="bg-muted text-muted-foreground h-10 rounded-lg px-4 gap-2"
                >
                  <Download className="h-5 w-5" />
                  Download
                </Button>
              )}
          </div>
        </div>
      </div>

      <div className="px-8 border-t-[0.8px] border-border-light bg-muted flex flex-wrap justify-between items-center gap-3 h-20">
        <div className="flex items-center gap-3">
          {canStartReview && (
            <Button
              variant="outline"
              className="h-10 rounded-lg border-status-review text-status-review gap-2"
              onClick={() => onStatusChange(enrollment.enrollmentId, "UnderReview")}
              disabled={isUpdating}
            >
              <Clock className="h-5 w-5" />
              Start Review
            </Button>
          )}
          {canAcceptOrReject && (
            <>
              <Button
                variant="outline"
                className="h-10 rounded-lg border-status-accepted text-status-accepted"
                onClick={() => onStatusChange(enrollment.enrollmentId, "Accepted")}
                disabled={isUpdating}
              >
                Accept
              </Button>
              <Button
                variant="outline"
                className="h-10 rounded-lg border-status-rejected text-status-rejected"
                onClick={() => onStatusChange(enrollment.enrollmentId, "Rejected")}
                disabled={isUpdating}
              >
                Reject
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-lg border-foreground text-foreground gap-2"
          >
            <MessageSquare className="h-5 w-5" />
            Send Message
          </Button>
          <Button
            variant="outline"
            className="h-10 rounded-lg border-status-review text-status-review gap-2"
          >
            <Calendar className="h-5 w-5" />
            Schedule Interview
          </Button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  text,
}: {
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 h-5">
      <Icon className="h-[14px] w-[14px] text-content-secondary shrink-0" />
      <span className="text-[12px] text-content-secondary leading-5 truncate">
        {text}
      </span>
    </div>
  );
}

function DetailInfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 bg-card rounded-lg flex justify-center items-center shrink-0">
        <Icon className="h-5 w-5 text-brand-primary" />
      </div>
      <div className="flex flex-col">
        <p className="text-[12px] text-muted-foreground leading-4">{label}</p>
        <p className="text-[14px] font-medium text-foreground leading-5">{value}</p>
      </div>
    </div>
  );
}
