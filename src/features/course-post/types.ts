import type {
  DifficultyLevel,
  DeliveryMode,
  EnumOption,
  TechnicalDomain,
} from "@/features/enums";
import {
  DELIVERY_MODE_OPTIONS,
  DELIVERY_MODE_VALUES,
  DIFFICULTY_LEVEL_OPTIONS,
  DIFFICULTY_LEVEL_VALUES,
  TECHNICAL_DOMAIN_OPTIONS,
  TECHNICAL_DOMAIN_VALUES,
  getDifficultyLevelLabel,
  getDeliveryModeLabel,
  getTechnicalDomainLabel,
} from "@/features/enums";

// Re-export centralized enum types and helpers for downstream consumers
export type { DifficultyLevel, DeliveryMode, EnumOption, TechnicalDomain };
export {
  DELIVERY_MODE_OPTIONS,
  DELIVERY_MODE_VALUES,
  DIFFICULTY_LEVEL_OPTIONS,
  DIFFICULTY_LEVEL_VALUES,
  TECHNICAL_DOMAIN_OPTIONS,
  TECHNICAL_DOMAIN_VALUES,
  getDifficultyLevelLabel,
  getDeliveryModeLabel,
  getTechnicalDomainLabel,
};

export type CoursePostFormState = {
  title: string;
  technicalDomain: TechnicalDomain | "";
  difficultyLevel: DifficultyLevel | "";
  deliveryMode: DeliveryMode | "";
  country: string;
  city: string;
  street: string;
  duration: string;
  enrollmentUrl: string;
  outcomeDescription: string;
  description: string;
  price: string;
  currency: string;
  hasCertificate: boolean;
  startDate: string;
  endDate: string;
  deadline: string;
};

export type CoursePostPayload = {
  title: string;
  technicalDomain: TechnicalDomain;
  difficultyLevel: DifficultyLevel;
  deliveryMode: DeliveryMode;
  country: string;
  city: string;
  duration: string;
  enrollmentUrl: string;
  outcomeDescription: string;
  description?: string | null;
  street?: string | null;
  price?: number | null;
  currency?: string | null;
  hasCertificate?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  deadline?: string | null;
  providedSkillIds?: number[];
};

export type SubmitCoursePostResponse = {
  id: string;
  title: string;
  createdAt: string;
  companyId?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
  deadline?: string | null;
};
