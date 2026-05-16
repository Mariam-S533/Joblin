"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  IdCard,
  MapPin,
  HandHelping,
  ReceiptText,
  GraduationCap,
  UserPlus,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { CheckboxOptionGroup } from "@/components/job-post/CheckboxOptionGroup";
import { getErrorMessage } from "@/lib/apiClient/error";
import { useCoursePostTemplate, useSubmitCoursePost } from "@/hooks/coursePost";
import type {
  CourseBenefit,
  CoursePostPayload,
  CoursePostTemplate,
  DeliveryMode,
  DifficultyLevel,
} from "@/features/course-post/types";
import {
  DIFFICULTY_LEVEL_OPTIONS,
  getDifficultyLevelLabel,
} from "@/features/course-post/types";

type CoursePostLocalState = CoursePostTemplate;

const emptyState: CoursePostLocalState = {
  courseTitle: "",
  courseCategory: "",
  organizationIndustry: "",
  courseLevel: "",
  courseLevelOptions: DIFFICULTY_LEVEL_OPTIONS,
  deliveryModes: ["Online", "In Person", "Hybrid", "Self-Paced"],
  selectedDeliveryModes: [],
  country: "",
  city: "",
  priceAmount: "",
  displayPriceInPost: false,
  benefits: ["Online Access", "Certificate", "Lifetime Access"],
  selectedBenefits: [],
  skills: [],
  learningOutcomes: [],
  courseDescription: "",
  duration: "",
  maxStudents: "",
  startDate: "",
  endDate: "",
  instructorName: "",
  instructorBio: "",
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
  const [state, setState] = useState<CoursePostLocalState>(emptyState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [outcomeInput, setOutcomeInput] = useState("");

  const templateQuery = useCoursePostTemplate();
  const submitMutation = useSubmitCoursePost();

  useEffect(() => {
    if (templateQuery.data) {
      setState(templateQuery.data);
    }
  }, [templateQuery.data]);

  const templateError = templateQuery.error
    ? getErrorMessage(
        templateQuery.error,
        "Failed to load post course template.",
      )
    : null;

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

  const toggleSelection = <T extends string>(
    option: T,
    selected: readonly T[],
    setSelected: (next: T[]) => void,
  ) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  const toggleDeliveryMode = (value: DeliveryMode) => {
    toggleSelection(value, state.selectedDeliveryModes, (next) =>
      updateField("selectedDeliveryModes", next),
    );
  };

  const toggleBenefit = (value: CourseBenefit) => {
    toggleSelection(value, state.selectedBenefits, (next) =>
      updateField("selectedBenefits", next),
    );
  };

  const handleDisplayPriceChange = (checked: boolean) => {
    updateField("displayPriceInPost", checked);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed || state.skills.includes(trimmed)) return;
    updateField("skills", [...state.skills, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (item: string) => {
    updateField(
      "skills",
      state.skills.filter((value) => value !== item),
    );
  };

  const addLearningOutcome = () => {
    const trimmed = outcomeInput.trim();
    if (!trimmed || state.learningOutcomes.includes(trimmed)) return;
    updateField("learningOutcomes", [...state.learningOutcomes, trimmed]);
    setOutcomeInput("");
  };

  const removeLearningOutcome = (item: string) => {
    updateField(
      "learningOutcomes",
      state.learningOutcomes.filter((value) => value !== item),
    );
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!state.courseTitle.trim())
      newErrors.courseTitle = "Course title is required";
    if (!state.courseCategory.trim())
      newErrors.courseCategory = "Course category is required";
    if (!state.organizationIndustry.trim())
      newErrors.organizationIndustry = "Organization industry is required";
    if (!state.courseLevel.trim())
      newErrors.courseLevel = "Course level is required";
    if (state.selectedDeliveryModes.length === 0)
      newErrors.selectedDeliveryModes = "Select at least one delivery mode";
    if (!state.country.trim()) newErrors.country = "Country is required";
    if (!state.city.trim()) newErrors.city = "City is required";
    if (!state.priceAmount.trim())
      newErrors.priceAmount = "Price amount is required";
    if (!state.courseDescription.trim())
      newErrors.courseDescription = "Course description is required";
    if (!state.duration.trim()) newErrors.duration = "Duration is required";
    if (!state.maxStudents.trim())
      newErrors.maxStudents = "Maximum students is required";
    if (!state.startDate.trim()) newErrors.startDate = "Start date is required";
    if (!state.endDate.trim()) newErrors.endDate = "End date is required";
    if (!state.instructorName.trim())
      newErrors.instructorName = "Instructor name is required";
    if (!state.instructorBio.trim())
      newErrors.instructorBio = "Instructor bio is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) return;

    try {
      const {
        courseLevelOptions,
        deliveryModes,
        benefits,
        courseLevel,
        ...rest
      } = state;
      const payload: CoursePostPayload = {
        ...rest,
        courseLevel: courseLevel as DifficultyLevel,
      };
      const response = await submitMutation.mutateAsync(payload);
      setSuccessMessage(response.message);
      setErrors({});
      setIsPreview(false);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to submit course post."));
    }
  };

  if (templateQuery.isLoading) {
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

            {(templateError || errorMessage) && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {templateError || errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            )}

            <SectionCard
              icon={Briefcase}
              title="Course Introduction"
              className="rounded-lg"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <PreviewField label="Course Title" value={state.courseTitle} />
                <PreviewField
                  label="Course Category"
                  value={state.courseCategory}
                />
                <PreviewField
                  label="Organization Industry"
                  value={state.organizationIndustry}
                />
                <PreviewField
                  label="Course Level"
                  value={
                    state.courseLevel
                      ? getDifficultyLevelLabel(
                          state.courseLevel as DifficultyLevel,
                        )
                      : ""
                  }
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={IdCard}
              title="Delivery Mode"
              className="rounded-lg"
            >
              <PreviewTagList
                items={state.selectedDeliveryModes}
                emptyLabel="No delivery mode selected"
              />
            </SectionCard>

            <SectionCard icon={MapPin} title="Location" className="rounded-lg">
              <div className="grid gap-3 md:grid-cols-2">
                <PreviewField label="Country" value={state.country} />
                <PreviewField label="City" value={state.city} />
              </div>
            </SectionCard>

            <SectionCard
              icon={HandHelping}
              title="Price & Benefits"
              className="rounded-lg"
            >
              <div className="space-y-3">
                <PreviewField label="Price Amount" value={state.priceAmount} />
                {state.displayPriceInPost && (
                  <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                    Price displayed in post
                  </span>
                )}
                <PreviewTagList
                  items={state.selectedBenefits}
                  emptyLabel="No benefits selected"
                />
              </div>
            </SectionCard>

            <SectionCard
              icon={HandHelping}
              title="Skills"
              className="rounded-lg"
            >
              <PreviewTagList
                items={state.skills}
                emptyLabel="No skills added"
                tagClassName="bg-neutral-100 text-neutral-700"
              />
            </SectionCard>

            <SectionCard
              icon={ReceiptText}
              title="Course Description"
              className="rounded-lg"
            >
              {state.courseDescription ? (
                <p className="whitespace-pre-wrap text-sm text-neutral-800 leading-6">
                  {state.courseDescription}
                </p>
              ) : (
                <p className="text-sm text-neutral-400">
                  No description provided
                </p>
              )}
            </SectionCard>

            <SectionCard
              icon={MapPin}
              title="Duration & Schedule"
              className="rounded-lg"
            >
              <div className="grid gap-3 md:grid-cols-2">
                <PreviewField label="Duration" value={state.duration} />
                <PreviewField
                  label="Maximum Student"
                  value={state.maxStudents}
                />
                <PreviewField label="Start Date" value={state.startDate} />
                <PreviewField label="End Date" value={state.endDate} />
              </div>
            </SectionCard>

            <SectionCard
              icon={GraduationCap}
              title="Learning Outcomes"
              className="rounded-lg"
            >
              <PreviewTagList
                items={state.learningOutcomes}
                emptyLabel="No learning outcomes added"
                tagClassName="bg-indigo-50 text-indigo-700"
              />
            </SectionCard>

            <SectionCard
              icon={UserPlus}
              title="Instructor Information"
              className="rounded-lg"
            >
              <div className="space-y-3">
                <PreviewField
                  label="Instructor Name"
                  value={state.instructorName}
                />
                {state.instructorBio ? (
                  <div>
                    <p className="mb-1 text-xs font-medium text-neutral-500">
                      Instructor Bio
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-neutral-800 leading-6">
                      {state.instructorBio}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">No bio provided</p>
                )}
              </div>
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
      {(templateError || errorMessage) && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {templateError || errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {successMessage}
        </div>
      )}

      <div className="rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="space-y-6">
          <SectionCard
            icon={Briefcase}
            title="Course Introduction"
            className="rounded-lg"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FloatingInput
                id="courseTitle"
                label="Course title"
                value={state.courseTitle}
                onChange={(e) => updateField("courseTitle", e.target.value)}
                placeholder="Please Type Your Course Title"
                required
                error={errors.courseTitle}
              />
              <FloatingInput
                id="courseCategory"
                label="Course category"
                value={state.courseCategory}
                onChange={(e) => updateField("courseCategory", e.target.value)}
                placeholder="Please type your job category"
                required
                error={errors.courseCategory}
              />
              <FloatingInput
                id="organizationIndustry"
                label="Organization industry"
                value={state.organizationIndustry}
                onChange={(e) =>
                  updateField("organizationIndustry", e.target.value)
                }
                placeholder="Please type your organization industry"
                required
                error={errors.organizationIndustry}
              />
              <div className="space-y-1.5">
                <Label
                  htmlFor="courseLevel"
                  className="text-sm font-medium text-neutral-700"
                >
                  Course level
                </Label>
                <Select
                  value={state.courseLevel || undefined}
                  onValueChange={(value: string) =>
                    updateField("courseLevel", value as DifficultyLevel | "")
                  }
                >
                  <SelectTrigger
                    id="courseLevel"
                    className="w-full h-12 border-neutral-300 focus:border-emerald-500 focus:ring-emerald-500"
                  >
                    <SelectValue placeholder="Select course level" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.courseLevelOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.courseLevel && (
                  <p className="text-xs text-red-500">{errors.courseLevel}</p>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={IdCard}
            title="Delivery Mode"
            className="rounded-lg"
          >
            <CheckboxOptionGroup
              options={state.deliveryModes}
              selected={state.selectedDeliveryModes}
              onToggle={toggleDeliveryMode}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
              error={errors.selectedDeliveryModes}
            />
          </SectionCard>

          <SectionCard icon={MapPin} title="Location" className="rounded-lg">
            <div className="grid gap-6 md:grid-cols-2">
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
            </div>
          </SectionCard>

          <SectionCard
            icon={HandHelping}
            title="Price & Benefits"
            className="rounded-lg"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <FloatingInput
                  id="priceAmount"
                  label="Price Amount"
                  value={state.priceAmount}
                  onChange={(e) => updateField("priceAmount", e.target.value)}
                  placeholder="input"
                  required
                  error={errors.priceAmount}
                />
                <p className="text-xs text-neutral-400">
                  Amount is by doller / Monthly
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
                <Checkbox
                  id="displayPrice"
                  checked={state.displayPriceInPost}
                  onCheckedChange={(checked) =>
                    handleDisplayPriceChange(checked === true)
                  }
                />
                <Label
                  htmlFor="displayPrice"
                  className="text-xs font-semibold text-neutral-800 cursor-pointer"
                >
                  Displaying salary in the Course post
                </Label>
              </div>
              <p className="text-xs text-neutral-500">
                Course listings that transparently display their price receive
                45% more enrollments on average.
              </p>
              <CheckboxOptionGroup
                options={state.benefits}
                selected={state.selectedBenefits}
                onToggle={toggleBenefit}
                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
              />
            </div>
          </SectionCard>

          <SectionCard icon={HandHelping} title="Skills" className="rounded-lg">
            <TagComposer
              label="Skill Covered"
              placeholder="Type skill to add"
              value={skillInput}
              onChange={setSkillInput}
              onAdd={addSkill}
              items={state.skills}
              onRemove={removeSkill}
            />
          </SectionCard>

          <SectionCard
            icon={ReceiptText}
            title="Course Description"
            className="rounded-lg"
          >
            <FloatingTextArea
              id="courseDescription"
              label="Description"
              value={state.courseDescription}
              onChange={(e) => updateField("courseDescription", e.target.value)}
              placeholder="write your description company"
              maxLength={512}
              required
              error={errors.courseDescription}
            />
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
                id="maxStudents"
                label="Maximum Student"
                value={state.maxStudents}
                onChange={(e) => updateField("maxStudents", e.target.value)}
                placeholder="30"
                required
                error={errors.maxStudents}
              />
              <FloatingInput
                id="startDate"
                label="Start Date"
                value={state.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
                placeholder="Feb 1, 2025"
                required
                error={errors.startDate}
              />
              <FloatingInput
                id="endDate"
                label="End Date"
                value={state.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                placeholder="May 1, 2025"
                required
                error={errors.endDate}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={GraduationCap}
            title="Learning Outcomes"
            className="rounded-lg"
          >
            <TagComposer
              label="Learning Outcome"
              placeholder="Type Learning Outcome to add"
              value={outcomeInput}
              onChange={setOutcomeInput}
              onAdd={addLearningOutcome}
              items={state.learningOutcomes}
              onRemove={removeLearningOutcome}
            />
          </SectionCard>

          <SectionCard
            icon={UserPlus}
            title="Instructor Information"
            className="rounded-lg"
          >
            <div className="space-y-4">
              <FloatingInput
                id="instructorName"
                label="Instructor Name"
                value={state.instructorName}
                onChange={(e) => updateField("instructorName", e.target.value)}
                placeholder="Please Type Your Course Title"
                required
                error={errors.instructorName}
              />
              <FloatingTextArea
                id="instructorBio"
                label="Instructor Bio"
                value={state.instructorBio}
                onChange={(e) => updateField("instructorBio", e.target.value)}
                placeholder="Brief instructor bio including experience, credentials, and expertise..."
                maxLength={512}
                required
                error={errors.instructorBio}
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
    </div>
  );
}

function TagComposer({
  label,
  placeholder,
  value,
  onChange,
  onAdd,
  items,
  onRemove,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  onAdd: () => void;
  items: string[];
  onRemove: (item: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-sm font-medium text-neutral-800">{label}</div>
        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-12"
          />
          <Button type="button" onClick={onAdd} className="h-12">
            Add
          </Button>
        </div>
      </div>
      {items.length > 0 && <BadgeList items={items} onRemove={onRemove} />}
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
