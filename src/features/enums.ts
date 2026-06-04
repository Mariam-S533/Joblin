// ─── Centralized Backend Enum Constants ────────────────────────────────
//
// This file is the SINGLE SOURCE OF TRUTH for all backend enum values.
//
// Rules:
//   1. `value` MUST be the exact backend enum string (PascalCase as .NET sends)
//   2. `label` is a user-friendly display string for the UI
//   3. Form state stores the `value` (backend enum), NOT the `label`
//   4. API payloads send the `value` exactly as-is
//   5. NEVER hardcode enum lists in components — import from here
//
// ─── Generic Option Type ──────────────────────────────────────────────

export type EnumOption = {
  /** User-friendly display label shown in the UI */
  label: string;
  /** Exact backend enum string value sent to the API */
  value: string;
};

// ─── TechnicalDomain ──────────────────────────────────────────────────
// Backend: public enum TechnicalDomain
//   FrontendDevelopment = 1, BackendDevelopment = 2, FullstackDevelopment = 3,
//   MobileDevelopment = 4, GameDevelopment = 5, MachineLearning = 6,
//   CyberSecurity = 7, CloudComputing = 8, DevOps = 9

export type TechnicalDomain =
  | "FrontendDevelopment"
  | "BackendDevelopment"
  | "FullstackDevelopment"
  | "MobileDevelopment"
  | "GameDevelopment"
  | "MachineLearning"
  | "CyberSecurity"
  | "CloudComputing"
  | "DevOps";

export const TECHNICAL_DOMAIN_OPTIONS: EnumOption[] = [
  { label: "Frontend Development", value: "FrontendDevelopment" },
  { label: "Backend Development", value: "BackendDevelopment" },
  { label: "Fullstack Development", value: "FullstackDevelopment" },
  { label: "Mobile Development", value: "MobileDevelopment" },
  { label: "Game Development", value: "GameDevelopment" },
  { label: "Machine Learning", value: "MachineLearning" },
  { label: "Cyber Security", value: "CyberSecurity" },
  { label: "Cloud Computing", value: "CloudComputing" },
  { label: "DevOps", value: "DevOps" },
];

export const TECHNICAL_DOMAIN_VALUES: TechnicalDomain[] =
  TECHNICAL_DOMAIN_OPTIONS.map((o) => o.value as TechnicalDomain);

/** Lookup a user-friendly label for a backend TechnicalDomain value. */
export const getTechnicalDomainLabel = (value: TechnicalDomain): string =>
  TECHNICAL_DOMAIN_OPTIONS.find((o) => o.value === value)?.label ?? value;

// ─── ApplicationStatus ────────────────────────────────────────────────
// Backend: public enum ApplicationStatus
//   Pending = 0, UnderReview = 1, Accepted = 2, Rejected = 3, Withdrawn = 4

export type ApplicationStatus =
  | "Pending"
  | "UnderReview"
  | "Accepted"
  | "Rejected"
  | "Withdrawn";

export const APPLICATION_STATUS_OPTIONS: EnumOption[] = [
  { label: "Pending", value: "Pending" },
  { label: "Under Review", value: "UnderReview" },
  { label: "Accepted", value: "Accepted" },
  { label: "Rejected", value: "Rejected" },
  { label: "Withdrawn", value: "Withdrawn" },
];

export const APPLICATION_STATUS_VALUES: ApplicationStatus[] =
  APPLICATION_STATUS_OPTIONS.map((o) => o.value as ApplicationStatus);

/** Lookup a user-friendly label for a backend ApplicationStatus value. */
export const getApplicationStatusLabel = (value: ApplicationStatus): string =>
  APPLICATION_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value;

// ─── ExperienceLevel ──────────────────────────────────────────────────
// Backend: public enum ExperienceLevel
//   EntryLevel = 1, Junior = 2, MidLevel = 3, Senior = 4, Lead = 5, Manager = 6

export type ExperienceLevel =
  | "EntryLevel"
  | "Junior"
  | "MidLevel"
  | "Senior"
  | "Lead"
  | "Manager";

export const EXPERIENCE_LEVEL_OPTIONS: EnumOption[] = [
  { label: "Entry Level", value: "EntryLevel" },
  { label: "Junior", value: "Junior" },
  { label: "Mid Level", value: "MidLevel" },
  { label: "Senior", value: "Senior" },
  { label: "Lead", value: "Lead" },
  { label: "Manager", value: "Manager" },
];

export const EXPERIENCE_LEVEL_VALUES: ExperienceLevel[] =
  EXPERIENCE_LEVEL_OPTIONS.map((o) => o.value as ExperienceLevel);

