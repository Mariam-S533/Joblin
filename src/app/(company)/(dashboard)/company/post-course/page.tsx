"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Briefcase,
  Check,
  IdCard,
  MapPin,
  HandHelping,
  ReceiptText,
  GraduationCap,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FloatingInput } from "@/components/FloatingInputField";
import { FloatingTextArea } from "@/components/FloatingTextAreaField";
import { SectionCard } from "@/components/SectionCard";
import { BadgeList } from "@/components/job-post/BadgeList";
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
import { useSubmitCoursePost } from "@/hooks/coursePost";
import { useSkills } from "@/hooks/skills";
import type {
  CoursePostFormState,
  CoursePostPayload,
  DeliveryMode,
  DifficultyLevel,
  TechnicalDomain,
} from "@/features/course-post/types";
import {
  DELIVERY_MODE_OPTIONS,
  DIFFICULTY_LEVEL_OPTIONS,
  TECHNICAL_DOMAIN_OPTIONS,
  getDifficultyLevelLabel,
  getTechnicalDomainLabel,
} from "@/features/course-post/types";
import type { SelectedSkill, SkillResponse } from "@/features/job-post/types";

type CoursePostLocalState = CoursePostFormState;

const emptyState: CoursePostLocalState = {
  title: "",
  technicalDomain: "",
  difficultyLevel: "",
  deliveryMode: "",
  country: "",
  city: "",
  street: "",
  duration: "",
  enrollmentUrl: "",
  outcomeDescription: "",
  description: "",
  price: "",
  currency: "",
  hasCertificate: false,
  startDate: "",
  endDate: "",
  deadline: "",
};

export default function PostCoursePage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login/company");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="space-y-4">
        <div className="h-16 animate-pulse rounded-xl bg-neutral-200" />
        <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
        <div className="h-64 animate-pulse rounded-xl bg-neutral-100" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-neutral-500">Redirecting to login...</p>
      </div>
    );
  }

  return <PostCourseContent />;
}

