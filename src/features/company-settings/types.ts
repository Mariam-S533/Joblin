export type CompanyAccountStatus = "active" | "deactivated";

export type CompanyPrimaryContact = {
  fullName?: string;
  role?: string;
  email?: string;
  phone?: string;
};

export type CompanyNotificationSettings = {
  applicantUpdates?: boolean;
  interviewReminders?: boolean;
  weeklyReports?: boolean;
  productUpdates?: boolean;
  marketingUpdates?: boolean;
};

export type CompanySecuritySettings = {
  twoFactorEnabled?: boolean;
  loginAlerts?: boolean;
  sessionTimeoutMinutes?: number;
  lastPasswordChangeAt?: string;
};

export type CompanyPreferences = {
  timeZone?: string;
  dateFormat?: string;
  timeFormat?: "12h" | "24h";
};

export type CompanyTeamSettings = {
  defaultRole?: string;
  allowInvites?: boolean;
  requireAdminApproval?: boolean;
};

export type CompanyBillingSettings = {
  planName?: string;
  billingEmail?: string;
  paymentMethodLast4?: string;
  nextBillingDate?: string;
};

export type CompanyAccountSettings = {
  id?: string;
  companyName?: string;
  legalName?: string;
  industry?: string;
  companySize?: string;
  website?: string;
  headquarters?: string;
  description?: string;
  logoUrl?: string;
  accountStatus?: CompanyAccountStatus;
  primaryContact?: CompanyPrimaryContact;
  supportEmail?: string;
  supportPhone?: string;
  notifications?: CompanyNotificationSettings;
  security?: CompanySecuritySettings;
  preferences?: CompanyPreferences;
  team?: CompanyTeamSettings;
  billing?: CompanyBillingSettings;
};

export type CompanyAccountSettingsFormData = {
  companyName: string;
  legalName: string;
  industry: string;
  companySize: string;
  website: string;
  headquarters: string;
  description: string;
  primaryContactName: string;
  primaryContactRole: string;
  primaryContactEmail: string;
  primaryContactPhone: string;
  supportEmail: string;
  supportPhone: string;
  planName: string;
  billingEmail: string;
  paymentMethodLast4: string;
  nextBillingDate: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
  defaultTeamRole: string;
  allowTeamInvites: boolean;
  requireAdminApproval: boolean;
  notifyApplicantUpdates: boolean;
  notifyInterviewReminders: boolean;
  notifyWeeklyReports: boolean;
  notifyProductUpdates: boolean;
  notifyMarketingUpdates: boolean;
  twoFactorEnabled: boolean;
  loginAlerts: boolean;
  sessionTimeoutMinutes: string;
  accountStatus: CompanyAccountStatus;
};

export type CompanyAccountSettingsParsed = {
  formData: CompanyAccountSettingsFormData;
  logoUrl: string;
};

export type CompanyPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type CompanyPasswordResponse = {
  updatedAt: string;
};

export type CompanyLogoResponse = {
  logoUrl: string;
};