/** Lookup a user-friendly label for a backend ExperienceLevel value. */
export const getExperienceLevelLabel = (value: ExperienceLevel): string =>
  EXPERIENCE_LEVEL_OPTIONS.find((o) => o.value === value)?.label ?? value;

// ─── JobStatus ────────────────────────────────────────────────────────
// Backend: public enum JobStatus
//   Active = 1, Closed = 2, Cancelled = 3

export type JobStatus = "Active" | "Closed" | "Cancelled";

export const JOB_STATUS_OPTIONS: EnumOption[] = [
  { label: "Active", value: "Active" },
  { label: "Closed", value: "Closed" },
  { label: "Cancelled", value: "Cancelled" },
];

export const JOB_STATUS_VALUES: JobStatus[] = JOB_STATUS_OPTIONS.map(
  (o) => o.value as JobStatus,
);

/** Lookup a user-friendly label for a backend JobStatus value. */
export const getJobStatusLabel = (value: JobStatus): string =>
  JOB_STATUS_OPTIONS.find((o) => o.value === value)?.label ?? value;

// ─── JobType ──────────────────────────────────────────────────────────
// Backend: public enum JobType
//   FullTime = 1, PartTime = 2, Contract = 3, Internship = 4

export type JobType = "FullTime" | "PartTime" | "Contract" | "Internship";

export const JOB_TYPE_OPTIONS: EnumOption[] = [
  { label: "Full Time", value: "FullTime" },
  { label: "Part Time", value: "PartTime" },
  { label: "Contract", value: "Contract" },
  { label: "Internship", value: "Internship" },
];

export const JOB_TYPE_VALUES: JobType[] = JOB_TYPE_OPTIONS.map(
  (o) => o.value as JobType,
);

/** Lookup a user-friendly label for a backend JobType value. */
export const getJobTypeLabel = (value: JobType): string =>
  JOB_TYPE_OPTIONS.find((o) => o.value === value)?.label ?? value;

// ─── WorkMode ─────────────────────────────────────────────────────────
// Backend: public enum WorkMode
//   None = 0, Onsite = 1, Hybrid = 2, Remote = 3

export type WorkMode = "None" | "Onsite" | "Hybrid" | "Remote";