function PostCourseContent() {
  const router = useRouter();
  const [state, setState] = useState<CoursePostLocalState>(emptyState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreview, setIsPreview] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<SelectedSkill[]>([]);
  const [pendingPayload, setPendingPayload] =
    useState<CoursePostPayload | null>(null);
  const submitMutation = useSubmitCoursePost();
  const skillsQuery = useSkills();
  const skillsData = skillsQuery.data ?? [];
  const skillsErrorShownRef = useRef(false);
  const isSubmittingRef = useRef(false);

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

  const updateField = <K extends keyof CoursePostLocalState>(
    key: K,
    value: CoursePostLocalState[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleDeliveryModeChange = (value: DeliveryMode) => {
    updateField("deliveryMode", value);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!state.title.trim()) newErrors.title = "Title is required";
    if (!state.technicalDomain.trim())
      newErrors.technicalDomain = "Technical domain is required";
    if (!state.difficultyLevel.trim())
      newErrors.difficultyLevel = "Difficulty level is required";
    if (!state.deliveryMode.trim())
      newErrors.deliveryMode = "Delivery mode is required";
    if (!state.country.trim()) newErrors.country = "Country is required";
    if (!state.city.trim()) newErrors.city = "City is required";
    if (!state.duration.trim()) newErrors.duration = "Duration is required";
    if (!state.enrollmentUrl.trim())
      newErrors.enrollmentUrl = "Enrollment URL is required";
    if (!state.outcomeDescription.trim())
      newErrors.outcomeDescription = "Outcome description is required";
    if (state.price.trim()) {
      const parsed = Number(state.price);
      if (Number.isNaN(parsed)) newErrors.price = "Price must be a number";
    }
    if (state.deadline.trim()) {
      const parsedDeadline = new Date(state.deadline);
      if (Number.isNaN(parsedDeadline.getTime())) {
        newErrors.deadline = "Deadline must be a valid date-time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const parsedPrice = state.price.trim() ? Number(state.price) : null;
      const parsedDeadline = state.deadline.trim()
        ? new Date(state.deadline)
        : null;
      const deadlineIso = parsedDeadline
        ? Number.isNaN(parsedDeadline.getTime())
          ? null
          : parsedDeadline.toISOString()
        : null;
      const providedSkillIds = selectedSkills.map((skill) => skill.id);
      const payload: CoursePostPayload = {
        title: state.title.trim(),
        technicalDomain: state.technicalDomain as TechnicalDomain,
        difficultyLevel: state.difficultyLevel as DifficultyLevel,
        deliveryMode: state.deliveryMode as DeliveryMode,
        country: state.country.trim(),
        city: state.city.trim(),
        duration: state.duration.trim(),
        enrollmentUrl: state.enrollmentUrl.trim(),
        outcomeDescription: state.outcomeDescription.trim(),
        description: state.description.trim() || null,
        street: state.street.trim() || null,
        price: parsedPrice,
        currency: state.currency.trim() || null,
        hasCertificate: state.hasCertificate,
        startDate: state.startDate.trim() || null,
        endDate: state.endDate.trim() || null,
        deadline: deadlineIso,
        providedSkillIds,
      };
      setPendingPayload(payload);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to submit course post."), {
        duration: 5000,
      });
    }
  };

  const confirmSubmit = async () => {
    if (!pendingPayload || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    try {
      await submitMutation.mutateAsync(pendingPayload);
      setPendingPayload(null);
      setErrors({});
      setIsPreview(false);
      toast.success("Course posted successfully", {
        description: "Your listing is now visible to applicants.",
        duration: 4000,
      });
      setTimeout(() => {
        router.push("/company/posted-courses");
      }, 1500);
    } catch (error) {
      setPendingPayload(null);
      toast.error(getErrorMessage(error, "Failed to submit course post."), {
        duration: 5000,
      });
    } finally {
      isSubmittingRef.current = false;
    }
  };

  if (isPreview) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-neutral-800">
                Course Post Preview
              </h1>
              <Button
                variant="outline"
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2"
              >
                <EyeOff size={16} /> Back to Edit
              </Button>
            </div>

            <SectionCard
              icon={Briefcase}
              title="Course Details"
              className="rounded-lg"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <PreviewField label="Title" value={state.title} />
                <PreviewField
                  label="Technical Domain"
                  value={
                    state.technicalDomain
                      ? getTechnicalDomainLabel(
                          state.technicalDomain as TechnicalDomain,
                        )
                      : ""
                  }
                />
                <PreviewField
                  label="Difficulty Level"
                  value={
                    state.difficultyLevel
                      ? getDifficultyLevelLabel(
                          state.difficultyLevel as DifficultyLevel,
                        )
                      : ""
                  }
                />
                <PreviewField
                  label="Delivery Mode"
                  value={state.deliveryMode}
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={IdCard}
              title="Enrollment"
              className="rounded-lg"
            >
              <PreviewField
                label="Enrollment URL"
                value={state.enrollmentUrl}
              />
            </SectionCard>

            <SectionCard icon={MapPin} title="Location" className="rounded-lg">
              <div className="grid gap-3 md:grid-cols-3">
                <PreviewField label="Country" value={state.country} />
                <PreviewField label="City" value={state.city} />
                <PreviewField label="Street" value={state.street} />
              </div>
            </SectionCard>

            <SectionCard
              icon={ReceiptText}
              title="Description & Outcomes"
              className="rounded-lg"
            >
              <div className="space-y-4">
                {state.description ? (
                  <div>
                    <p className="mb-1 text-xs font-medium text-neutral-500">
                      Description
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-neutral-800 leading-6">
                      {state.description}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    No description provided
                  </p>
                )}
                {state.outcomeDescription ? (
                  <div>
                    <p className="mb-1 text-xs font-medium text-neutral-500">
                      Outcome Description
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-neutral-800 leading-6">
                      {state.outcomeDescription}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    No outcome description provided
                  </p>
                )}
              </div>
            </SectionCard>

            <SectionCard
              icon={MapPin}
              title="Duration & Schedule"
              className="rounded-lg"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <PreviewField label="Duration" value={state.duration} />
                <PreviewField label="Start Date" value={state.startDate} />
                <PreviewField label="End Date" value={state.endDate} />
                <PreviewField label="Deadline" value={state.deadline} />
              </div>
            </SectionCard>

            <SectionCard
              icon={HandHelping}
              title="Price & Certificate"
              className="rounded-lg"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <PreviewField
                  label="Price"
                  value={
                    state.price
                      ? `${state.price}${state.currency ? ` ${state.currency}` : ""}`
                      : ""
                  }
                />
                <PreviewField
                  label="Certificate"
                  value={state.hasCertificate ? "Yes" : "No"}
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={GraduationCap}
              title="Skills"
              className="rounded-lg"
            >
              <PreviewTagList
                items={selectedSkills.map((skill) => skill.name)}
                emptyLabel="No skills selected"
                tagClassName="bg-neutral-100 text-neutral-700"
              />
            </SectionCard>

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPreview(false)}
                className="flex items-center gap-2"
              >
                <EyeOff size={16} /> Edit
              </Button>
              <Button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitMutation.isPending}
                className="flex items-center gap-2"
              >
                {submitMutation.isPending ? "Posting..." : "Post Course"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="space-y-6">
          <SectionCard
            icon={Briefcase}
            title="Course Details"
            className="rounded-lg"
          >
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-3">
                <FloatingInput
                  id="title"
                  label="Title"
                  value={state.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Please type course title"
                  required
                  error={errors.title}
                />
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="technicalDomain"
                  className="text-sm font-medium text-neutral-700"
                >
                  Technical domain
                </Label>
                <Select
                  value={state.technicalDomain || undefined}
                  onValueChange={(value: string) =>
                    updateField(
                      "technicalDomain",
                      value as TechnicalDomain | "",
                    )
                  }
                >
                  <SelectTrigger
                    id="technicalDomain"
                    className="w-full h-12 border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <SelectValue placeholder="Select technical domain" />
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
                  <p className="text-xs text-red-500">
                    {errors.technicalDomain}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="difficultyLevel"
                  className="text-sm font-medium text-neutral-700"
                >
                  Difficulty level
                </Label>
                <Select
                  value={state.difficultyLevel || undefined}
                  onValueChange={(value: string) =>
                    updateField(
                      "difficultyLevel",
                      value as DifficultyLevel | "",
                    )
                  }
                >
                  <SelectTrigger
                    id="difficultyLevel"
                    className="w-full h-12 border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <SelectValue placeholder="Select difficulty level" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVEL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.difficultyLevel && (
                  <p className="text-xs text-red-500">
                    {errors.difficultyLevel}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label
                  htmlFor="deliveryMode"
                  className="text-sm font-medium text-neutral-700"
                >
                  Delivery mode
                </Label>
                <Select
                  value={state.deliveryMode || undefined}
                  onValueChange={(value: string) =>
                    handleDeliveryModeChange(value as DeliveryMode)
                  }
                >
                  <SelectTrigger
                    id="deliveryMode"
                    className="w-full h-12 border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <SelectValue placeholder="Select delivery mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {DELIVERY_MODE_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.deliveryMode && (
                  <p className="text-xs text-red-500">{errors.deliveryMode}</p>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={IdCard} title="Enrollment" className="rounded-lg">
            <FloatingInput
              id="enrollmentUrl"
              label="Enrollment URL"
              value={state.enrollmentUrl}
              onChange={(e) => updateField("enrollmentUrl", e.target.value)}
              placeholder="https://..."
              type="url"
              required
              error={errors.enrollmentUrl}
            />
          </SectionCard>

          <SectionCard icon={MapPin} title="Location" className="rounded-lg">
            <div className="grid gap-6 md:grid-cols-3">
              <FloatingInput
                id="country"
                label="Country"
                value={state.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Input"
                required
                error={errors.country}
              />
              <FloatingInput
                id="city"
                label="City"
                value={state.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Input"
                required
                error={errors.city}
              />
              <FloatingInput
                id="street"
                label="Street"
                value={state.street}
                onChange={(e) => updateField("street", e.target.value)}
                placeholder="Optional"
                error={errors.street}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={HandHelping}
            title="Price & Certificate"
            className="rounded-lg"
          >
            <div className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2">
                <FloatingInput
                  id="price"
                  label="Price"
                  value={state.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="Optional"
                  type="number"
                  error={errors.price}
                />
                <FloatingInput
                  id="currency"
                  label="Currency"
                  value={state.currency}
                  onChange={(e) => updateField("currency", e.target.value)}
                  placeholder="Optional"
                  error={errors.currency}
                />
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
                <Checkbox
                  id="hasCertificate"
                  checked={state.hasCertificate}
                  onCheckedChange={(checked) =>
                    updateField("hasCertificate", checked === true)
                  }
                />
                <Label
                  htmlFor="hasCertificate"
                  className="text-xs font-semibold text-neutral-800 cursor-pointer"
                >
                  Certificate available
                </Label>
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={GraduationCap}
            title="Skills"
            className="rounded-lg"
          >
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

          <SectionCard
            icon={ReceiptText}
            title="Course Description"
            className="rounded-lg"
          >
            <div className="space-y-6">
              <FloatingTextArea
                id="description"
                label="Description"
                value={state.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Write a short description"
                maxLength={2000}
                error={errors.description}
              />
              <FloatingTextArea
                id="outcomeDescription"
                label="Outcome Description"
                value={state.outcomeDescription}
                onChange={(e) =>
                  updateField("outcomeDescription", e.target.value)
                }
                placeholder="Describe expected outcomes"
                maxLength={2000}
                required
                error={errors.outcomeDescription}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={MapPin}
            title="Duration & Schedule"
            className="rounded-lg"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FloatingInput
                id="duration"
                label="Duration"
                value={state.duration}
                onChange={(e) => updateField("duration", e.target.value)}
                placeholder="12 Weeks"
                required
                error={errors.duration}
              />
              <FloatingInput
                id="startDate"
                label="Start Date"
                value={state.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                placeholder="YYYY-MM-DD"
                type="date"
                error={errors.startDate}
              />
              <FloatingInput
                id="endDate"
                label="End Date"
                value={state.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                placeholder="YYYY-MM-DD"
                type="date"
                error={errors.endDate}
              />
              <FloatingInput
                id="deadline"
                label="Deadline"
                value={state.deadline}
                onChange={(e) => updateField("deadline", e.target.value)}
                placeholder="YYYY-MM-DDTHH:mm"
                type="datetime-local"
                error={errors.deadline}
              />
            </div>
          </SectionCard>

          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (validate()) setIsPreview(true);
              }}
              className="flex items-center gap-2"
            >
              <Eye size={16} /> Preview
            </Button>
            <Button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={submitMutation.isPending}
              className="flex items-center gap-2"
            >
              {submitMutation.isPending ? "Posting..." : "Post Course"}
            </Button>
          </div>
        </div>
      </div>
      <AlertDialog
        open={pendingPayload !== null}
        onOpenChange={(open) => {
          if (!open && !isSubmittingRef.current) setPendingPayload(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Post this course?</AlertDialogTitle>
            <AlertDialogDescription>
              This will publish the listing and make it visible to applicants.
              You can manage it from your posted courses.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingPayload(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void confirmSubmit();
              }}
              disabled={submitMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {submitMutation.isPending ? "Posting..." : "Yes, Post Course"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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

function PreviewTagList({
  items,
  emptyLabel,
  tagClassName,
}: {
  items: readonly string[];
  emptyLabel: string;
  tagClassName?: string;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-neutral-400">{emptyLabel}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            tagClassName ?? "bg-emerald-50 text-emerald-700"
          }`}
        >
          {item}
        </span>
      ))}
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

  const selectedIds = new Set(selected.map((skill) => skill.id));

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
