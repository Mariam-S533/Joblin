// ─── Centralized Enum Imports ────────────────────────────────────────
// All backend enum types and constants are defined in src/features/enums.ts
// This file re-exports them for convenience and adds form-specific types.

import type {
  EnumOption,
  TechnicalDomain,
  ExperienceLevel,
  JobType,
  WorkMode,
  ApplicationStatus,
  JobStatus,
  DifficultyLevel,
} from "@/features/enums";

import {
  TECHNICAL_DOMAIN_OPTIONS,
  TECHNICAL_DOMAIN_VALUES,
  JOB_TYPE_OPTIONS,
  JOB_TYPE_VALUES,
  WORK_MODE_OPTIONS_FOR_FORM,
  WORK_MODE_VALUES,
  EXPERIENCE_LEVEL_OPTIONS,
  EXPERIENCE_LEVEL_VALUES,
  DIFFICULTY_LEVEL_OPTIONS,
  DIFFICULTY_LEVEL_VALUES,
  getTechnicalDomainLabel,
  getJobTypeLabel,
  getWorkModeLabel,
  getExperienceLevelLabel,
  getDifficultyLevelLabel,
} from "@/features/enums";

// Re-export centralized enum types and helpers for downstream consumers
export type {
  EnumOption,
  TechnicalDomain,
  ExperienceLevel,
  JobType,
  WorkMode,
  ApplicationStatus,
  JobStatus,
  DifficultyLevel,
};

export {
  TECHNICAL_DOMAIN_OPTIONS,
  TECHNICAL_DOMAIN_VALUES,
  JOB_TYPE_OPTIONS,
  JOB_TYPE_VALUES,
  WORK_MODE_OPTIONS_FOR_FORM,
  WORK_MODE_VALUES,
  EXPERIENCE_LEVEL_OPTIONS,
  EXPERIENCE_LEVEL_VALUES,
  DIFFICULTY_LEVEL_OPTIONS,
  DIFFICULTY_LEVEL_VALUES,
  getTechnicalDomainLabel,
  getJobTypeLabel,
  getWorkModeLabel,
  getExperienceLevelLabel,
  getDifficultyLevelLabel,
};

// ─── Skills API (GET /api/Skills) ────────────────────────────────────

/**
 * Response shape from GET /api/Skills.
 * Returns a flat array of skill objects with id and name.
 */
export type SkillResponse = {
  id: number;
  name: string;
};

/**
 * A skill selected by the user in the form, storing both the API id
 * (for requiredSkillIds) and the name (for badge display).
 * Also includes a proficiency level for UI display in the SkillComposer.
 */
export type SelectedSkill = {
  id: number;
  name: string;
  /** Proficiency level uses the exact backend DifficultyLevel enum value. UI-only for this payload. */
  level: DifficultyLevel;
};

// ─── Legacy Form State (used by post-job page) ───────────────────────

/**
 * Form-local state for the post-job page.
 *
 * Aligned with both the Figma design and the POST /api/job-posts API.
 * Fields marked "UI-only" are shown in the Figma but not sent to the API.
 * Fields marked "→ API" map directly to API request body fields.
 *
 * IMPORTANT: Enum fields store the EXACT backend enum value (PascalCase),
 * NOT display labels. The UI shows labels via getEnumLabel() helpers.
 *
 * Skills are now selected via GET /api/Skills autocomplete and stored as
 * SelectedSkill objects (id + name). The mapping layer collects all IDs
 * into requiredSkillIds for the API payload.
 */
export type LegacyJobPostFormState = {
  // ─── Section 1: Job Introduction ───────────────────
  /** → API "title" */
  jobTitle: string;
  /** → API "technicalDomain" — MUST be one of TechnicalDomain enum.
   *  Empty string "" means no selection yet (form default). */
  technicalDomain: TechnicalDomain | "";
  /** Available technical domain options for the dropdown UI (EnumOption[]) */
  technicalDomainOptions: EnumOption[];
  /** → API "domain" (organization industry) */
  organizationIndustry: string;
  /** UI-only — shown in Figma but not in API request body */
  organizationalLevel: string;
  /** UI-only — shown in Figma but not in API request body */
  department: string;
  /** → API "contactMail" */
  contactMail: string;

  // ─── Section 2: Job Type & Work Mode ──────────────
  /** Available job type options for the select UI (EnumOption[]) */
  jobTypeOptions: EnumOption[];
  /** Selected job type(s) — first value is sent as `jobType` to API. Values are backend enums. */
  selectedJobTypes: JobType[];
  /** Available work mode options for the select UI (EnumOption[]) */
  workModeOptions: EnumOption[];
  /** Selected work mode(s) — first value is sent as `workMode` to API. Values are backend enums. */
  selectedWorkModes: WorkMode[];

  // ─── Section 3: Work Location ─────────────────────
  /** → API "country" */
  country: string;
  /** → API "city" */
  city: string;
  /** → API "street" */
  street: string;
  /** UI-only — badges showing added locations */
  selectedLocations: string[];

  // ─── Section 4: Salary & Benefits ─────────────────
  /** → API "minSalary" */
  minimumSalaryAmount: string;
  /** → API "salaryCurrency" */
  salaryCurrency: string;
  /** UI-only — shown in Figma but not in API request body */
  displaySalaryInPost: boolean;
  /** UI-only — shown in Figma but not in API request body */
  selectedSalaryBadges: string[];

  // ─── Section 5: Work Experience ───────────────────
  /** Available experience level options for the select UI (EnumOption[]) */
  experienceLevelOptions: EnumOption[];
  /** Selected experience level(s) — first value is sent as `experienceLevel` to API. Values are backend enums. */
  selectedExperienceLevels: ExperienceLevel[];
  /** → API "reqExpYears" — stored as string in form, converted to number in mapping */
  reqExpYears: string;
  /** UI-only — shown in Figma but not in API request body */
  experiencePreferences: ExperiencePreference[];
  /** UI-only — shown in Figma but not in API request body */
  selectedExperiencePreferences: ExperiencePreference[];

  // ─── Section 6: Skills (via GET /api/Skills) ──────
  /** Selected language skills — IDs collected for API requiredSkillIds */
  selectedLanguageSkills: SelectedSkill[];
  /** Selected software skills — IDs collected for API requiredSkillIds */
  selectedSoftwareSkills: SelectedSkill[];
  /** Hardcoded communication skill options for checkbox UI */
  communicationSkillOptions: CommunicationSkill[];
  /** Selected communication skills — matched to /api/Skills IDs if possible */
  selectedCommunicationSkills: CommunicationSkill[];

  // ─── Section 7: Job Description ───────────────────
  /** → API "description" */
  description: string;
  /** → API "requirements" */
  requirements: string;
  /** → API "responsibilities" */
  responsibilities: string;
  /** UI-only — shown in Figma but not in API request body */
  workingHoursAndDays: string;
  /** → API "deadline" — date string (YYYY-MM-DD format) */
  deadline: string;
};

