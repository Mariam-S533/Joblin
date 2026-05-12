"use client";

import {memo, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  Calendar,
  Check,
  Clock,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Star,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getErrorMessage } from "@/lib/apiClient/error";
import {
  useCourseApplications,
  useUpdateCourseApplicationStatus,
} from "@/hooks/courseApplications";
import type {
  CourseApplicant,
  CourseApplicationStatus,
} from "@/features/course-applications/types";

const STATUS_TABS: { label: string; value: CourseApplicationStatus | "all" }[] =
  [
    { label: "All", value: "all" },
    { label: "New", value: "new" },
    { label: "Reviewing", value: "reviewing" },
    { label: "Rejected", value: "rejected" },
    { label: "Interviewed", value: "interviewed" },
  ];

const statusLabelMap: Record<CourseApplicationStatus, string> = {
  new: "New",
  reviewing: "Under Review",
  rejected: "Rejected",
  accepted: "Accepted",
  interviewed: "Interviewed",
};

const statusBadgeClasses = (status: CourseApplicationStatus): string => {
  switch (status) {
    case "new":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "reviewing":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "rejected":
      return "bg-red-50 text-red-600 border-red-200";
    case "interviewed":
      return "bg-neutral-100 text-neutral-600 border-neutral-200";
    default:
      return "";
  }
};

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
      className={`rounded-lg border px-4 py-3 flex flex-col gap-1 ${className ?? ""}`}
    >
      <span className="text-xs font-medium">{label}</span>
      <span className="text-lg font-semibold">{value}</span>
    </div>
  );
}

function ApplicantSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[180px] rounded-xl border border-neutral-200 bg-white animate-pulse"
        />
      ))}
    </div>
  );
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
      router.replace("/login/company");
    }
  }, [authStatus, router]);

  if (authStatus === "loading") {
    return (
      <div className="space-y-6">
        <ApplicantSkeleton />
      </div>
    );
  }



  if (!courseId) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        Course applications could not be found.
      </div>
    );
  }

  if (authStatus === "unauthenticated") {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-neutral-500">Redirecting to login...</p>
      </div>
    );
  }

  return <CourseApplicationsContent courseId={courseId} />;
}

