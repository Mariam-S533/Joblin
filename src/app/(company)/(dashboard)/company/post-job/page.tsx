"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Briefcase,
  Building,
  Check,
  CircleHelp,
  Eye,
  EyeOff,
  HandHelping,
  IdCard,
  Medal,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingInput } from "@/components/FloatingInputField";
import { FloatingTextArea } from "@/components/FloatingTextAreaField";
import { SectionCard } from "@/components/SectionCard";
import { BadgeList } from "@/components/job-post/BadgeList";
import { getErrorMessage } from "@/lib/apiClient/error";
import { useSubmitJobPostV2 } from "@/hooks/jobPost";
import { useSkills } from "@/hooks/skills";
import type {
  CreateJobPostFormPayload,
  SelectedSkill,
  SkillResponse,
} from "@/features/job-post/types";
import type {
  TechnicalDomain,
  JobType,
  WorkMode,
  ExperienceLevel,
  EnumOption,
  DifficultyLevel,
} from "@/features/enums";
import {
  TECHNICAL_DOMAIN_OPTIONS,
  JOB_TYPE_OPTIONS,
  WORK_MODE_OPTIONS_FOR_FORM,
  EXPERIENCE_LEVEL_OPTIONS,
  getTechnicalDomainLabel,
  getJobTypeLabel,
  getWorkModeLabel,
  getExperienceLevelLabel,
} from "@/features/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export default function PostJobPage() {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  // ─── API payload fields (built into CreateJobPostFormPayload at submit) ───
  const [title, setTitle] = useState("");
  const [technicalDomain, setTechnicalDomain] = useState<TechnicalDomain | "">(
    "",
  );
  const [domain, setDomain] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [reqExpYears, setReqExpYears] = useState(""); // string, converted to number at submit
  const [minSalary, setMinSalary] = useState(""); // string, converted to number at submit
  const [salaryCurrency, setSalaryCurrency] = useState("");
  const [contactMail, setContactMail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [jobType, setJobType] = useState<JobType | "">("");
  const [workMode, setWorkMode] = useState<WorkMode | "">("");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | "">(
    "",
  );

  // ─── Local UI state (never sent directly to API) ────────────────────────
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);

  // ─── Feedback & mode state ──────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [pendingPayload, setPendingPayload] =
    useState<CreateJobPostFormPayload | null>(null);

  const submitMutation = useSubmitJobPostV2();
  const skillsQuery = useSkills(isAuthenticated);
  const skillsData = skillsQuery.data ?? [];

  // ─── Refs ────────────────────────────────────────────────────────────────
  const skillsErrorShownRef = useRef(false);
  const isSubmittingRef = useRef(false);

  // ─── Skills load error toast (once per mount) ───────────────────────────
  useEffect(() => {
    if (skillsQuery.isError && !skillsErrorShownRef.current) {
      skillsErrorShownRef.current = true;
      toast.warning("Skills could not be loaded", {
        description:
          "Reload before submitting skills, because the API only accepts skill IDs from the Skills list.",
        duration: 5000,
      });
    }
  }, [skillsQuery.isError]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login/company");
    }
  }, [status, router]);

  // ─── Helpers ────────────────────────────────────────────────────────────

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // ─── Badge items for Job Type & Work Mode ───────────────────────────────
  const jobTypeWorkModeBadges = useMemo(() => {
    const badges: string[] = [];
    if (jobType) badges.push(jobType);
    if (workMode) badges.push(workMode);
    return badges;
  }, [jobType, workMode]);

  // ─── Validation ─────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) newErrors.title = "Job title is required";
    if (!technicalDomain)
      newErrors.technicalDomain = "Technical domain is required";
    if (!jobType) newErrors.jobType = "Job type is required";
    if (!workMode) newErrors.workMode = "Work mode is required";
    if (!experienceLevel)
      newErrors.experienceLevel = "Experience level is required";
    if (!country.trim()) newErrors.country = "Country is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!deadline.trim()) newErrors.deadline = "Deadline is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!requirements.trim())
      newErrors.requirements = "Requirements are required";
    if (!responsibilities.trim())
      newErrors.responsibilities = "Responsibilities are required";
    if (
      minSalary !== "" &&
      (isNaN(Number(minSalary)) || Number(minSalary) <= 0)
    ) {
      newErrors.minSalary = "Salary must be a positive number";
    }
    if (
      reqExpYears !== "" &&
      (isNaN(Number(reqExpYears)) || Number(reqExpYears) <= 0)
    ) {
      newErrors.reqExpYears = "Experience years must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit ─────────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!validate()) return;

    const ids: number[] = selectedSkills.map((s) => s.id);

    const payload: CreateJobPostFormPayload = {
      title,
      technicalDomain: technicalDomain as TechnicalDomain,
      domain: domain || undefined,
      country,
      city,
      street: street || undefined,
      reqExpYears: reqExpYears ? Number(reqExpYears) : undefined,
      minSalary: minSalary ? Number(minSalary) : undefined,
      salaryCurrency: salaryCurrency || undefined,
      contactMail: contactMail || undefined,
      deadline: deadline || undefined,
      description: description || undefined,
      requirements: requirements || undefined,
      responsibilities: responsibilities || undefined,
      jobType: jobType as JobType,
      workMode: workMode as WorkMode,
      experienceLevel: experienceLevel as ExperienceLevel,
      requiredSkillIds: ids,
    };

    setPendingPayload(payload);
  };

  const confirmSubmit = async () => {
    if (!pendingPayload || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    try {
      await submitMutation.mutateAsync(pendingPayload);
      setPendingPayload(null);
      setErrors({});
      toast.success("Job posted successfully", {
        description: "Your listing is now visible to applicants.",
        duration: 4000,
      });
      setTimeout(() => {
        router.push("/company/posted-jobs");
      }, 1500);
    } catch (error) {
      setPendingPayload(null);
      toast.error(getErrorMessage(error, "Failed to submit job post."), {
        duration: 5000,
      });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  // ─── Auth guards ────────────────────────────────────────────────────────
  if (status === "loading") {
    return (
      <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="space-y-4">
          <div className="h-16 animate-pulse rounded-xl bg-neutral-200" />
          <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
          <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-neutral-500">Redirecting to login...</p>
      </div>
    );
  }

  // ─── Preview mode ──────────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-neutral-800">
              Job Post Preview
            </h1>
            <Button
              variant="outline"
              onClick={() => setIsPreview(false)}
              className="flex items-center gap-2"
            >
              <EyeOff size={16} /> Back to Edit
            </Button>
          </div>

          <SectionCard icon={Briefcase} title="Job Introduction">
            <div className="space-y-3">
              <PreviewField label="Job Title" value={title} />
              <PreviewField
                label="Technical Domain"
                value={
                  technicalDomain
                    ? getTechnicalDomainLabel(technicalDomain)
                    : "-"
                }
              />
              <PreviewField label="Domain" value={domain} />
              <PreviewField label="Contact Email" value={contactMail} />
            </div>
          </SectionCard>

          <SectionCard icon={IdCard} title="Job Type & Work Mode">
            {jobType || workMode ? (
              <div className="flex flex-wrap gap-2">
                {jobType && (
                  <PreviewBadge
                    tone="emerald"
                    value={getJobTypeLabel(jobType)}
                  />
                )}
                {workMode && (
                  <PreviewBadge
                    tone="blue"
                    value={getWorkModeLabel(workMode)}
                  />
                )}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">
                No job type or work mode selected
              </p>
            )}
          </SectionCard>

          <SectionCard icon={Building} title="Work Location">
            <div className="space-y-3">
              <PreviewField label="Country" value={country} />
              <PreviewField label="City" value={city} />
              <PreviewField label="Street" value={street} />
            </div>
          </SectionCard>

          <SectionCard icon={HandHelping} title="Salary & Benefits">
            <div className="space-y-3">
              <PreviewField
                label="Minimum Salary"
                value={minSalary ? `${minSalary} ${salaryCurrency}` : "-"}
              />
            </div>
          </SectionCard>

          <SectionCard icon={Building} title="Work Experience">
            <div className="space-y-6">
              <PreviewTagGroup
                title="Experience Level"
                items={
                  experienceLevel
                    ? [getExperienceLevelLabel(experienceLevel)]
                    : []
                }
                tone="purple"
                emptyText="No experience level selected"
              />
              <PreviewField
                label="Required Experience Years"
                value={reqExpYears}
              />
            </div>
          </SectionCard>

          <SectionCard icon={Medal} title="Skills">
            <PreviewSkillSection title="Skills" items={selectedSkills} />
          </SectionCard>

          <SectionCard icon={ReceiptText} title="Job Description">
            <div className="space-y-4">
              <PreviewField label="Deadline" value={deadline} />
              <PreviewLongText label="Description" value={description} />
              <PreviewLongText label="Requirements" value={requirements} />
              <PreviewLongText
                label="Responsibilities"
                value={responsibilities}
              />
            </div>
          </SectionCard>

          <ActionBar
            isPending={submitMutation.isPending}
            onPreview={() => setIsPreview(false)}
            onSubmit={() => void handleSubmit()}
            previewLabel="Edit"
            previewIcon={<EyeOff size={16} />}
          />
        </div>
        <AlertDialog
          open={pendingPayload !== null}
          onOpenChange={(open) => {
            if (!open && !isSubmittingRef.current) setPendingPayload(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Post this job?</AlertDialogTitle>
              <AlertDialogDescription>
                This will publish the listing and make it visible to applicants.
                You can manage it from your posted jobs.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setPendingPayload(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  void confirmSubmit();
                }}
                disabled={submitMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {submitMutation.isPending ? "Posting..." : "Yes, Post Job"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ─── Edit mode ──────────────────────────────────────────────────────────
  return (
    <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
      <div className="space-y-6">
        {/* ─── Job Introduction ──────────────────────────────────── */}
        <SectionCard icon={Briefcase} title="Job Introduction">
          <div className="space-y-4">
            <FloatingInput
              id="title"
              label="Job Title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                clearError("title");
              }}
              placeholder="e.g. Frontend Developer"
              required
              error={errors.title}
            />
            <div className="space-y-1.5">
              <div className="mb-2 inline-flex items-center gap-1">
                <p
                  className={`text-sm font-medium ${
                    errors.technicalDomain ? "text-red-600" : "text-neutral-800"
                  }`}
                >
                  Technical Domain
                </p>
                <span className="text-red-700 text-base font-semibold">*</span>
              </div>
              <Select
                value={technicalDomain}
                onValueChange={(value) => {
                  setTechnicalDomain(value as TechnicalDomain);
                  clearError("technicalDomain");
                }}
              >
                <SelectTrigger
                  className={`w-full ${
                    errors.technicalDomain ? "border-red-300" : ""
                  }`}
                >
                  <SelectValue placeholder="Select a domain" />
                </SelectTrigger>
                <SelectContent>
                  {TECHNICAL_DOMAIN_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.technicalDomain && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.technicalDomain}
                </p>
              )}
            </div>
            <FloatingInput
              id="domain"
              label="Domain"
              value={domain}
              onChange={(event) => setDomain(event.target.value)}
              placeholder="e.g. Technology"
            />
            <FloatingInput
              id="contactMail"
              label="Contact Email"
              value={contactMail}
              onChange={(event) => setContactMail(event.target.value)}
              placeholder="jobs@company.com"
              type="email"
            />
          </div>
        </SectionCard>

        {/* ─── Job Type & Work Mode ─────────────────────────────── */}
        <SectionCard icon={IdCard} title="Job Type & Work Mode">
          <div className="space-y-4">
            <EnumSelectField
              label="Job Type"
              value={jobType}
              options={JOB_TYPE_OPTIONS}
              placeholder="Select job type"
              required
              error={errors.jobType}
              onChange={(value) => {
                setJobType(value as JobType);
                clearError("jobType");
              }}
            />
            <EnumSelectField
              label="Work Mode"
              value={workMode}
              options={WORK_MODE_OPTIONS_FOR_FORM}
              placeholder="Select work mode"
              required
              error={errors.workMode}
              onChange={(value) => {
                setWorkMode(value as WorkMode);
                clearError("workMode");
              }}
            />
            {(errors.jobType || errors.workMode) && (
              <p className="text-red-500 text-xs">
                {errors.jobType || errors.workMode}
              </p>
            )}
            <BadgeList
              items={jobTypeWorkModeBadges}
              onRemove={(item) => {
                if (item === jobType) setJobType("");
                else if (item === workMode) setWorkMode("");
              }}
              getLabel={(value) => {
                const jobTypeLabel = JOB_TYPE_OPTIONS.find(
                  (o) => o.value === value,
                )?.label;
                if (jobTypeLabel) return jobTypeLabel;
                const workModeLabel = WORK_MODE_OPTIONS_FOR_FORM.find(
                  (o) => o.value === value,
                )?.label;
                return workModeLabel ?? value;
              }}
            />
          </div>
        </SectionCard>

        {/* ─── Work Location ────────────────────────────────────── */}
        <SectionCard icon={Building} title="Work Location">
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <FloatingInput
                id="country"
                label="Country"
                value={country}
                onChange={(event) => {
                  setCountry(event.target.value);
                  clearError("country");
                }}
                placeholder="e.g. Egypt"
                required
                error={errors.country}
              />
              <FloatingInput
                id="city"
                label="City"
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  clearError("city");
                }}
                placeholder="e.g. Cairo"
                required
                error={errors.city}
              />
            </div>
            <FloatingInput
              id="street"
              label="Street"
              value={street}
              onChange={(event) => setStreet(event.target.value)}
              placeholder="e.g. Tahrir Street"
            />
          </div>
        </SectionCard>

        {/* ─── Salary & Benefits ─────────────────────────────────── */}
        <SectionCard icon={HandHelping} title="Salary & Benefits">
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <FloatingInput
                id="minSalary"
                label="Minimum Salary Amount"
                value={minSalary}
                onChange={(event) => {
                  setMinSalary(event.target.value);
                  clearError("minSalary");
                }}
                placeholder="e.g. 5000"
                type="number"
                error={errors.minSalary}
              />
              <FloatingInput
                id="salaryCurrency"
                label="Salary Currency"
                value={salaryCurrency}
                onChange={(event) => setSalaryCurrency(event.target.value)}
                placeholder="e.g. EGP"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <CircleHelp size={16} className="text-neutral-400" />
              <span>What is the fair salary range for this field?</span>
            </div>
          </div>
        </SectionCard>

        {/* ─── Work Experience ───────────────────────────────────── */}
        <SectionCard icon={Building} title="Work Experience">
          <div className="space-y-6">
            <div>
              <EnumSelectField
                label="Experience Level"
                value={experienceLevel}
                options={EXPERIENCE_LEVEL_OPTIONS}
                placeholder="Select experience level"
                required
                error={errors.experienceLevel}
                onChange={(value) => {
                  setExperienceLevel(value as ExperienceLevel);
                  clearError("experienceLevel");
                }}
              />
              <div className="mt-3">
                <BadgeList
                  items={experienceLevel ? [experienceLevel] : []}
                  onRemove={() => setExperienceLevel("")}
                  getLabel={getExperienceLevelLabel}
                />
              </div>
            </div>
            <FloatingInput
              id="reqExpYears"
              label="Required Experience Years"
              value={reqExpYears}
              onChange={(event) => {
                setReqExpYears(event.target.value);
                clearError("reqExpYears");
              }}
              placeholder="e.g. 2"
              type="number"
              error={errors.reqExpYears}
            />
          </div>
        </SectionCard>

        {/* ─── Skills ────────────────────────────────────────────── */}
        <SectionCard icon={Medal} title="Skills">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-base font-medium text-neutral-800">
                Skills
              </p>
              <SkillSearchSelect
                skillsData={skillsData}
                selected={selectedSkills}
                onAdd={(skill) => {
                  if (!selectedSkills.find((s) => s.id === skill.id)) {
                    setSelectedSkills([
                      ...selectedSkills,
                      {
                        id: skill.id,
                        name: skill.name,
                        level: "" as DifficultyLevel,
                      },
                    ]);
                  }
                }}
              />
              <div className="mt-3">
                <BadgeList
                  items={selectedSkills.map((s) => s.name)}
                  onRemove={(name) => {
                    setSelectedSkills(
                      selectedSkills.filter((s) => s.name !== name),
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* ─── Job Description ───────────────────────────────────── */}
        <SectionCard icon={ReceiptText} title="Job Description">
          <div className="space-y-4">
            <FloatingInput
              id="deadline"
              label="Deadline"
              value={deadline}
              onChange={(event) => {
                setDeadline(event.target.value);
                clearError("deadline");
              }}
              type="date"
              required
              error={errors.deadline}
            />
            <FloatingTextArea
              id="description"
              label="Description"
              value={description}
              onChange={(event) => {
                setDescription(event.target.value);
                clearError("description");
              }}
              placeholder="Describe the role and team context..."
              maxLength={1000}
              required
              error={errors.description}
            />
            <FloatingTextArea
              id="requirements"
              label="Requirements"
              value={requirements}
              onChange={(event) => {
                setRequirements(event.target.value);
                clearError("requirements");
              }}
              placeholder="List qualifications, tools, and must-have skills..."
              maxLength={1000}
              required
              error={errors.requirements}
            />
            <FloatingTextArea
              id="responsibilities"
              label="Responsibilities"
              value={responsibilities}
              onChange={(event) => {
                setResponsibilities(event.target.value);
                clearError("responsibilities");
              }}
              placeholder="List day-to-day responsibilities..."
              maxLength={1000}
              required
              error={errors.responsibilities}
            />
          </div>
        </SectionCard>

        <ActionBar
          isPending={submitMutation.isPending}
          onPreview={() => {
            if (validate()) setIsPreview(true);
          }}
          onSubmit={() => void handleSubmit()}
          previewLabel="Preview"
          previewIcon={<Eye size={16} />}
        />
      </div>
      <AlertDialog
        open={pendingPayload !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmittingRef.current) setPendingPayload(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish the listing and make it visible to applicants.
              You can manage it from your posted jobs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingPayload(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmSubmit();
              }}
              disabled={submitMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitMutation.isPending ? "Posting..." : "Yes, Post Job"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EnumSelectField({
  label,
  value,
  options,
  placeholder,
  required = false,
  error,
  onChange,
}: {
  label: string;
  value: string;
  options: readonly EnumOption[];
  placeholder: string;
  required?: boolean;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1.5">
      <div className="mb-2 inline-flex items-center gap-1">
        <p
          className={`text-sm font-medium ${
            error ? "text-red-600" : "text-neutral-800"
          }`}
        >
          {label}
        </p>
        {required && (
          <span className="text-red-700 text-base font-semibold">*</span>
        )}
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className={`w-full ${error ? "border-red-300" : ""}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

function ActionBar({
  isPending,
  onPreview,
  onSubmit,
  previewLabel,
  previewIcon,
}: {
  isPending: boolean;
  onPreview: () => void;
  onSubmit: () => void;
  previewLabel: string;
  previewIcon: React.ReactNode;
}) {
  return (
    <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-3 rounded-xl border border-neutral-200 bg-white p-4">
      <Button
        type="button"
        variant="outline"
        onClick={onPreview}
        className="flex items-center gap-2"
      >
        {previewIcon}
        {previewLabel}
      </Button>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isPending}
        className="flex items-center gap-2"
      >
        {isPending ? "Posting..." : "Post Job"}
      </Button>
    </div>
  );
}

function PreviewField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-medium text-neutral-500 mb-1">{label}</p>
      <p className="text-sm text-neutral-800">{value || "-"}</p>
    </div>
  );
}

function PreviewLongText({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="mb-1 text-sm font-medium text-neutral-700">{label}</p>
      {value ? (
        <p className="whitespace-pre-wrap text-sm text-neutral-800 leading-6">
          {value}
        </p>
      ) : (
        <p className="text-sm text-neutral-400">
          No {label.toLowerCase()} provided
        </p>
      )}
    </div>
  );
}

function PreviewBadge({
  value,
  tone,
}: {
  value: string;
  tone: "amber" | "blue" | "emerald" | "neutral" | "purple" | "teal";
}) {
  const toneClass = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    neutral: "bg-neutral-100 text-neutral-600",
    purple: "bg-purple-50 text-purple-700",
    teal: "bg-teal-50 text-teal-700",
  }[tone];

  return (
    <span className={`rounded-lg px-3 py-1.5 text-sm font-medium ${toneClass}`}>
      {value}
    </span>
  );
}

function PreviewTagGroup({
  title,
  items,
  tone,
  emptyText,
}: {
  title: string;
  items: readonly string[];
  tone: "neutral" | "purple" | "teal";
  emptyText: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-700">{title}</p>
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => (
            <PreviewBadge key={item} tone={tone} value={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-neutral-400">{emptyText}</p>
      )}
    </div>
  );
}

function PreviewSkillSection({
  title,
  items,
}: {
  title: string;
  items: SelectedSkill[];
}) {
  if (items.length === 0) {
    return (
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-700">{title}</p>
        <p className="text-sm text-neutral-400">
          No {title.toLowerCase()} added
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-700">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={`${item.id}-${item.name}`}
            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
          >
            {item.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function SkillSearchSelect({
  skillsData,
  selected,
  onAdd,
}: {
  skillsData: SkillResponse[];
  selected: SelectedSkill[];
  onAdd: (skill: SkillResponse) => void;
}) {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedIds = new Set(selected.map((s) => s.id));

  const filtered = skillsData.filter((skill) =>
    skill.name.toLowerCase().includes(search.toLowerCase().trim()),
  );

  const showDropdown = isFocused;

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        placeholder="Search skills..."
        className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
      />
      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-neutral-200 bg-white max-h-52 overflow-y-auto shadow-md">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-neutral-400">
              No skills found
            </div>
          ) : (
            filtered.map((skill) => {
              const isAlreadySelected = selectedIds.has(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  disabled={isAlreadySelected}
                  onClick={() => {
                    if (!isAlreadySelected) {
                      onAdd(skill);
                      setSearch("");
                    }
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm first:rounded-t-xl last:rounded-b-xl ${
                    isAlreadySelected
                      ? "text-neutral-400 cursor-default"
                      : "text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                  }`}
                >
                  <span>{skill.name}</span>
                  {isAlreadySelected && (
                    <Check size={16} className="text-emerald-600" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
