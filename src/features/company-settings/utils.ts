import type {
  CompanyAccountSettings,
  CompanyAccountSettingsFormData,
  CompanyAccountSettingsParsed,
} from "./types";

const FALLBACK_LOGO_URL = "";

const toStringValue = (value?: string | number | null) =>
  value === undefined || value === null ? "" : String(value);

const toBooleanValue = (value?: boolean | null) => Boolean(value);

const toTimeFormat = (value?: string | null) =>
  value === "24h" ? "24h" : "12h";

export const parseCompanyAccountSettings = (
  settings: CompanyAccountSettings,
): CompanyAccountSettingsParsed => ({
  formData: {
    companyName: toStringValue(settings.companyName),
    legalName: toStringValue(settings.legalName),
    industry: toStringValue(settings.industry),
    companySize: toStringValue(settings.companySize),
    website: toStringValue(settings.website),
    headquarters: toStringValue(settings.headquarters),
    description: toStringValue(settings.description),
    primaryContactName: toStringValue(settings.primaryContact?.fullName),
    primaryContactRole: toStringValue(settings.primaryContact?.role),
    primaryContactEmail: toStringValue(settings.primaryContact?.email),
    primaryContactPhone: toStringValue(settings.primaryContact?.phone),
    supportEmail: toStringValue(settings.supportEmail),
    supportPhone: toStringValue(settings.supportPhone),
    planName: toStringValue(settings.billing?.planName),
    billingEmail: toStringValue(settings.billing?.billingEmail),
    paymentMethodLast4: toStringValue(settings.billing?.paymentMethodLast4),
    nextBillingDate: toStringValue(settings.billing?.nextBillingDate),
    timeZone: toStringValue(settings.preferences?.timeZone),
    dateFormat: toStringValue(settings.preferences?.dateFormat),
    timeFormat: toTimeFormat(settings.preferences?.timeFormat),
    defaultTeamRole: toStringValue(settings.team?.defaultRole),
    allowTeamInvites: toBooleanValue(settings.team?.allowInvites),
    requireAdminApproval: toBooleanValue(settings.team?.requireAdminApproval),
    notifyApplicantUpdates: toBooleanValue(
      settings.notifications?.applicantUpdates,
    ),
    notifyInterviewReminders: toBooleanValue(
      settings.notifications?.interviewReminders,
    ),
    notifyWeeklyReports: toBooleanValue(settings.notifications?.weeklyReports),
    notifyProductUpdates: toBooleanValue(
      settings.notifications?.productUpdates,
    ),
    notifyMarketingUpdates: toBooleanValue(
      settings.notifications?.marketingUpdates,
    ),
    twoFactorEnabled: toBooleanValue(settings.security?.twoFactorEnabled),
    loginAlerts: toBooleanValue(settings.security?.loginAlerts),
    sessionTimeoutMinutes: toStringValue(
      settings.security?.sessionTimeoutMinutes ?? 60,
    ),
    accountStatus: settings.accountStatus ?? "active",
  },
  logoUrl: settings.logoUrl || FALLBACK_LOGO_URL,
});

const toNumberValue = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

export const serializeCompanyAccountSettings = ({
  id,
  formData,
  logoUrl,
}: {
  id?: string | null;
  formData: CompanyAccountSettingsFormData;
  logoUrl: string;
}): CompanyAccountSettings => ({
  id: id ?? undefined,
  companyName: formData.companyName,
  legalName: formData.legalName,
  industry: formData.industry,
  companySize: formData.companySize,
  website: formData.website,
  headquarters: formData.headquarters,
  description: formData.description,
  logoUrl,
  accountStatus: formData.accountStatus,
  primaryContact: {
    fullName: formData.primaryContactName,
    role: formData.primaryContactRole,
    email: formData.primaryContactEmail,
    phone: formData.primaryContactPhone,
  },
  supportEmail: formData.supportEmail,
  supportPhone: formData.supportPhone,
  notifications: {
    applicantUpdates: formData.notifyApplicantUpdates,
    interviewReminders: formData.notifyInterviewReminders,
    weeklyReports: formData.notifyWeeklyReports,
    productUpdates: formData.notifyProductUpdates,
    marketingUpdates: formData.notifyMarketingUpdates,
  },
  security: {
    twoFactorEnabled: formData.twoFactorEnabled,
    loginAlerts: formData.loginAlerts,
    sessionTimeoutMinutes: toNumberValue(formData.sessionTimeoutMinutes, 60),
  },
  preferences: {
    timeZone: formData.timeZone,
    dateFormat: formData.dateFormat,
    timeFormat: formData.timeFormat,
  },
  team: {
    defaultRole: formData.defaultTeamRole,
    allowInvites: formData.allowTeamInvites,
    requireAdminApproval: formData.requireAdminApproval,
  },
  billing: {
    planName: formData.planName,
    billingEmail: formData.billingEmail,
    paymentMethodLast4: formData.paymentMethodLast4,
    nextBillingDate: formData.nextBillingDate,
  },
});
