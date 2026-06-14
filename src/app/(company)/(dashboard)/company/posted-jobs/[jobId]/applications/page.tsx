"use client";

import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Star,
  X,
  ChevronDown,
  Search,
  Target,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getErrorMessage } from "@/lib/apiClient/error";
import {
  useJobApplicationsByPost,
  useUpdateApplicationStatus,
} from "@/hooks/jobApplications";
import { useJobPostById } from "@/hooks/postedJobs";
import type {
  JobApplicationRecord,
  JobApplicationStatus,
  UpdateApplicationStatusPayload,
} from "@/features/job-applications/types";
import {
  APPLICATION_STATUS_OPTIONS,
  normalizeJobApplicationStatus,
} from "@/features/job-applications/types";
import { getTechnicalDomainLabel } from "@/features/enums";

const STATUS_TABS: { label: string; value: JobApplicationStatus | "all" }[] =
  [
    { label: "All", value: "all" },
    ...APPLICATION_STATUS_OPTIONS.map((opt) => ({
      label: opt.label,
      value: opt.value as JobApplicationStatus,
    })),
  ];

const statusLabelMap: Record<JobApplicationStatus, string> = {
  Pending: "New",
  UnderReview: "Under Review",
  Accepted: "Accepted",
  Rejected: "Rejected",
  Withdrawn: "Withdrawn",
};

const statusBadgeVariantClass = (status: JobApplicationStatus): string => {
  const map: Record<JobApplicationStatus, string> = {
    Pending: "bg-status-pending-bg text-status-pending border-status-pending",
    UnderReview: "bg-status-review-bg text-status-review border-status-review",
    Accepted: "bg-status-accepted-bg text-status-accepted border-status-accepted",
    Rejected: "bg-status-rejected-bg text-status-rejected border-status-rejected-border",
    Withdrawn: "bg-muted text-muted-foreground border-border",
  };
  return map[status];
};

function SummaryCard({
  label,
  value,
  variantClassName,
}: {
  label: string;
  value: number;
  variantClassName: string;
}) {
  return (
    <div className={`rounded-lg border-[0.8px] border-solid py-3 px-5 flex flex-col gap-1 ${variantClassName}`}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold">{value}</span>
    </div>
  );
}

function ApplicantSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[200px] rounded-xl border-[0.8px] border-border-light bg-card animate-pulse"
        />
      ))}
    </div>
  );
}

