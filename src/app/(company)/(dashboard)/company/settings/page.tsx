"use client";
import { useSession } from "next-auth/react";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bell,
  Building2,
  CreditCard,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { FloatingInput } from "@/components/FloatingInputField";
import { FloatingTextArea } from "@/components/FloatingTextAreaField";
import { ModalOverlay } from "@/components/ModalOverlay";
import { SectionCard } from "@/components/SectionCard";
import ProfileUploadingCard from "@/components/Modal/ProfileUploadingCard";
import {
  useCompanySettings,
  useDeactivateCompanyAccount,
  useUpdateCompanyPassword,
  useUpdateCompanySettings,
  useUploadCompanySettingsLogo,
} from "@/hooks/companySettings";
import {
  parseCompanyAccountSettings,
  serializeCompanyAccountSettings,
} from "@/features/company-settings/utils";
import type { CompanyAccountSettingsFormData } from "@/features/company-settings/types";
import { getErrorMessage } from "@/lib/apiClient/error";

const emptyForm: CompanyAccountSettingsFormData = {
  companyName: "",
  legalName: "",
  industry: "",
  companySize: "",
  website: "",
  headquarters: "",
  description: "",
  primaryContactName: "",
  primaryContactRole: "",
  primaryContactEmail: "",
  primaryContactPhone: "",
  supportEmail: "",
  supportPhone: "",
  planName: "",
  billingEmail: "",
  paymentMethodLast4: "",
  nextBillingDate: "",
  timeZone: "",
  dateFormat: "",
  timeFormat: "12h",
  defaultTeamRole: "",
  allowTeamInvites: false,
  requireAdminApproval: false,
  notifyApplicantUpdates: false,
  notifyInterviewReminders: false,
  notifyWeeklyReports: false,
  notifyProductUpdates: false,
  notifyMarketingUpdates: false,
  twoFactorEnabled: false,
  loginAlerts: false,
  sessionTimeoutMinutes: "60",
  accountStatus: "active",
};

const notificationLabels = [
  {
    key: "notifyApplicantUpdates" as const,
    title: "Applicant updates",
    description: "Get notified when candidates submit applications.",
  },
  {
    key: "notifyInterviewReminders" as const,
    title: "Interview reminders",
    description: "Reminders before scheduled interviews.",
  },
  {
    key: "notifyWeeklyReports" as const,
    title: "Weekly performance reports",
    description: "Insights on hiring activity and job post reach.",
  },
  {
    key: "notifyProductUpdates" as const,
    title: "Product updates",
    description: "Feature releases and platform improvements.",
  },
  {
    key: "notifyMarketingUpdates" as const,
    title: "Marketing tips",
    description: "Best practices and employer branding tips.",
  },
];

const teamSettingsLabels = [
  {
    key: "allowTeamInvites" as const,
    title: "Allow team invitations",
    description: "Let admins invite recruiters and hiring managers.",
  },
  {
    key: "requireAdminApproval" as const,
    title: "Require admin approval",
    description: "New members need admin approval before joining.",
  },
];

