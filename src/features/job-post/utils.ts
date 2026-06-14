import type {
  CreateJobPostFormPayload,
  CreateJobPostApiPayload,
  LegacyJobPostFormState,
  SkillResponse,
} from "./types";

import type {
  JobType,
  WorkMode,
  ExperienceLevel,
  TechnicalDomain,
} from "@/features/enums";
import {
  EXPERIENCE_LEVEL_VALUES,
  JOB_TYPE_VALUES,
  TECHNICAL_DOMAIN_VALUES,
  WORK_MODE_VALUES,
} from "@/features/enums";

/**
 * Normalize an empty/whitespace-only string to null for optional API fields.
 *
 * The API expects null for missing optional string fields, but the form
 * uses empty strings as default values. This helper converts them.
 */
const toNullIfEmpty = (value?: string): string | null =>
  value === undefined || value === null || value.trim() === "" ? null : value;

/**
 * Normalize an empty/zero number to null for optional API number fields.
 */
const toNullIfZero = (value?: number): number | null =>
  value === undefined || value === null || value === 0 ? null : value;

/**
 * Convert a form string value to a number, returning null if empty/invalid.
 */
const toNumberOrNull = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
};

const toPositiveNumberOrNull = (value?: string): number | null => {
  const num = toNumberOrNull(value);
  return num === null || num <= 0 ? null : num;
};

/**
 * The backend expects DateTimeOffset. HTML date inputs produce YYYY-MM-DD,
 * so normalize to an explicit UTC ISO timestamp to avoid provider-specific
 * DateTimeOffset offset issues during persistence.
 */
const toUtcDateTimeOffsetOrNull = (value?: string): string | null => {
  if (!value || value.trim() === "") return null;
  return `${value}T23:59:59.000Z`;
};

const assertBackendEnumValue = <T extends string>(
  field: string,
  value: string,
  allowedValues: readonly T[],
): T => {
  if (allowedValues.includes(value as T)) {
    return value as T;
  }

  throw new Error(`Invalid ${field} enum value: ${value}`);
};

// ─── Skill ID matching ────────────────────────────────────────────────

/**
 * Case-insensitive string comparison with basic fuzzy matching.
 *
 * Normalizes both strings by:
 * 1. Converting to lowercase
 * 2. Removing extra whitespace
 * 3. Stripping common suffixes like "skill", "skills"
 *
 * Returns true if the normalized strings match exactly, or if one
 * contains the other (substring match for short names like "Adaptability").
 */
const normalizeSkillName = (name: string): string =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+skill$/i, "")
    .replace(/\s+skills$/i, "")
    .replace(/\s+/g, " ");

const isSkillNameMatch = (userInput: string, apiName: string): boolean => {
  const normalizedInput = normalizeSkillName(userInput);
  const normalizedApi = normalizeSkillName(apiName);

  // Exact match after normalization
  if (normalizedInput === normalizedApi) return true;

  // Substring match (e.g., "collaboration" matches "collaboration skill")
  if (normalizedApi.includes(normalizedInput)) return true;
  if (normalizedInput.includes(normalizedApi)) return true;

  return false;
};

/**
 * Find a skill ID from the API skills list by matching the user's typed name.
 *
 * Uses case-insensitive comparison with basic fuzzy matching to handle typos
 * and formatting differences (e.g., "Collabration Skill" → "Collaboration Skill").
 *
 * Returns the matching skill's ID, or null if no match is found.
 */
export const findSkillIdByName = (
  skillName: string,
  skillsData?: SkillResponse[],
): number | null => {
  if (!skillsData || skillsData.length === 0) return null;

  // First pass: exact match (case-insensitive)
  const exactMatch = skillsData.find(
    (s) => s.name.toLowerCase().trim() === skillName.toLowerCase().trim(),
  );
  if (exactMatch) return exactMatch.id;

  // Second pass: fuzzy match (normalized comparison)
  const fuzzyMatch = skillsData.find((s) =>
    isSkillNameMatch(skillName, s.name),
  );
  if (fuzzyMatch) return fuzzyMatch.id;

  return null;
};

/**
 * Collect all skill IDs from the form state for the API requiredSkillIds field.
 *
 * Gathers IDs from:
 * 1. selectedLanguageSkills (SelectedSkill[]) — already have IDs from autocomplete
 * 2. selectedSoftwareSkills (SelectedSkill[]) — already have IDs from autocomplete
 * 3. selectedCommunicationSkills (CommunicationSkill[]) — matched against /api/Skills
 *
 * Communication skills are matched by name using fuzzy matching against the
 * skills data from GET /api/Skills. If a match is found, the ID is included.
 * If no match is found, the skill is skipped (the API only accepts valid IDs).
 */
const collectSkillIds = (
  legacy: LegacyJobPostFormState,
  skillsData?: SkillResponse[],
): number[] => {
  const ids: number[] = [];

  // Language skills — already have IDs from autocomplete selection
  for (const skill of legacy.selectedLanguageSkills) {
    if (Number.isInteger(skill.id)) ids.push(skill.id);
  }

  // Software skills — already have IDs from autocomplete selection
  for (const skill of legacy.selectedSoftwareSkills) {
    if (Number.isInteger(skill.id)) ids.push(skill.id);
  }

  // Communication skills — match by name against /api/Skills
  for (const commSkill of legacy.selectedCommunicationSkills) {
    const matchedId = findSkillIdByName(commSkill, skillsData);
    if (matchedId) ids.push(matchedId);
  }

  return ids;
};

