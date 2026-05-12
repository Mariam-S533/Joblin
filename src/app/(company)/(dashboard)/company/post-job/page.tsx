"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Briefcase,
  Building,
  Eye,
  EyeOff,
  HandHelping,
  IdCard,
  Medal,
  ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FloatingInput } from "@/components/FloatingInputField";
import { FloatingTextArea } from "@/components/FloatingTextAreaField";
import { SectionCard } from "@/components/SectionCard";
import { BadgeList } from "@/components/job-post/BadgeList";
import { CheckboxOptionGroup } from "@/components/job-post/CheckboxOptionGroup";
import { SkillComposer } from "@/components/job-post/SkillComposer";
import { getErrorMessage } from "@/lib/apiClient/error";
import { useJobPostTemplate, useSubmitJobPost } from "@/hooks/jobPost";
import type {
  CommunicationSkill,
  EmploymentType,
  ExperienceLevel,
  ExperiencePreference,
  JobPostPayload,
  JobPostTemplate,
  SkillPair,
} from "@/features/job-post/types";

type JobPostLocalState = JobPostTemplate;

const emptyState: JobPostLocalState = {
  jobTitle: "",
  jobCategory: "",
  organizationIndustry: "",
  organizationalLevel: "",
  department: "",
  employmentTypes: [
    "Full-time",
    "Part-time",
    "Remote",
    "On-Site",
    "Hybrid",
    "Internship",
  ],
  selectedEmploymentTypes: [],
  country: "",
  city: "",
  selectedLocations: [],
  minimumSalaryAmount: "",
  displaySalaryInPost: false,
  selectedSalaryBadges: [],
  experienceLevels: [
    "No experience",
    "Less than 1 year",
    "1-3 year",
    "+3 year",
  ],
  selectedExperienceLevels: [],
  experiencePreferences: [
    "Experience in sales, shopping centers, or stores is preferred",
    "Accepting interns and beginners",
  ],
  selectedExperiencePreferences: [],
  languageSkills: [],
  softwareSkills: [],
  communicationSkills: [
    "Conflict Resolution Skill",
    "Collabration Skill",
    "Time management",
    "Interpersonal skill",
    "Adaptability",
  ],
  selectedCommunicationSkills: [],
  workingHoursAndDays: "",
  jobDescriptionAndRequiredSkills: "",
};