export default function CompanyAccountSettingsPage() {
  const { data: session } = useSession();
  const settingsQuery = useCompanySettings({ enabled: !!session });
  const updateSettingsMutation = useUpdateCompanySettings();
  const updatePasswordMutation = useUpdateCompanyPassword();
  const uploadLogoMutation = useUploadCompanySettingsLogo();
  const deactivateMutation = useDeactivateCompanyAccount();

  const [isEditing, setIsEditing] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("");
  const [formData, setFormData] =
    useState<CompanyAccountSettingsFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>(
    {},
  );
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);

  const isSaving = updateSettingsMutation.isPending;
  const isUpdatingPassword = updatePasswordMutation.isPending;
  const isUploadingLogo = uploadLogoMutation.isPending;

  const accountBadge = useMemo(() => {
    const isDeactivated = formData.accountStatus === "deactivated";
    return {
      label: isDeactivated ? "Deactivated" : "Active",
      className: isDeactivated
        ? "bg-red-50 text-red-700 border border-red-200"
        : "bg-emerald-50 text-emerald-700 border border-emerald-200",
    };
  }, [formData.accountStatus]);

  useEffect(() => {
    if (!settingsQuery.data || isEditing) {
      return;
    }

    const parsed = parseCompanyAccountSettings(settingsQuery.data);
    setSettingsId(settingsQuery.data.id ?? null);
    setFormData(parsed.formData);
    setLogoUrl(parsed.logoUrl);
  }, [isEditing, settingsQuery.data]);

  useEffect(() => {
    if (!settingsQuery.error) {
      return;
    }

    setSettingsError(
      getErrorMessage(settingsQuery.error, "Failed to load settings."),
    );
  }, [settingsQuery.error]);

  useEffect(() => {
    if (settingsQuery.isSuccess) {
      setSettingsError(null);
    }
  }, [settingsQuery.isSuccess]);

  const handleChange = useCallback(
    (field: keyof CompanyAccountSettingsFormData, value: string | boolean) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prev) => {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    setErrors({});
  }, []);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      nextErrors.companyName = "Company name is required";
    }
    if (!formData.industry.trim()) {
      nextErrors.industry = "Industry is required";
    }
    if (!formData.primaryContactEmail.trim()) {
      nextErrors.primaryContactEmail = "Primary contact email is required";
    }
    if (!formData.supportEmail.trim()) {
      nextErrors.supportEmail = "Support email is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveSettings = async () => {
    setSettingsError(null);

    if (!validate()) return;

    try {
      const payload = serializeCompanyAccountSettings({
        id: settingsId,
        formData,
        logoUrl,
      });
      const updated = await updateSettingsMutation.mutateAsync(payload);
      const parsed = parseCompanyAccountSettings(updated);
      setSettingsId(updated.id ?? settingsId);
      setFormData(parsed.formData);
      setLogoUrl(parsed.logoUrl);
      setErrors({});
      setIsEditing(false);
    } catch (error) {
      setSettingsError(
        getErrorMessage(error, "Failed to update account settings."),
      );
    }
  };

  const handleLogoUpload = async (file: File) => {
    const previousLogo = logoUrl;
    const previewUrl = URL.createObjectURL(file);
    setLogoUrl(previewUrl);
    setSettingsError(null);

    try {
      const response = await uploadLogoMutation.mutateAsync(file);
      setLogoUrl(response.logoUrl || previewUrl);
    } catch (error) {
      setSettingsError(getErrorMessage(error, "Failed to upload logo."));
      setLogoUrl(previousLogo);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handlePasswordChange = (
    field: keyof typeof passwordForm,
    value: string,
  ) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    setPasswordErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setPasswordMessage(null);
  };

  const validatePassword = () => {
    const nextErrors: Record<string, string> = {};

    if (!passwordForm.currentPassword.trim()) {
      nextErrors.currentPassword = "Current password is required";
    }
    if (passwordForm.newPassword.length < 8) {
      nextErrors.newPassword = "Password must be at least 8 characters";
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    setPasswordMessage(null);

    if (!validatePassword()) return;

    try {
      await updatePasswordMutation.mutateAsync({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordMessage("Password updated successfully.");
    } catch (error) {
      setPasswordMessage(getErrorMessage(error, "Failed to update password."));
    }
  };

  const handleDeactivate = async () => {
    try {
      const updated = await deactivateMutation.mutateAsync();
      const parsed = parseCompanyAccountSettings(updated);
      setFormData(parsed.formData);
      setLogoUrl(parsed.logoUrl);
      setIsDeactivateOpen(false);
    } catch (error) {
      setSettingsError(getErrorMessage(error, "Failed to deactivate account."));
    }
  };

  if (settingsQuery.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="h-20 animate-pulse rounded-xl bg-neutral-100" />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="h-40 animate-pulse rounded-xl bg-neutral-100" />
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="h-56 animate-pulse rounded-xl bg-neutral-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 flex flex-col gap-8">
      {settingsError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
          {settingsError}
        </div>
      )}

      <ProfileUploadingCard
        companyName={formData.companyName}
        industry={formData.industry}
        location={formData.headquarters}
        logoUrl={logoUrl}
        isEditing={isEditing}
        isSaving={isSaving}
        isUploadingLogo={isUploadingLogo}
        editLabel="Update settings"
        saveLabel="Save settings"
        onEdit={handleStartEditing}
        onSave={() => void handleSaveSettings()}
        onLogoUpload={handleLogoUpload}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-neutral-800">
            Account status
          </h2>
          <Badge className={accountBadge.className}>{accountBadge.label}</Badge>
        </div>
        {isEditing && (
          <Button
            variant="outline"
            className="border-neutral-300 text-neutral-700"
            onClick={() => {
              if (settingsQuery.data) {
                const parsed = parseCompanyAccountSettings(settingsQuery.data);
                setFormData(parsed.formData);
                setLogoUrl(parsed.logoUrl);
              }
              setErrors({});
              setIsEditing(false);
            }}
          >
            Cancel changes
          </Button>
        )}
      </div>

      <SectionCard icon={Building2} title="Company information">
        {isEditing ? (
          <div className="flex flex-col gap-6">
            <FloatingInput
              id="companyName"
              label="Company name"
              value={formData.companyName}
              onChange={(event) =>
                handleChange("companyName", event.target.value)
              }
              placeholder="e.g. Joblin Labs"
              required
              error={errors.companyName}
            />
            <FloatingInput
              id="legalName"
              label="Legal name"
              value={formData.legalName}
              onChange={(event) =>
                handleChange("legalName", event.target.value)
              }
              placeholder="e.g. Joblin Labs LLC"
            />
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
              <FloatingInput
                id="industry"
                label="Industry"
                value={formData.industry}
                onChange={(event) =>
                  handleChange("industry", event.target.value)
                }
                placeholder="e.g. Recruiting software"
                required
                error={errors.industry}
              />
              <FloatingInput
                id="companySize"
                label="Company size"
                value={formData.companySize}
                onChange={(event) =>
                  handleChange("companySize", event.target.value)
                }
                placeholder="e.g. 51-200"
              />
            </div>
            <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
              <FloatingInput
                id="website"
                label="Website"
                value={formData.website}
                onChange={(event) =>
                  handleChange("website", event.target.value)
                }
                placeholder="https://company.com"
              />
              <FloatingInput
                id="headquarters"
                label="Headquarters"
                value={formData.headquarters}
                onChange={(event) =>
                  handleChange("headquarters", event.target.value)
                }
                placeholder="e.g. Austin, TX"
              />
            </div>
            <FloatingTextArea
              id="description"
              label="Company summary"
              value={formData.description}
              onChange={(event) =>
                handleChange("description", event.target.value)
              }
              placeholder="Share your mission, culture, and hiring focus."
              maxLength={420}
            />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Company name</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.companyName || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Legal name</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.legalName || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Industry</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.industry || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Company size</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.companySize || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Website</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.website || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Headquarters</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.headquarters || "-"}
              </p>
            </div>
            <div className="md:col-span-2 rounded-lg border border-neutral-100 bg-neutral-50 p-4 text-sm text-neutral-600">
              {formData.description || "No company summary provided."}
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard icon={UserRound} title="Primary contact">
        {isEditing ? (
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
            <FloatingInput
              id="primaryContactName"
              label="Full name"
              value={formData.primaryContactName}
              onChange={(event) =>
                handleChange("primaryContactName", event.target.value)
              }
              placeholder="e.g. Hannah Reed"
            />
            <FloatingInput
              id="primaryContactRole"
              label="Role"
              value={formData.primaryContactRole}
              onChange={(event) =>
                handleChange("primaryContactRole", event.target.value)
              }
              placeholder="e.g. Head of People"
            />
            <FloatingInput
              id="primaryContactEmail"
              label="Email"
              value={formData.primaryContactEmail}
              onChange={(event) =>
                handleChange("primaryContactEmail", event.target.value)
              }
              placeholder="hiring@company.com"
              required
              error={errors.primaryContactEmail}
            />
            <FloatingInput
              id="primaryContactPhone"
              label="Phone"
              value={formData.primaryContactPhone}
              onChange={(event) =>
                handleChange("primaryContactPhone", event.target.value)
              }
              placeholder="+1 (555) 902-2211"
            />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Full name</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.primaryContactName || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Role</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.primaryContactRole || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Email</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.primaryContactEmail || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Phone</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.primaryContactPhone || "-"}
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard icon={Users} title="Team settings">
        {isEditing ? (
          <div className="flex flex-col gap-6">
            <FloatingInput
              id="defaultTeamRole"
              label="Default member role"
              value={formData.defaultTeamRole}
              onChange={(event) =>
                handleChange("defaultTeamRole", event.target.value)
              }
              placeholder="e.g. Recruiter"
            />
            <div className="grid gap-4">
              {teamSettingsLabels.map((option) => (
                <label
                  key={option.key}
                  className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4"
                >
                  <Checkbox
                    checked={formData[option.key]}
                    onCheckedChange={(checked) =>
                      handleChange(option.key, checked === true)
                    }
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-neutral-800">
                      {option.title}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {option.description}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
              <span className="text-sm text-neutral-600">Default role</span>
              <span className="text-sm font-medium text-neutral-800">
                {formData.defaultTeamRole || "-"}
              </span>
            </div>
            {teamSettingsLabels.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3"
              >
                <span className="text-sm text-neutral-600">{option.title}</span>
                <Badge
                  className={
                    formData[option.key]
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }
                >
                  {formData[option.key] ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard icon={Bell} title="Notifications">
        {isEditing ? (
          <div className="grid gap-4">
            {notificationLabels.map((option) => (
              <label
                key={option.key}
                className="flex items-start gap-3 rounded-lg border border-neutral-200 p-4"
              >
                <Checkbox
                  checked={formData[option.key]}
                  onCheckedChange={(checked) =>
                    handleChange(option.key, checked === true)
                  }
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-neutral-800">
                    {option.title}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {option.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        ) : (
          <div className="grid gap-3">
            {notificationLabels.map((option) => (
              <div
                key={option.key}
                className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3"
              >
                <span className="text-sm text-neutral-600">{option.title}</span>
                <Badge
                  className={
                    formData[option.key]
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }
                >
                  {formData[option.key] ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard icon={ShieldCheck} title="Security">
        <div className="grid gap-6">
          {isEditing ? (
            <div className="grid gap-4 md:grid-cols-2">
              <FloatingInput
                id="sessionTimeoutMinutes"
                label="Session timeout (minutes)"
                value={formData.sessionTimeoutMinutes}
                onChange={(event) =>
                  handleChange("sessionTimeoutMinutes", event.target.value)
                }
                placeholder="60"
                type="number"
              />
              <div className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4">
                <Checkbox
                  checked={formData.twoFactorEnabled}
                  onCheckedChange={(checked) =>
                    handleChange("twoFactorEnabled", checked === true)
                  }
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-neutral-800">
                    Enable two-factor authentication
                  </span>
                  <span className="text-xs text-neutral-500">
                    Require a second factor for admin sign-in.
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-neutral-200 p-4 md:col-span-2">
                <Checkbox
                  checked={formData.loginAlerts}
                  onCheckedChange={(checked) =>
                    handleChange("loginAlerts", checked === true)
                  }
                />
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-neutral-800">
                    Login alerts
                  </span>
                  <span className="text-xs text-neutral-500">
                    Alert primary contacts about new logins.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                <span className="text-sm text-neutral-600">
                  Session timeout
                </span>
                <span className="text-sm font-medium text-neutral-800">
                  {formData.sessionTimeoutMinutes} minutes
                </span>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                <span className="text-sm text-neutral-600">
                  Two-factor auth
                </span>
                <Badge
                  className={
                    formData.twoFactorEnabled
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }
                >
                  {formData.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3">
                <span className="text-sm text-neutral-600">Login alerts</span>
                <Badge
                  className={
                    formData.loginAlerts
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                  }
                >
                  {formData.loginAlerts ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-neutral-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-neutral-800">
                  Change password
                </p>
                <p className="text-xs text-neutral-500">
                  Update the primary admin password for this account.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <FloatingInput
                id="currentPassword"
                label="Current password"
                value={passwordForm.currentPassword}
                onChange={(event) =>
                  handlePasswordChange("currentPassword", event.target.value)
                }
                placeholder="********"
                type="password"
                error={passwordErrors.currentPassword}
              />
              <FloatingInput
                id="newPassword"
                label="New password"
                value={passwordForm.newPassword}
                onChange={(event) =>
                  handlePasswordChange("newPassword", event.target.value)
                }
                placeholder="At least 8 characters"
                type="password"
                error={passwordErrors.newPassword}
              />
              <FloatingInput
                id="confirmPassword"
                label="Confirm password"
                value={passwordForm.confirmPassword}
                onChange={(event) =>
                  handlePasswordChange("confirmPassword", event.target.value)
                }
                placeholder="Repeat new password"
                type="password"
                error={passwordErrors.confirmPassword}
              />
            </div>
            {passwordMessage && (
              <p className="mt-3 text-xs text-neutral-600">{passwordMessage}</p>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => void handleUpdatePassword()}
                disabled={isUpdatingPassword}
                className="h-8 rounded-lg bg-emerald-600 px-4 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
              >
                {isUpdatingPassword ? "Updating..." : "Update password"}
              </Button>
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard icon={CreditCard} title="Billing & preferences">
        {isEditing ? (
          <div className="grid gap-6 md:grid-cols-2">
            <FloatingInput
              id="planName"
              label="Current plan"
              value={formData.planName}
              onChange={(event) => handleChange("planName", event.target.value)}
              placeholder="e.g. Growth"
            />
            <FloatingInput
              id="billingEmail"
              label="Billing email"
              value={formData.billingEmail}
              onChange={(event) =>
                handleChange("billingEmail", event.target.value)
              }
              placeholder="billing@company.com"
            />
            <FloatingInput
              id="paymentMethodLast4"
              label="Payment method"
              value={formData.paymentMethodLast4}
              onChange={(event) =>
                handleChange("paymentMethodLast4", event.target.value)
              }
              placeholder="Visa **** 4242"
            />
            <FloatingInput
              id="nextBillingDate"
              label="Next billing date"
              value={formData.nextBillingDate}
              onChange={(event) =>
                handleChange("nextBillingDate", event.target.value)
              }
              placeholder="2026-06-01"
            />
            <FloatingInput
              id="supportEmail"
              label="Support email"
              value={formData.supportEmail}
              onChange={(event) =>
                handleChange("supportEmail", event.target.value)
              }
              placeholder="support@company.com"
              required
              error={errors.supportEmail}
            />
            <FloatingInput
              id="supportPhone"
              label="Support phone"
              value={formData.supportPhone}
              onChange={(event) =>
                handleChange("supportPhone", event.target.value)
              }
              placeholder="+1 (555) 881-2341"
            />
            <FloatingInput
              id="timeZone"
              label="Time zone"
              value={formData.timeZone}
              onChange={(event) => handleChange("timeZone", event.target.value)}
              placeholder="America/Chicago"
            />
            <FloatingInput
              id="dateFormat"
              label="Date format"
              value={formData.dateFormat}
              onChange={(event) =>
                handleChange("dateFormat", event.target.value)
              }
              placeholder="MM/DD/YYYY"
            />
            <FloatingInput
              id="timeFormat"
              label="Time format"
              value={formData.timeFormat}
              onChange={(event) =>
                handleChange("timeFormat", event.target.value)
              }
              placeholder="12h or 24h"
            />
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Plan</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.planName || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Billing email</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.billingEmail || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Payment method</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.paymentMethodLast4 || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Next billing date</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.nextBillingDate || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Support email</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.supportEmail || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Support phone</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.supportPhone || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Time zone</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.timeZone || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Date format</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.dateFormat || "-"}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-neutral-400 text-sm">Time format</p>
              <p className="text-neutral-800 text-base font-medium">
                {formData.timeFormat || "-"}
              </p>
            </div>
          </div>
        )}
      </SectionCard>

      <SectionCard icon={CreditCard} title="Account actions">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-4">
            <div>
              <p className="text-sm font-semibold text-neutral-800">
                Deactivate account
              </p>
              <p className="text-xs text-neutral-500">
                Temporarily disable hiring actions and hide postings.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setIsDeactivateOpen(true)}
              disabled={formData.accountStatus === "deactivated"}
            >
              Deactivate
            </Button>
          </div>
        </div>
      </SectionCard>

      <ModalOverlay
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
      >
        <div className="p-6">
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-neutral-800">
              Deactivate company account?
            </h3>
            <p className="text-sm text-neutral-600">
              This will pause job postings and hide your company profile until
              reactivated by an administrator.
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeactivateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={() => void handleDeactivate()}
              disabled={deactivateMutation.isPending}
            >
              {deactivateMutation.isPending ? "Deactivating..." : "Deactivate"}
            </Button>
          </div>
        </div>
      </ModalOverlay>
    </div>
  );
}