function CourseApplicationsContent({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<CourseApplicationStatus | "all">(
    "all",
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedApplicant, setSelectedApplicant] =
    useState<CourseApplicant | null>(null);

     const queryOptions = useMemo(
    () => ({ status: activeTab, sort: sortOrder }),
    [activeTab, sortOrder]
  );
  const { data, isLoading, isError, error } = useCourseApplications(courseId, queryOptions);

  const updateStatus = useUpdateCourseApplicationStatus(courseId);
  const [mutationError, setMutationError] = useState<string | null>(null);

  useEffect(() => {
    if (!mutationError) return;
    const timer = setTimeout(() => setMutationError(null), 5000);
    return () => clearTimeout(timer);
  }, [mutationError]);

  const applicants = data?.applicants ?? [];
 const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
useEffect(() => {
  setPortalTarget(document.body);
}, []);

 useEffect(() => {
  if (selectedApplicant && !applicants.find((a) => a.id === selectedApplicant.id)) {
    setSelectedApplicant(null);
  }
}, [applicants, selectedApplicant]);
  const summary = data?.summary;

  const handleStatusChange = useCallback(
    (applicantId: string, status: CourseApplicationStatus) => {
    setMutationError(null);
    setSelectedApplicant((prev) =>
      prev && prev.id === applicantId ? { ...prev, status } : prev,
    );
    updateStatus.mutate(
      { applicantId, status },
      {
        onError: (err) =>
          setMutationError(getErrorMessage(err, "Failed to update status.")),
      },
    );
  }, [updateStatus]);

  return (
    <div className="space-y-6">
      {(isError || mutationError) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {mutationError ||
            getErrorMessage(error, "Failed to load applications.")}
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">
            Applications for {data?.courseTitle ?? "this course"}
          </h2>
          <p className="text-xs text-neutral-500">
            Manage and review all applications for this course
          </p>
        </div>

        {summary && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <SummaryCard
              label="Total"
              value={summary.total}
              className="border-neutral-200 bg-neutral-50 text-neutral-800"
            />
            <SummaryCard
              label="New"
              value={summary.newCount}
              className="border-blue-200 bg-blue-50 text-blue-600"
            />
            <SummaryCard
              label="Review"
              value={summary.reviewCount}
              className="border-amber-200 bg-amber-50 text-amber-700"
            />
            <SummaryCard
              label="Rejected"
              value={summary.rejectedCount}
              className="border-red-200 bg-red-50 text-red-600"
            />
            <SummaryCard
              label="Accepted"
              value={summary.acceptedCount}
              className="border-emerald-200 bg-emerald-50 text-emerald-700"
            />
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.value
                    ? "bg-emerald-600 text-white"
                    : "border border-neutral-300 text-neutral-600 hover:bg-neutral-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="gap-2 text-neutral-600 border-neutral-400"
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
          >
            {sortOrder === "newest" ? "Newest" : "Oldest"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {selectedApplicant && portalTarget
          ? createPortal(
              <div
                className="fixed inset-0 z-50 bg-black/40 overflow-y-auto"
                onClick={() => setSelectedApplicant(null)}
              >
                <div className="flex min-h-full items-center justify-center p-4">
                  <div
                    className="w-full max-w-4xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ApplicantDetailsPanel
                      applicant={selectedApplicant}
                      courseTitle={data?.courseTitle ?? ""}
                      onClose={() => setSelectedApplicant(null)}
                    />
                  </div>
                </div>
              </div>,
              portalTarget,
            )
          : null}

        {isLoading ? (
          <ApplicantSkeleton />
        ) : applicants.length === 0 ? (
          <div className="text-center text-sm text-neutral-500">
            No applications found for this filter.
          </div>
        ) : (
          <div className="space-y-4">
            {applicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                courseTitle={data?.courseTitle ?? ""}
                onViewDetails={setSelectedApplicant}
                onStatusChange={handleStatusChange}
                isUpdating={updateStatus.isPending}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ApplicantCard = memo(function ApplicantCard({  applicant,
  courseTitle,
  onViewDetails,
  onStatusChange,
  isUpdating, }: { applicant: CourseApplicant;
  courseTitle: string;
  onViewDetails: (applicant: CourseApplicant) => void;
  onStatusChange: (
    applicantId: string,
    status: CourseApplicationStatus,
  ) => void;
  isUpdating: boolean; }) {

  const statusLabel = statusLabelMap[applicant.status];

  const canStartReview = applicant.status === "new";
  const canAcceptOrReject =
    applicant.status === "new" ||
    applicant.status === "reviewing" ||
    applicant.status === "interviewed";

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-16 w-16 rounded-xl bg-neutral-100 flex items-center justify-center text-lg font-semibold text-neutral-600">
            {applicant.avatarUrl ? (
              <img
                src={applicant.avatarUrl}
                alt={applicant.name}
                className="h-16 w-16 rounded-xl object-cover"
              />
            ) : (
              applicant.name.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <p className="text-base font-semibold text-neutral-900">
              {applicant.name}
            </p>
            <p className="text-sm text-emerald-600">
              Enrolled in: {courseTitle || "Course"}
            </p>
          </div>
        </div>
        <Badge
          className={`rounded-md px-2.5 py-1 ${statusBadgeClasses(
            applicant.status,
          )}`}
        >
          {statusLabel}
        </Badge>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
        <InfoItem icon={Mail} text={applicant.email} />
        <InfoItem icon={Phone} text={applicant.phone} />
        <InfoItem icon={MapPin} text={applicant.location} />
        <InfoItem icon={Calendar} text={`Enrolled: ${applicant.enrolledAt}`} />
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
        <InfoItem icon={Briefcase} text={applicant.experience} />
        <InfoItem icon={GraduationCap} text={applicant.education} />
        <InfoItem
          icon={Star}
          text={applicant.rating.toFixed(1)}
          iconClassName="text-amber-500"
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          className="bg-emerald-600 hover:bg-emerald-700 text-white h-9"
          size="sm"
          onClick={() => onViewDetails(applicant)}
        >
          <FileText className="h-4 w-4" />
          View Details
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 border-neutral-900 text-neutral-900"
          asChild
        >
          <a href={applicant.resumeUrl} download>
            <Download className="h-4 w-4" />
            Download Resume
          </a>
        </Button>
        {canStartReview && (
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-amber-400 text-amber-600"
            onClick={() => onStatusChange(applicant.id, "reviewing")}
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
              className="h-9 border-emerald-500 text-emerald-600"
              onClick={() => onStatusChange(applicant.id, "accepted")}
              disabled={isUpdating}
            >
              <Check className="h-4 w-4" />
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9 border-red-500 text-red-600"
              onClick={() => onStatusChange(applicant.id, "rejected")}
              disabled={isUpdating}
            >
              <X className="h-4 w-4" />
              Reject
            </Button>
          </>
        )}
      </div>
    </div>
  );
});

function ApplicantDetailsPanel({
  applicant,
  courseTitle,
  onClose,
}: {
  applicant: CourseApplicant;
  courseTitle: string;
  onClose: () => void;
}) {
  const statusLabel = statusLabelMap[applicant.status];
  const skills = applicant.skills ?? [];
  const resumeFileName =
    applicant.resumeFileName ??
    applicant.resumeUrl.split("/").pop() ??
    "resume.pdf";
  const coverLetter = applicant.coverLetter?.trim();

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-3xl space-y-5 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <div className="h-14 w-16 rounded-xl bg-neutral-100 flex items-center justify-center text-lg font-semibold text-neutral-600">
            {applicant.avatarUrl ? (
              <img
                src={applicant.avatarUrl}
                alt={applicant.name}
                className="h-14 w-14 rounded-xl object-cover"
              />
            ) : (
              applicant.name.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xl font-semibold text-neutral-900">
              {applicant.name}
            </p>
            <p className="text-sm text-emerald-600">
              Enrolled in: {courseTitle || "Course"}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-9 w-9 border-neutral-200"
          onClick={onClose}
          aria-label="Close applicant details"
        >
          <X className="h-4 w-4 text-neutral-600" />
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Badge
          className={`rounded-md px-2.5 py-1 ${statusBadgeClasses(
            applicant.status,
          )}`}
        >
          {statusLabel}
        </Badge>
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <span className="text-neutral-500">Rating:</span>
          <Star className="h-4 w-4 text-amber-500" />
          <span className="font-semibold text-amber-600">
            {applicant.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-neutral-50 p-4 space-y-4">
        <h4 className="text-sm font-semibold text-neutral-800">
          Contact Information
        </h4>
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailInfoItem icon={Mail} label="Email" value={applicant.email} />
          <DetailInfoItem icon={Phone} label="Phone" value={applicant.phone} />
          <DetailInfoItem
            icon={MapPin}
            label="Location"
            value={applicant.location}
          />
          <DetailInfoItem
            icon={Calendar}
            label="Enrolled Date"
            value={applicant.enrolledAt}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DetailStatCard
          icon={Briefcase}
          title="Experience"
          value={applicant.experience}
        />
        <DetailStatCard
          icon={GraduationCap}
          title="Education"
          value={applicant.education}
        />
      </div>

      <div className="rounded-xl bg-neutral-50 p-4">
        <h4 className="text-sm font-semibold text-neutral-800">
          Skills & Expertise
        </h4>
        {skills.length === 0 ? (
          <p className="mt-2 text-sm text-neutral-500">
            No skills listed for this applicant.
          </p>
        ) : (
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                className="rounded-full border border-emerald-500 bg-emerald-50 text-emerald-600"
              >
                {skill}
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl bg-neutral-50 p-4">
        <h4 className="text-sm font-semibold text-neutral-800">Cover Letter</h4>
        <p className="mt-2 text-sm leading-6 text-neutral-600">
          {coverLetter || "No cover letter provided."}
        </p>
      </div>

      <div className="rounded-xl bg-neutral-50 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg border border-neutral-200 bg-white flex items-center justify-center">
            <FileText className="h-5 w-5 text-neutral-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-800">
              Resume / CV
            </p>
            <p className="text-xs text-neutral-500">{resumeFileName}</p>
          </div>
        </div>
        <Button size="sm" className="h-9 gap-2" asChild>
          <a href={applicant.resumeUrl} download>
            <Download className="h-4 w-4" />
            Download
          </a>
        </Button>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 border-neutral-800 text-neutral-800"
        >
          <MessageSquare className="h-4 w-4" />
          Send Message
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 border-amber-400 text-amber-600"
        >
          <Calendar className="h-4 w-4" />
          Schedule Interview
        </Button>
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  text,
  iconClassName,
}: {
  icon: LucideIcon;
  text: string;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 text-neutral-500 ${iconClassName ?? ""}`} />
      <span>{text}</span>
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
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 rounded-lg border border-neutral-200 bg-white flex items-center justify-center">
        <Icon className="h-4 w-4 text-neutral-500" />
      </div>
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="text-sm font-medium text-neutral-800">{value}</p>
      </div>
    </div>
  );
}

function DetailStatCard({
  icon: Icon,
  title,
  value,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-neutral-50 p-4 space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
        <Icon className="h-4 w-4 text-neutral-600" />
        {title}
      </div>
      <p className="text-sm text-neutral-600">{value}</p>
    </div>
  );
}