export default function PostJobPage() {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const [state, setState] = useState<JobPostLocalState>(emptyState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  const templateQuery = useJobPostTemplate();
  const submitMutation = useSubmitJobPost();

  // ─── Auth guard: redirect if not logged in ──────────────────────────
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login/company");
    }
  }, [status, router]);

  // ─── Populate form from API template (adjust during render) ─────────
  // React-recommended pattern: adjust state during rendering when
  // external data changes, instead of using an Effect.
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  useEffect(() => {
  if (templateQuery.data) {
    setState(templateQuery.data);
  }
}, [templateQuery.data]);

  // Derive template error directly instead of syncing to state
  const templateError = templateQuery.error
    ? getErrorMessage(templateQuery.error, "Failed to load post job template.")
    : null;

  // ─── Derived values ─────────────────────────────────────────────────
  const locationPreview = useMemo(() => {
    if (!state.country || !state.city) return "";
    return `${state.city}/${state.country}`;
  }, [state.city, state.country]);

  // ─── Field updaters ─────────────────────────────────────────────────
  const updateField = <K extends keyof JobPostLocalState>(
    key: K,
    value: JobPostLocalState[K],
  ) => {
    setState((prev) => ({ ...prev, [key]: value }));
    // Clear validation error for this field when user edits it
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

  const toggleEmploymentType = (value: EmploymentType) => {
    toggleSelection(value, state.selectedEmploymentTypes, (next) =>
      updateField("selectedEmploymentTypes", next),
    );
  };

  const toggleExperienceLevel = (value: ExperienceLevel) => {
    toggleSelection(value, state.selectedExperienceLevels, (next) =>
      updateField("selectedExperienceLevels", next),
    );
  };

  const toggleExperiencePreference = (value: ExperiencePreference) => {
    toggleSelection(value, state.selectedExperiencePreferences, (next) =>
      updateField("selectedExperiencePreferences", next),
    );
  };

  const toggleCommunicationSkill = (value: CommunicationSkill) => {
    toggleSelection(value, state.selectedCommunicationSkills, (next) =>
      updateField("selectedCommunicationSkills", next),
    );
  };

  const removeItem = (
    key:
      | "selectedEmploymentTypes"
      | "selectedExperienceLevels"
      | "selectedExperiencePreferences"
      | "selectedCommunicationSkills",
    item: string,
  ) => {
    updateField(
      key,
      state[key].filter((v) => v !== item) as JobPostLocalState[typeof key],
    );
  };

  const addLocationBadge = () => {
    if (!locationPreview || state.selectedLocations.includes(locationPreview))
      return;
    updateField("selectedLocations", [...state.selectedLocations, locationPreview]);
  };

  const removeLocationBadge = (item: string) => {
    updateField(
      "selectedLocations",
      state.selectedLocations.filter((v) => v !== item),
    );
  };

  const removeSalaryBadge = (item: string) => {
    updateField(
      "selectedSalaryBadges",
      state.selectedSalaryBadges.filter((v) => v !== item),
    );
  };

  const handleSalaryDisplayChange = (checked: boolean) => {
    updateField("displaySalaryInPost", checked);
    const salaryBadge = "Displaying salary in the job post";
    if (checked && !state.selectedSalaryBadges.includes(salaryBadge)) {
      updateField("selectedSalaryBadges", [...state.selectedSalaryBadges, salaryBadge]);
    } else if (!checked) {
      updateField(
        "selectedSalaryBadges",
        state.selectedSalaryBadges.filter((item) => item !== salaryBadge),
      );
    }
  };

  const addLanguageSkill = (item: SkillPair) => {
    updateField("languageSkills", [...state.languageSkills, item]);
  };

  const removeLanguageSkill = (item: SkillPair) => {
    updateField(
      "languageSkills",
      state.languageSkills.filter(
        (v) => !(v.field === item.field && v.level === item.level),
      ),
    );
  };

  const addSoftwareSkill = (item: SkillPair) => {
    updateField("softwareSkills", [...state.softwareSkills, item]);
  };

  const removeSoftwareSkill = (item: SkillPair) => {
    updateField(
      "softwareSkills",
      state.softwareSkills.filter(
        (v) => !(v.field === item.field && v.level === item.level),
      ),
    );
  };

  // ─── Validation ─────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!state.jobTitle.trim())
      newErrors.jobTitle = "Job title is required";
    if (!state.jobCategory.trim())
      newErrors.jobCategory = "Job category is required";
    if (!state.organizationIndustry.trim())
      newErrors.organizationIndustry = "Organization industry is required";
    if (!state.organizationalLevel.trim())
      newErrors.organizationalLevel = "Organizational level is required";
    if (!state.department.trim())
      newErrors.department = "Department is required";
    if (state.selectedEmploymentTypes.length === 0)
      newErrors.selectedEmploymentTypes =
        "At least one employment type is required";
    if (!state.jobDescriptionAndRequiredSkills.trim())
      newErrors.jobDescriptionAndRequiredSkills =
        "Job description & required skills is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Submit handler ─────────────────────────────────────────────────
  const handleSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) return;

    try {
      const payload: JobPostPayload = { ...state };
      const response = await submitMutation.mutateAsync(payload);
      setSuccessMessage(response.message);
      setErrors({});
      setIsPreview(false);
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Failed to submit job post."));
    }
  };

  // ─── Loading: auth check or template fetch ──────────────────────────
  if (status === "loading" || templateQuery.isLoading) {
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

  // ─── Not authenticated (will redirect) ──────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-neutral-500">Redirecting to login…</p>
      </div>
    );
  }

  // ─── Preview mode ───────────────────────────────────────────────────
  if (isPreview) {
    return (
      <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
        <div className="space-y-6">
          {/* Header */}
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

          {/* Job Introduction */}
          <SectionCard icon={Briefcase} title="Job Introduction">
            <div className="grid gap-3 md:grid-cols-2">
              <PreviewField label="Job Title" value={state.jobTitle} />
              <PreviewField label="Job Category" value={state.jobCategory} />
              <PreviewField
                label="Organization Industry"
                value={state.organizationIndustry}
              />
              <PreviewField
                label="Organizational Level"
                value={state.organizationalLevel}
              />
              <PreviewField
                label="Department"
                value={state.department}
                className="md:col-span-2"
              />
            </div>
          </SectionCard>

          {/* Employment Type */}
          <SectionCard icon={IdCard} title="Employment Type">
            {state.selectedEmploymentTypes.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {state.selectedEmploymentTypes.map((type) => (
                  <span
                    key={type}
                    className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700"
                  >
                    {type}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No employment type selected</p>
            )}
          </SectionCard>

          {/* Work Location */}
          <SectionCard icon={Building} title="Work Location">
            {state.selectedLocations.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {state.selectedLocations.map((loc) => (
                  <span
                    key={loc}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700"
                  >
                    {loc}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-400">No location selected</p>
            )}
          </SectionCard>

          {/* Salary & Benefits */}
          <SectionCard icon={HandHelping} title="Salary & Benefits">
            <div className="space-y-3">
              {state.minimumSalaryAmount && (
                <PreviewField
                  label="Minimum Salary"
                  value={`$${state.minimumSalaryAmount}`}
                />
              )}
              {state.displaySalaryInPost && (
                <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                  Salary displayed in post
                </span>
              )}
              {state.selectedSalaryBadges.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {state.selectedSalaryBadges.map((badge) => (
                    <span
                      key={badge}
                      className="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm text-neutral-600"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>

          {/* Work Experience */}
          <SectionCard icon={Building} title="Work Experience">
            <div className="space-y-6">
              <div>
                <p className="mb-2 text-sm font-medium text-neutral-700">
                  Experience Level
                </p>
                {state.selectedExperienceLevels.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {state.selectedExperienceLevels.map((level) => (
                      <span
                        key={level}
                        className="rounded-lg bg-purple-50 px-3 py-1.5 text-sm font-medium text-purple-700"
                      >
                        {level}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    No experience level selected
                  </p>
                )}
              </div>
              <div>
                <p className="mb-2 text-sm font-medium text-neutral-700">
                  Experience Preference
                </p>
                {state.selectedExperiencePreferences.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {state.selectedExperiencePreferences.map((pref) => (
                      <span
                        key={pref}
                        className="rounded-lg bg-neutral-100 px-3 py-1.5 text-sm text-neutral-600"
                      >
                        {pref}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-neutral-400">
                    No experience preference selected
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* Skills */}
          <SectionCard icon={Medal} title="Skills">
            <div className="space-y-4">
              <PreviewSkillSection
                title="Languages"
                items={state.languageSkills}
              />
              <PreviewSkillSection
                title="Software"
                items={state.softwareSkills}
              />
              {state.selectedCommunicationSkills.length > 0 ? (
                <div>
                  <p className="mb-2 text-sm font-medium text-neutral-700">
                    Communication
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {state.selectedCommunicationSkills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-teal-50 px-3 py-1.5 text-sm font-medium text-teal-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-neutral-400">
                  No communication skills selected
                </p>
              )}
            </div>
          </SectionCard>

          {/* Job Description */}
          <SectionCard icon={ReceiptText} title="Job Description">
            <div className="space-y-3">
              {state.workingHoursAndDays && (
                <PreviewField
                  label="Working Hours & Days"
                  value={state.workingHoursAndDays}
                />
              )}
              {state.jobDescriptionAndRequiredSkills ? (
                <div>
                  <p className="mb-1 text-sm font-medium text-neutral-700">
                    Description & Required Skills
                  </p>
                  <p className="whitespace-pre-wrap text-sm text-neutral-800 leading-6">
                    {state.jobDescriptionAndRequiredSkills}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-neutral-400">No description provided</p>
              )}
            </div>
          </SectionCard>

          {/* Actions */}
          <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-3 rounded-xl border border-neutral-200 bg-white p-4">
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
              {submitMutation.isPending ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Edit mode ──────────────────────────────────────────────────────
  return (
    <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
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

        {/* Job Introduction */}
        <SectionCard icon={Briefcase} title="Job Introduction">
          <div className="grid gap-6 md:grid-cols-2">
            <FloatingInput
              id="jobTitle"
              label="Job Title"
              value={state.jobTitle}
              onChange={(e) => updateField("jobTitle", e.target.value)}
              placeholder="e.g. Frontend Developer"
              required
              error={errors.jobTitle}
            />
            <FloatingInput
              id="jobCategory"
              label="Job Category"
              value={state.jobCategory}
              onChange={(e) => updateField("jobCategory", e.target.value)}
              placeholder="e.g. Software Engineering"
              required
              error={errors.jobCategory}
            />
            <FloatingInput
              id="orgIndustry"
              label="Organization Industry"
              value={state.organizationIndustry}
              onChange={(e) =>
                updateField("organizationIndustry", e.target.value)
              }
              placeholder="e.g. Technology"
              required
              error={errors.organizationIndustry}
            />
            <FloatingInput
              id="orgLevel"
              label="Organizational Level"
              value={state.organizationalLevel}
              onChange={(e) =>
                updateField("organizationalLevel", e.target.value)
              }
              placeholder="e.g. Mid-level"
              required
              error={errors.organizationalLevel}
            />
            <FloatingInput
              id="department"
              label="Department"
              value={state.department}
              onChange={(e) => updateField("department", e.target.value)}
              placeholder="e.g. Engineering"
              required
              error={errors.department}
            />
          </div>
        </SectionCard>

        {/* Employment Type */}
        <SectionCard icon={IdCard} title="Employment Type">
          <div className="space-y-4">
            <CheckboxOptionGroup
              options={state.employmentTypes}
              selected={state.selectedEmploymentTypes}
              onToggle={toggleEmploymentType}
              label="Employment Type"
              required
              error={errors.selectedEmploymentTypes}
            />
            <BadgeList
              items={state.selectedEmploymentTypes}
              onRemove={(item) => removeItem("selectedEmploymentTypes", item)}
            />
          </div>
        </SectionCard>

        {/* Work Location */}
        <SectionCard icon={Building} title="Work Location">
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-[1fr_1fr_auto]">
              <FloatingInput
                id="country"
                label="Country"
                value={state.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="e.g. Egypt"
                
              />
              <FloatingInput
                id="city"
                label="City"
                value={state.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="e.g. Cairo"
              />
              <Button
                type="button"
                onClick={addLocationBadge}
                className="h-12 mt-auto"
              >
                Add
              </Button>
            </div>
            <BadgeList
              items={state.selectedLocations}
              onRemove={removeLocationBadge}
            />
          </div>
        </SectionCard>

        {/* Salary & Benefits */}
        <SectionCard icon={HandHelping} title="Salary & Benefits">
          <div className="space-y-4">
            <FloatingInput
              id="minSalary"
              label="Minimum Salary Amount"
              value={state.minimumSalaryAmount}
              onChange={(e) =>
                updateField("minimumSalaryAmount", e.target.value)
              }
              placeholder="e.g. 5000"
            />
            <div className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3">
              <Checkbox
                id="displaySalary"
                checked={state.displaySalaryInPost}
                onCheckedChange={(checked) =>
                  handleSalaryDisplayChange(checked === true)
                }
              />
              <Label
                htmlFor="displaySalary"
                className="text-sm text-neutral-700 cursor-pointer"
              >
                Display salary in the job post
              </Label>
            </div>
            <BadgeList
              items={state.selectedSalaryBadges}
              onRemove={removeSalaryBadge}
            />
          </div>
        </SectionCard>

        {/* Work Experience */}
        <SectionCard icon={Building} title="Work Experience">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-base font-medium text-neutral-800">
                Experience Level
              </p>
              <CheckboxOptionGroup
                options={state.experienceLevels}
                selected={state.selectedExperienceLevels}
                onToggle={toggleExperienceLevel}
                className="grid gap-3 sm:grid-cols-2"
              />
              <div className="mt-3">
                <BadgeList
                  items={state.selectedExperienceLevels}
                  onRemove={(item) => removeItem("selectedExperienceLevels", item)}
                />
              </div>
            </div>

            <div>
              <p className="mb-3 text-base font-medium text-neutral-800">
                Experience Preference
              </p>
              <CheckboxOptionGroup
                options={state.experiencePreferences}
                selected={state.selectedExperiencePreferences}
                onToggle={toggleExperiencePreference}
                className="grid gap-3"
              />
              <div className="mt-3">
                <BadgeList
                  items={state.selectedExperiencePreferences}
                  onRemove={(item) =>
                    removeItem("selectedExperiencePreferences", item)
                  }
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Skills */}
        <SectionCard icon={Medal} title="Skills">
          <div className="space-y-6">
            <div>
              <p className="mb-3 text-base font-medium text-neutral-800">
                Languages
              </p>
              <SkillComposer
                fieldLabel="Language"
                levelLabel="Proficiency level"
                items={state.languageSkills}
                onAdd={addLanguageSkill}
                onRemove={removeLanguageSkill}
              />
            </div>

            <div>
              <p className="mb-3 text-base font-medium text-neutral-800">
                Software
              </p>
              <SkillComposer
                fieldLabel="Field"
                levelLabel="Proficiency level"
                items={state.softwareSkills}
                onAdd={addSoftwareSkill}
                onRemove={removeSoftwareSkill}
              />
            </div>

            <div>
              <p className="mb-3 text-base font-medium text-neutral-800">
                Communication
              </p>
              <CheckboxOptionGroup
                options={state.communicationSkills}
                selected={state.selectedCommunicationSkills}
                onToggle={toggleCommunicationSkill}
                className="grid gap-3 sm:grid-cols-2"
              />
              <div className="mt-4">
                <BadgeList
                  items={state.selectedCommunicationSkills}
                  onRemove={(item) =>
                    removeItem("selectedCommunicationSkills", item)
                  }
                />
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Job Description */}
        <SectionCard icon={ReceiptText} title="Job Description">
          <div className="space-y-4">
            <FloatingInput
              id="workingHours"
              label="Working Hours & Days"
              value={state.workingHoursAndDays}
              onChange={(e) =>
                updateField("workingHoursAndDays", e.target.value)
              }
              placeholder="e.g. Saturday to Wednesday 9 AM to 5 PM"
            />
            <FloatingTextArea
              id="jobDescription"
              label="Job Description & Required Skills"
              value={state.jobDescriptionAndRequiredSkills}
              onChange={(e) =>
                updateField("jobDescriptionAndRequiredSkills", e.target.value)
              }
              placeholder="Describe the role, responsibilities, and required qualifications…"
              maxLength={512}
              required
              error={errors.jobDescriptionAndRequiredSkills}
            />
          </div>
        </SectionCard>

        {/* Actions */}
        <div className="sticky bottom-4 z-10 flex flex-wrap justify-end gap-3 rounded-xl border border-neutral-200 bg-white p-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => { if (validate()) setIsPreview(true); }}
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
            {submitMutation.isPending ? "Posting..." : "Post Job"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Helper components ────────────────────────────────────────────────

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
      <p className="text-sm text-neutral-800">{value || "—"}</p>
    </div>
  );
}

function PreviewSkillSection({
  title,
  items,
}: {
  title: string;
  items: SkillPair[];
}) {
  if (items.length === 0) {
    return (
      <div>
        <p className="mb-2 text-sm font-medium text-neutral-700">{title}</p>
        <p className="text-sm text-neutral-400">No {title.toLowerCase()} added</p>
      </div>
    );
  }
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-neutral-700">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={`${item.field}-${item.level}`}
            className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700"
          >
            {item.field} / {item.level}
          </span>
        ))}
      </div>
    </div>
  );
}