export const WORK_MODE_OPTIONS: EnumOption[] = [
  { label: "None", value: "None" },
  { label: "On-site", value: "Onsite" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Remote", value: "Remote" },
];

/** Filtered options excluding "None" — used in job post form where
 *  selecting a work mode is required and "None" is not meaningful. */
export const WORK_MODE_OPTIONS_FOR_FORM: EnumOption[] =
  WORK_MODE_OPTIONS.filter((o) => o.value !== "None");

export const WORK_MODE_VALUES: WorkMode[] = WORK_MODE_OPTIONS.map(
  (o) => o.value as WorkMode,
);

/** Lookup a user-friendly label for a backend WorkMode value. */
export const getWorkModeLabel = (value: WorkMode): string =>
  WORK_MODE_OPTIONS.find((o) => o.value === value)?.label ?? value;

// ─── DifficultyLevel ──────────────────────────────────────────────────
// Backend: public enum DifficultyLevel
//   Beginner = 1, Intermediate = 2, Advanced = 3

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export const DIFFICULTY_LEVEL_OPTIONS: EnumOption[] = [
  { label: "Beginner", value: "Beginner" },
  { label: "Intermediate", value: "Intermediate" },
  { label: "Advanced", value: "Advanced" },
];

export const DIFFICULTY_LEVEL_VALUES: DifficultyLevel[] =
  DIFFICULTY_LEVEL_OPTIONS.map((o) => o.value as DifficultyLevel);

/** Lookup a user-friendly label for a backend DifficultyLevel value. */
export const getDifficultyLevelLabel = (value: DifficultyLevel): string =>
  DIFFICULTY_LEVEL_OPTIONS.find((o) => o.value === value)?.label ?? value;

// ─── DeliveryMode ───────────────────────────────────────────────────
// Backend: public enum DeliveryMode
//   Online = 1, InPerson = 2, Hybrid = 3, SelfPaced = 4

export type DeliveryMode = "Online" | "In Person" | "Hybrid" | "Self-Paced";

export const DELIVERY_MODE_OPTIONS: EnumOption[] = [
  { label: "Online", value: "Online" },
  { label: "In Person", value: "In Person" },
  { label: "Hybrid", value: "Hybrid" },
  { label: "Self-Paced", value: "Self-Paced" },
];

export const DELIVERY_MODE_VALUES: DeliveryMode[] = DELIVERY_MODE_OPTIONS.map(
  (o) => o.value as DeliveryMode,
);

/** Lookup a user-friendly label for a backend DeliveryMode value. */
export const getDeliveryModeLabel = (value: DeliveryMode): string =>
  DELIVERY_MODE_OPTIONS.find((o) => o.value === value)?.label ?? value;

// ─── Enum Normalization Helpers ──────────────────────────────────────
//
// The .NET backend may serialize enums as:
//   - PascalCase strings: "Active", "Pending", "FullTime"  (JsonStringEnumConverter)
//   - Numeric integers:   1, 2, 3                          (default .NET serialization)
//   - Stringified ints:   "1", "2", "3"                    (mixed serialization)
//
// These helpers normalize ANY of these variants into the exact
// PascalCase string that our TypeScript union types expect.

/**
 * Normalize a raw ApplicationStatus value from the backend.
 * Handles: numeric (0-4), stringified numeric ("0"-"4"),
 * and any case-variant string ("pending", "PENDING", "Pending").
 */
export const normalizeApplicationStatus = (
  raw: string | number,
): ApplicationStatus => {
  if (typeof raw === "number") {
    switch (raw) {
      case 0:
        return "Pending";
      case 1:
        return "UnderReview";
      case 2:
        return "Accepted";
      case 3:
        return "Rejected";
      case 4:
        return "Withdrawn";
      default:
        return "Pending";
    }
  }

  const trimmed = String(raw).trim();
  if (/^\d+$/.test(trimmed)) {
    switch (Number(trimmed)) {
      case 0:
        return "Pending";
      case 1:
        return "UnderReview";
      case 2:
        return "Accepted";
      case 3:
        return "Rejected";
      case 4:
        return "Withdrawn";
      default:
        return "Pending";
    }
  }

  const lowered = trimmed.toLowerCase();
  switch (lowered) {
    case "pending":
      return "Pending";
    case "underreview":
    case "under review":
      return "UnderReview";
    case "accepted":
      return "Accepted";
    case "rejected":
      return "Rejected";
    case "withdrawn":
      return "Withdrawn";
    default:
      return "Pending";
  }
};

/**
 * Normalize a raw JobStatus value from the backend.
 * Handles: numeric (1-3), stringified numeric ("1"-"3"),
 * and any case-variant string ("active", "ACTIVE", "Active").
 */
export const normalizeJobStatus = (raw: string | number): JobStatus => {
  if (typeof raw === "number") {
    switch (raw) {
      case 1:
        return "Active";
      case 2:
        return "Closed";
      case 3:
        return "Cancelled";
      default:
        return "Active";
    }
  }

  const trimmed = String(raw).trim();
  if (/^\d+$/.test(trimmed)) {
    switch (Number(trimmed)) {
      case 1:
        return "Active";
      case 2:
        return "Closed";
      case 3:
        return "Cancelled";
      default:
        return "Active";
    }
  }

  const lowered = trimmed.toLowerCase();
  switch (lowered) {
    case "active":
      return "Active";
    case "closed":
    case "close":
      return "Closed";
    case "cancelled":
    case "cancel":
      return "Cancelled";
    default:
      return "Active";
  }
};

/**
 * Normalize a raw DifficultyLevel value from the backend.
 * Handles: numeric (1-3), stringified numeric ("1"-"3"),
 * and any case-variant string.
 */
export const normalizeDifficultyLevel = (
  raw: string | number,
): DifficultyLevel => {
  if (typeof raw === "number") {
    switch (raw) {
      case 1:
        return "Beginner";
      case 2:
        return "Intermediate";
      case 3:
        return "Advanced";
      default:
        return "Beginner";
    }
  }

  const trimmed = String(raw).trim();
  if (/^\d+$/.test(trimmed)) {
    switch (Number(trimmed)) {
      case 1:
        return "Beginner";
      case 2:
        return "Intermediate";
      case 3:
        return "Advanced";
      default:
        return "Beginner";
    }
  }

  const lowered = trimmed.toLowerCase();
  switch (lowered) {
    case "beginner":
      return "Beginner";
    case "intermediate":
      return "Intermediate";
    case "advanced":
      return "Advanced";
    default:
      return "Beginner";
  }
};

// ─── Generic Label Lookup Helper ──────────────────────────────────────

/**
 * Generic helper: find the display label for any backend enum value
 * from an EnumOption array. Falls back to the raw value if no match.
 */
export const getEnumLabel = (options: EnumOption[], value: string): string =>
  options.find((o) => o.value === value)?.label ?? value;