export default function JobApplicationsPage() {
  const router = useRouter();
  const { status: authStatus } = useSession();
  const params = useParams();
  const jobId = useMemo(() => {
    const raw = params?.jobId;
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

  if (!jobId) {
    return (
      <div className="rounded-xl border-[0.8px] border-border-light bg-card p-6 text-sm text-content-secondary">
        Job applications could not be found.
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

  return <JobApplicationsContent jobId={jobId} />;
}

function computeSummary(applicants: JobApplicationRecord[]) {
  let pendingCount = 0;
  let underReviewCount = 0;
  let acceptedCount = 0;
  let rejectedCount = 0;
  let withdrawnCount = 0;

  for (const a of applicants) {
    const status = normalizeJobApplicationStatus(a.applicationStatus);
    switch (status) {
      case "Pending":
        pendingCount++;
        break;
      case "UnderReview":
        underReviewCount++;
        break;
      case "Accepted":
        acceptedCount++;
        break;
      case "Rejected":
        rejectedCount++;
        break;
      case "Withdrawn":
        withdrawnCount++;
        break;
    }
  }

  return {
    total: applicants.length,
    pendingCount,
    underReviewCount,
    acceptedCount,
    rejectedCount,
    withdrawnCount,
  };
}

function JobApplicationsContent({ jobId }: { jobId: string }) {
  const [activeTab, setActiveTab] = useState<JobApplicationStatus | "all">(
    "all",
  );
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error } = useJobApplicationsByPost(jobId);
  const { data: jobPost } = useJobPostById(jobId);

  const updateStatus = useUpdateApplicationStatus();
  const [mutationError, setMutationError] = useState<string | null>(null);

  useEffect(() => {
    if (!mutationError) return;
    const timer = setTimeout(() => setMutationError(null), 5000);
    return () => clearTimeout(timer);
  }, [mutationError]);

  const rawApplicants = data ?? [];

  const applicants = useMemo(() => {
    const list = (rawApplicants as JobApplicationRecord[]).map((a) => ({
      ...a,
      applicationStatus: normalizeJobApplicationStatus(a.applicationStatus),
    }));
    return list;
  }, [rawApplicants]);

  const [selectedApplicantId, setSelectedApplicantId] = useState<string | null>(null);
  const setSelectedApplicant = useCallback(
    (applicant: JobApplicationRecord) => setSelectedApplicantId(applicant.applicationId),
    [],
  );
  const currentApplicant = useMemo(() => {
    if (!selectedApplicantId) return null;
    return applicants.find(
      (a) => a.applicationId === selectedApplicantId,
    ) ?? null;
  }, [applicants, selectedApplicantId]);

  const filteredApplicants = useMemo(() => {
    let filtered = applicants;
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (a) => a.applicationStatus === activeTab,
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          `${a.seekerFirstName} ${a.seekerLastName}`
            .toLowerCase()
            .includes(q) ||
          a.seekerProfileName.toLowerCase().includes(q) ||
          a.technicalDomain.toLowerCase().includes(q) ||
          a.skills.some((s) => s.toLowerCase().includes(q)),
      );
    }
    filtered = [...filtered].sort((a, b) => {
      const dateA = new Date(a.appliedAt).getTime();
      const dateB = new Date(b.appliedAt).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });
    return filtered;
  }, [applicants, activeTab, searchQuery, sortOrder]);

  const summary = useMemo(() => computeSummary(applicants), [applicants]);

  const handleStatusChange = useCallback(
    (
      applicationId: string,
      jobPostId: string,
      newStatus: JobApplicationStatus,
    ) => {
      setMutationError(null);
      const payload: UpdateApplicationStatusPayload = {
        applicationStatus: newStatus,
      };
      setSelectedApplicantId(applicationId);
      updateStatus.mutate(
        { applicationId, jobPostId, payload },
        {
          onError: (err) =>
            setMutationError(getErrorMessage(err, "Failed to update status.")),
        },
      );
    },
    [updateStatus],
  );

  const jobTitle = jobPost?.title ?? "";

  return (
    <div className="space-y-6">
      {(isError || mutationError) && (
        <div className="rounded-xl border-[0.8px] border-status-rejected-border bg-status-rejected-bg px-5 py-3 text-[13px] text-status-rejected">
          {mutationError ||
            getErrorMessage(error, "Failed to load applications.")}
        </div>
      )}

      <div className="rounded-2xl border-[0.8px] border-border-light bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-semibold text-foreground">
              Job Applications {jobTitle ? `for ${jobTitle}` : ""}
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage and review all applications for this job
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search applicants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-lg border-[0.8px] border-border bg-card text-[13px] w-60 pl-9"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            label="Total"
            value={summary.total}
            variantClassName="border-border bg-card text-foreground"
          />
          <SummaryCard
            label="New"
            value={summary.pendingCount}
            variantClassName="border-status-pending bg-status-pending-bg text-status-pending"
          />
          <SummaryCard
            label="Under Review"
            value={summary.underReviewCount}
            variantClassName="border-status-review bg-status-review-bg text-status-review"
          />
          <SummaryCard
            label="Rejected"
            value={summary.rejectedCount}
            variantClassName="border-status-rejected-border bg-status-rejected-bg text-status-rejected"
          />
          <SummaryCard
            label="Accepted"
            value={summary.acceptedCount}
            variantClassName="border-status-accepted bg-status-accepted-bg text-status-accepted"
          />
        </div>
      </div>

      <div className="rounded-2xl border-[0.8px] border-border-light bg-card p-5 space-y-5">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                  activeTab === tab.value
                    ? "bg-brand-primary text-white"
                    : "border-[0.8px] border-border text-content-secondary bg-transparent hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            className="text-content-secondary border-border gap-2"
            onClick={() =>
              setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))
            }
          >
            {sortOrder === "newest" ? "Newest" : "Oldest"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        {currentApplicant && typeof document !== "undefined"
          ? createPortal(
              <div
                className="fixed inset-0 z-50 bg-black/40 overflow-y-auto"
                onClick={() => {
                  setSelectedApplicantId(null);
                }}
              >
                <div className="flex min-h-full items-center justify-center p-4">
                  <div
                    className="w-full max-w-4xl"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <ApplicantDetailsPanel
                      applicant={currentApplicant}
                      jobId={jobId}
                      onClose={() => {
                        setSelectedApplicantId(null);
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
          <ApplicantSkeleton />
        ) : filteredApplicants.length === 0 ? (
          <div className="text-center text-[13px] text-muted-foreground py-12">
            No applications found for this filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplicants.map((applicant) => (
              <ApplicationCard
                key={applicant.applicationId}
                applicant={applicant}
                jobId={jobId}
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

const ApplicationCard = memo(function ApplicationCard({
  applicant,
  jobId,
  onViewDetails,
  onStatusChange,
  isUpdating,
}: {
  applicant: JobApplicationRecord;
  jobId: string;
  onViewDetails: (applicant: JobApplicationRecord) => void;
  onStatusChange: (
    applicationId: string,
    jobPostId: string,
    status: JobApplicationStatus,
  ) => void;
  isUpdating: boolean;
}) {
  const nameFromFields =
    `${applicant.seekerFirstName} ${applicant.seekerLastName}`.trim();
  const displayName = nameFromFields || applicant.seekerProfileName || "Unknown Applicant";
  const status = normalizeJobApplicationStatus(applicant.applicationStatus);
  const statusLabel = statusLabelMap[status];

  const canStartReview = status === "Pending";
  const canAcceptOrReject = status === "Pending" || status === "UnderReview";

  return (
    <div className="rounded-xl border-[0.8px] border-border-light bg-card p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="border-[0.8px] border-border rounded-xl overflow-hidden w-20 h-20 flex items-center justify-center bg-muted shrink-0">
            {applicant.seekerProfilePictureUrl ? (
              <img
                src={applicant.seekerProfilePictureUrl}
                alt={displayName}
                className="w-[78.4px] h-[78.4px] object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-content-secondary">
                {displayName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-lg font-semibold text-foreground leading-[27px]">
              {displayName}
            </p>
            {applicant.seekerProfileName && applicant.seekerProfileName !== nameFromFields && (
              <p className="text-sm font-medium text-brand-primary leading-[21px]">
                {applicant.seekerProfileName}
              </p>
            )}
          </div>
        </div>
        <Badge
          className={`rounded px-2 py-1 text-xs border border-solid whitespace-nowrap ${statusBadgeVariantClass(status)}`}
        >
          {statusLabel}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {applicant.technicalDomain && (
          <InfoItem icon={Target} text={getTechnicalDomainLabel(applicant.technicalDomain as never)} />
        )}
        <InfoItem icon={Calendar} text={`Applied: ${new Date(applicant.appliedAt).toLocaleDateString()}`} />
        <InfoItem
          icon={Star}
          text={`Match: ${applicant.matchingScore}`}
          iconClassName="text-status-review"
        />
        <InfoItem icon={Calendar} text={`Updated: ${new Date(applicant.updatedAt).toLocaleDateString()}`} />
      </div>

      {applicant.skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {applicant.skills.map((skill) => (
            <Badge
              key={skill}
              className="rounded-full border-[0.8px] border-brand-primary bg-status-accepted-bg text-brand-primary text-xs"
            >
              {skill}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          className="bg-brand-primary text-white hover:bg-brand-primary-hover h-8 rounded-lg px-4 gap-2"
          size="sm"
          onClick={() => onViewDetails(applicant)}
        >
          <FileText className="h-4 w-4" />
          View Details
        </Button>
        {canStartReview && (
          <Button
            variant="outline"
            size="sm"
            className="border-status-review text-status-review h-8 rounded-lg px-4 gap-2"
            onClick={() =>
              onStatusChange(applicant.applicationId, jobId, "UnderReview")
            }
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
              className="border-status-accepted text-status-accepted h-8 rounded-lg px-4"
              onClick={() =>
                onStatusChange(applicant.applicationId, jobId, "Accepted")
              }
              disabled={isUpdating}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-status-rejected text-status-rejected h-8 rounded-lg px-4"
              onClick={() =>
                onStatusChange(applicant.applicationId, jobId, "Rejected")
              }
              disabled={isUpdating}
            >
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
  jobId,
  onClose,
  onStatusChange,
  isUpdating,
}: {
  applicant: JobApplicationRecord;
  jobId: string;
  onClose: () => void;
  onStatusChange: (
    applicationId: string,
    jobPostId: string,
    status: JobApplicationStatus,
  ) => void;
  isUpdating: boolean;
}) {
  const nameFromFields =
    `${applicant.seekerFirstName} ${applicant.seekerLastName}`.trim();
  const displayName = nameFromFields || applicant.seekerProfileName || "Unknown Applicant";
  const status = normalizeJobApplicationStatus(applicant.applicationStatus);
  const statusLabel = statusLabelMap[status];
  const skills = applicant.skills ?? [];

  const canStartReview = status === "Pending";
  const canAcceptOrReject = status === "Pending" || status === "UnderReview";

  return (
    <div className="rounded-2xl border-[0.8px] border-border-light bg-card p-6 shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="border-[0.8px] border-border rounded-xl overflow-hidden w-16 h-16 flex items-center justify-center bg-muted shrink-0">
            {applicant.seekerProfilePictureUrl ? (
              <img
                src={applicant.seekerProfilePictureUrl}
                alt={displayName}
                className="w-[62px] h-[62px] object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-content-secondary">
                {displayName.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-xl font-semibold text-foreground">
              {displayName}
            </p>
            {applicant.seekerProfileName && applicant.seekerProfileName !== nameFromFields && (
              <p className="text-sm font-medium text-brand-primary">
                {applicant.seekerProfileName}
              </p>
            )}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-border h-8 w-8"
          onClick={onClose}
          aria-label="Close applicant details"
        >
          <X className="h-4 w-4 text-content-secondary" />
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Badge
          className={`rounded px-2 py-1 text-xs border border-solid whitespace-nowrap ${statusBadgeVariantClass(status)}`}
        >
          {statusLabel}
        </Badge>
        <div className="flex items-center gap-1">
          <Star className="h-[14px] w-[14px] text-status-review fill-status-review" />
          <span className="text-[13px] font-semibold text-status-review">
            Match: {applicant.matchingScore}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-muted p-4 space-y-4">
        <h4 className="text-sm font-semibold text-foreground">
          Applicant Information
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          {applicant.technicalDomain && (
            <DetailInfoItem
              icon={Target}
              label="Domain"
              value={getTechnicalDomainLabel(applicant.technicalDomain as never)}
            />
          )}
          <DetailInfoItem
            icon={Calendar}
            label="Applied Date"
            value={new Date(applicant.appliedAt).toLocaleDateString()}
          />
          <DetailInfoItem
            icon={Calendar}
            label="Last Updated"
            value={new Date(applicant.updatedAt).toLocaleDateString()}
          />
        </div>
      </div>

      {skills.length > 0 && (
        <div className="rounded-xl bg-muted p-4">
          <h4 className="text-sm font-semibold text-foreground">
            Skills & Expertise
          </h4>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <Badge
                key={skill}
                className="rounded-full border-[0.8px] border-brand-primary bg-status-accepted-bg text-brand-primary text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {canStartReview && (
          <Button
            variant="outline"
            size="sm"
            className="border-status-review text-status-review h-8 rounded-lg gap-2"
            onClick={() =>
              onStatusChange(applicant.applicationId, jobId, "UnderReview")
            }
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
              className="border-status-accepted text-status-accepted h-8 rounded-lg"
              onClick={() =>
                onStatusChange(applicant.applicationId, jobId, "Accepted")
              }
              disabled={isUpdating}
            >
              Accept
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-status-rejected text-status-rejected h-8 rounded-lg"
              onClick={() =>
                onStatusChange(applicant.applicationId, jobId, "Rejected")
              }
              disabled={isUpdating}
            >
              Reject
            </Button>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          className="border-foreground text-foreground h-8 rounded-lg gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Send Message
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-status-review text-status-review h-8 rounded-lg gap-2"
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
      <Icon
        className={`h-[14px] w-[14px] text-content-secondary ${iconClassName ?? ""}`}
      />
      <span className="text-[13px] text-content-secondary leading-[19.5px]">
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
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg border-[0.8px] border-border bg-card flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-content-secondary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-[13px] font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