// ─── Legacy Enum Types (UI-only, not sent to API) ────────────────────

/**
 * Communication skill options shown as checkboxes in the Figma design.
 * These are matched against /api/Skills names to find IDs for requiredSkillIds.
 */
export type CommunicationSkill =
  | "Conflict Resolution Skill"
  | "Collabration Skill"
  | "Time management"
  | "Interpersonal skill"
  | "Adaptability";

/**
 * UI-only experience preference options from the Figma design.
 * NOT sent to the API.
 */
export type ExperiencePreference =
  | "Experience in sales, shopping centers, or stores is preferred"
  | "Accepting interns and beginners";

// ─── API Payload (exact mirror of POST /api/job-posts contract) ──────

/**
 * Payload for POST /api/job-posts — create a new job posting.
 *
 * This type mirrors the real API request body exactly:
 * {
 *   title, description, requirements, responsibilities, domain,
 *   country, city, street, reqExpYears, minSalary, salaryCurrency,
 *   contactMail, deadline, technicalDomain, jobType, workMode,
 *   experienceLevel, requiredSkillIds
 * }
 *
 * Enum fields MUST use the exact backend enum string values (PascalCase).
 * Required fields: title, country, city, technicalDomain, jobType, workMode, experienceLevel
 * Optional fields accept null — the mapping layer strips nulls before sending.
 */
export type CreateJobPostApiPayload = {
  title: string;
  description?: string | null;
  requirements?: string | null;
  responsibilities?: string | null;
  domain?: string | null;
  country: string;
  city: string;
  street?: string | null;
  reqExpYears?: number | null;
  minSalary?: number | null;
  salaryCurrency?: string | null;
  contactMail?: string | null;
  deadline?: string | null;
  technicalDomain: TechnicalDomain;
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  requiredSkillIds?: number[];
};

// ─── Form Payload (what the NEW UI will collect) ─────────────────────

/**
 * Form-local state for the post-job page (NEW shape aligned with API).
 *
 * This represents what the refactored UI form will collect, matching
 * the API payload field names but using form-friendly types.
 * The mapFormToApiPayload() function bridges this to CreateJobPostApiPayload.
 *
 * DO NOT use this type until the post-job page is refactored.
 */
export type CreateJobPostFormPayload = {
  title: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  domain?: string;
  country: string;
  city: string;
  street?: string;
  reqExpYears?: number;
  minSalary?: number;
  salaryCurrency?: string;
  contactMail?: string;
  deadline?: string;
  technicalDomain: TechnicalDomain;
  jobType: JobType;
  workMode: WorkMode;
  experienceLevel: ExperienceLevel;
  requiredSkillIds?: number[];
};

// ─── Response ────────────────────────────────────────────────────────

/**
 * Response from POST /api/job-posts.
 *
 * REQUIRES BACKEND CONFIRMATION: the exact response shape is unknown.
 * All fields are optional until the backend response is confirmed.
 */
export type SubmitJobPostResponse = {
  id?: string;
  message?: string;
  status?: string;
};

// ─── Template (kept for future use if backend adds this endpoint) ────

/**
 * Potential future template endpoint response.
 * Currently NOT used — there is no /api/job-posts/template endpoint.
 * The form starts with empty state only.
 */
export type JobPostTemplate = {
  jobTypes?: JobType[];
  workModes?: WorkMode[];
  experienceLevels?: ExperienceLevel[];
  technicalDomains?: TechnicalDomain[];
  salaryCurrencies?: string[];
  skills?: SkillOption[];
};

export type SkillOption = {
  id: string;
  name: string;
};

// ─── Backward-compatible aliases ─────────────────────────────────────

/**
 * @deprecated Use CreateJobPostApiPayload instead.
 * Kept for any external consumers that haven't migrated yet.
 */
export type JobPostPayload = CreateJobPostApiPayload;