// ─── Mapping functions ────────────────────────────────────────────────

/**
 * Map NEW form-local state (CreateJobPostFormPayload) to the exact API
 * payload shape (CreateJobPostApiPayload) for POST /api/job-posts.
 *
 * This will be used once the post-job page is refactored to the new
 * form shape that aligns with the API contract.
 */
export const mapFormToApiPayload = (
  form: CreateJobPostFormPayload,
): CreateJobPostApiPayload => {
  const technicalDomain = assertBackendEnumValue<TechnicalDomain>(
    "technicalDomain",
    form.technicalDomain,
    TECHNICAL_DOMAIN_VALUES,
  );
  const jobType = assertBackendEnumValue<JobType>(
    "jobType",
    form.jobType,
    JOB_TYPE_VALUES,
  );
  const workMode = assertBackendEnumValue<WorkMode>(
    "workMode",
    form.workMode,
    WORK_MODE_VALUES,
  );
  const experienceLevel = assertBackendEnumValue<ExperienceLevel>(
    "experienceLevel",
    form.experienceLevel,
    EXPERIENCE_LEVEL_VALUES,
  );

  return {
    title: form.title,
    description: toNullIfEmpty(form.description),
    requirements: toNullIfEmpty(form.requirements),
    responsibilities: toNullIfEmpty(form.responsibilities),
    domain: toNullIfEmpty(form.domain),
    country: form.country,
    city: form.city,
    street: toNullIfEmpty(form.street),
    reqExpYears: toNullIfZero(form.reqExpYears),
    minSalary: form.minSalary ?? undefined,
    salaryCurrency: toNullIfEmpty(form.salaryCurrency),
    contactMail: toNullIfEmpty(form.contactMail),
    deadline: toUtcDateTimeOffsetOrNull(form.deadline),
    technicalDomain,
    jobType,
    workMode,
    experienceLevel,
    requiredSkillIds: form.requiredSkillIds ?? [],
  };
};

/**
 * Map LEGACY form-local state (LegacyJobPostFormState) to the API
 * payload shape (CreateJobPostApiPayload) for POST /api/job-posts.
 *
 * Key transformations:
 *   - jobTitle → title
 *   - organizationIndustry → domain
 *   - selectedJobTypes (array) → jobType (first selected value)
 *   - selectedWorkModes (array) → workMode (first selected value)
 *   - selectedExperienceLevels (array) → experienceLevel (first selected value)
 *   - description → description (was jobDescriptionAndRequiredSkills)
 *   - requirements → requirements (new field)
 *   - responsibilities → responsibilities (new field)
 *   - minimumSalaryAmount → minSalary
 *   - salaryCurrency → salaryCurrency (new field)
 *   - contactMail → contactMail (new field)
 *   - street → street (new field)
 *   - reqExpYears → reqExpYears (new field, string→number)
 *   - deadline → deadline (new field)
 *   - selectedLanguageSkills + selectedSoftwareSkills + selectedCommunicationSkills → requiredSkillIds
 *
 * IMPORTANT: enum values are validated before the API call. No fallback or
 * display label is ever sent for strict backend enum fields.
 *
 * @deprecated Remove once the post-job page is refactored to use CreateJobPostFormPayload.
 */
export const mapLegacyFormToApiPayload = (
  legacy: LegacyJobPostFormState,
  skillsData?: SkillResponse[],
): CreateJobPostApiPayload => {
  const technicalDomain = assertBackendEnumValue<TechnicalDomain>(
    "technicalDomain",
    legacy.technicalDomain,
    TECHNICAL_DOMAIN_VALUES,
  );
  const jobType = assertBackendEnumValue<JobType>(
    "jobType",
    legacy.selectedJobTypes[0] ?? "",
    JOB_TYPE_VALUES,
  );
  const workMode = assertBackendEnumValue<WorkMode>(
    "workMode",
    legacy.selectedWorkModes[0] ?? "",
    WORK_MODE_VALUES,
  );
  const experienceLevel = assertBackendEnumValue<ExperienceLevel>(
    "experienceLevel",
    legacy.selectedExperienceLevels[0] ?? "",
    EXPERIENCE_LEVEL_VALUES,
  );

  return {
    title: legacy.jobTitle,
    description: toNullIfEmpty(legacy.description),
    requirements: toNullIfEmpty(legacy.requirements),
    responsibilities: toNullIfEmpty(legacy.responsibilities),
    domain: toNullIfEmpty(legacy.organizationIndustry),
    country: legacy.country,
    city: legacy.city,
    street: toNullIfEmpty(legacy.street),
    reqExpYears: toNumberOrNull(legacy.reqExpYears),
    minSalary: toPositiveNumberOrNull(legacy.minimumSalaryAmount),
    salaryCurrency: toNullIfEmpty(legacy.salaryCurrency),
    contactMail: toNullIfEmpty(legacy.contactMail),
    deadline: toUtcDateTimeOffsetOrNull(legacy.deadline),
    technicalDomain,
    jobType,
    workMode,
    experienceLevel,
    requiredSkillIds: collectSkillIds(legacy, skillsData),
  };
};
