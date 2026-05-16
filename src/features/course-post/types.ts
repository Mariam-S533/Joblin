import type { DifficultyLevel, EnumOption } from "@/features/enums";
import {
  DIFFICULTY_LEVEL_OPTIONS,
  DIFFICULTY_LEVEL_VALUES,
  getDifficultyLevelLabel,
} from "@/features/enums";

// Re-export centralized enum types and helpers for downstream consumers
export type { DifficultyLevel, EnumOption };
export { DIFFICULTY_LEVEL_OPTIONS, DIFFICULTY_LEVEL_VALUES, getDifficultyLevelLabel };

export type DeliveryMode = "Online" | "In Person" | "Hybrid" | "Self-Paced";

export type CourseBenefit = "Online Access" | "Certificate" | "Lifetime Access";

export type CoursePostTemplate = {
  courseTitle: string;
  courseCategory: string;
  organizationIndustry: string;
  /** → API "courseLevel" — MUST be exact DifficultyLevel backend enum value.
   *  Empty string "" means no selection yet (form default). */
  courseLevel: DifficultyLevel | "";
  /** Available difficulty level options for the dropdown UI (EnumOption[]) */
  courseLevelOptions: EnumOption[];
  deliveryModes: DeliveryMode[];
  selectedDeliveryModes: DeliveryMode[];
  country: string;
  city: string;
  priceAmount: string;
  displayPriceInPost: boolean;
  benefits: CourseBenefit[];
  selectedBenefits: CourseBenefit[];
  skills: string[];
  learningOutcomes: string[];
  courseDescription: string;
  duration: string;
  maxStudents: string;
  startDate: string;
  endDate: string;
  instructorName: string;
  instructorBio: string;
};

export type CoursePostPayload = {
  courseTitle: string;
  courseCategory: string;
  organizationIndustry: string;
  /** Exact backend DifficultyLevel enum value */
  courseLevel: DifficultyLevel;
  selectedDeliveryModes: DeliveryMode[];
  country: string;
  city: string;
  priceAmount: string;
  displayPriceInPost: boolean;
  selectedBenefits: CourseBenefit[];
  skills: string[];
  learningOutcomes: string[];
  courseDescription: string;
  duration: string;
  maxStudents: string;
  startDate: string;
  endDate: string;
  instructorName: string;
  instructorBio: string;
};

export type SubmitCoursePostResponse = {
  id: string;
  status: "draft" | "published";
  message: string;
};
