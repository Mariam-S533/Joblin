"use client";
import { useSession } from "next-auth/react";

import React, { useCallback, useMemo, useState } from "react";
import { Building2, AlignLeft } from "lucide-react";
import { toast } from "sonner";
import { FloatingInput } from "@/components/FloatingInputField";
import { FloatingTextArea } from "@/components/FloatingTextAreaField";
import { SectionCard } from "@/components/SectionCard";
import { ProfileUploadingCard } from "@/components/Modal/ProfileUploadingCard";
import { useGetCompanyById, useUpsertCompany } from "@/hooks/companyProfile";
import { uploadCompanySettingsLogo } from "@/services/companySettingsService";
import {
  mapCompanyDataToEditForm,
  mapEditFormToUpsertPayload,
} from "@/features/company-profile/utils";
import type {
  CompanyEditFormData,
  AddressResponse,
} from "@/features/company-profile/types";
import { ApiError } from "@/lib/apiClient/error";
import { getErrorMessage } from "@/lib/apiClient/error";

const FALLBACK_LOGO = "";

const EMPTY_FORM: CompanyEditFormData = {
  companyName: "",
  publicContactMail: "",
  domain: "",
  companySize: "",
  description: "",
};

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] =
    useState<CompanyEditFormData>(EMPTY_FORM);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [logoError, setLogoError] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const { data: session } = useSession();
  const userId = session?.id as string;

  const profileQuery = useGetCompanyById(userId, {
    enabled: !!userId,
  });

  const upsertMutation = useUpsertCompany();
  const isSaving = upsertMutation.isPending;

  const companyData = profileQuery.data;
  const isExpectedLookupError =
    profileQuery.error instanceof ApiError &&
    (profileQuery.error.status === 400 || profileQuery.error.status === 404);

  const profileError =
    profileQuery.error && !isExpectedLookupError
      ? getErrorMessage(profileQuery.error, "Failed to load company profile")
      : null;

  const displayFormData = useMemo(
    () => (companyData ? mapCompanyDataToEditForm(companyData) : EMPTY_FORM),
    [companyData],
  );

  const rawLogoUrl = companyData?.logoUrl || "";
  const displayLogoUrl = rawLogoUrl
    ? rawLogoUrl.startsWith("http") || rawLogoUrl.startsWith("data:")
      ? rawLogoUrl
      : `data:image/jpeg;base64,${rawLogoUrl}`
    : FALLBACK_LOGO;

  const primaryAddress =
    companyData?.addresses?.find((a) => a.isHeadQuarters) ??
    companyData?.addresses?.[0];
  const displayLocation = primaryAddress
    ? `${primaryAddress.city ?? ""}, ${primaryAddress.country ?? ""}`
    : "—";

  const activeFormData = isEditing ? editFormData : displayFormData;
  const activeLogoUrl = logoPreviewUrl || displayLogoUrl;

  const handleChange = useCallback(
    (field: keyof CompanyEditFormData, value: string) => {
      setEditFormData((prev) => ({ ...prev, [field]: value }));
      setValidationErrors((prev) => {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    [],
  );

  const handleStartEditing = useCallback(() => {
    if (companyData) {
      setEditFormData(mapCompanyDataToEditForm(companyData));
    }
    setIsEditing(true);
    setValidationErrors({});
    setLogoError(null);
  }, [companyData]);

  const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  const MAX_FILE_SIZE_MB = 5;

  const handleLogoUpload = async (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only JPEG, PNG, WEBP, or GIF images are allowed.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File size must be under ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const previousPreview = logoPreviewUrl;
    setIsUploadingLogo(true);
    setLogoError(null);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreviewUrl(previewUrl);

    try {
      const response = await uploadCompanySettingsLogo(file);
      setLogoPreviewUrl(response.imageUrl);
      URL.revokeObjectURL(previewUrl);
      toast.success("Profile picture uploaded successfully.");
      profileQuery.refetch();
    } catch (error) {
      setLogoError(getErrorMessage(error, "Failed to upload profile picture."));
      setLogoPreviewUrl(previousPreview);
      URL.revokeObjectURL(previewUrl);
      toast.error("Failed to upload profile picture.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editFormData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!editFormData.publicContactMail.trim())
      newErrors.publicContactMail = "Contact email is required";
    if (!editFormData.description.trim())
      newErrors.description = "Description is required";
    if (editFormData.companySize && Number.isNaN(Number(editFormData.companySize)))
      newErrors.companySize = "Company size must be a number";

    setValidationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validate()) return;
    if (!userId) return;

    const existingAddresses: AddressResponse[] = companyData?.addresses ?? [];
    const addressesForPayload = existingAddresses.length > 0
      ? existingAddresses.map((addr) => ({
          branchName: addr.branchName ?? "",
          country: addr.country ?? "",
          city: addr.city ?? "",
          regionOrState: addr.regionOrState ?? null,
          postalCode: addr.postalCode ?? null,
          isHeadQuarters: addr.isHeadQuarters ?? false,
        }))
      : [];

    const payload = mapEditFormToUpsertPayload(
      userId,
      editFormData,
      addressesForPayload,
    );

    try {
      await upsertMutation.mutateAsync({ id: userId, payload });
      setValidationErrors({});
      setIsEditing(false);
      toast.success("Profile updated successfully.");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const mutationError = upsertMutation.error
    ? getErrorMessage(upsertMutation.error, "Failed to save company profile")
    : null;

  const combinedError = profileError || mutationError || logoError;

  return (
    <>
      <div className="w-full px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8 flex flex-col gap-8">
        {profileQuery.isLoading && (
          <div className="rounded-2xl border border-[#EDEDED] bg-white p-4">
            <div className="flex animate-pulse items-center gap-4">
              <div className="h-30 w-30 rounded-2xl bg-neutral-100" />
              <div className="flex flex-1 flex-col gap-3">
                <div className="h-4 w-36 rounded bg-neutral-100" />
                <div className="h-3 w-52 rounded bg-neutral-100" />
              </div>
              <div className="h-8 w-28 rounded-lg bg-neutral-100" />
            </div>
          </div>
        )}
        {combinedError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {combinedError}
          </div>
        )}

        {companyData && (
          <ProfileUploadingCard
            companyName={activeFormData.companyName}
            industry={activeFormData.domain}
            location={displayLocation}
            logoUrl={activeLogoUrl}
            isEditing={isEditing}
            isSaving={isSaving}
            isUploadingLogo={isUploadingLogo}
            onEdit={handleStartEditing}
            onSave={() => void handleSaveProfile()}
            onLogoUpload={handleLogoUpload}
          />
        )}

        <SectionCard icon={Building2} title="Company Information">
          {isEditing ? (
            <div className="flex flex-col gap-6">
              <FloatingInput
                id="companyName"
                label="Company Name"
                value={editFormData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="e.g. BMW"
                required
                error={validationErrors.companyName}
              />
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                <FloatingInput
                  id="domain"
                  label="Domain / Industry"
                  value={editFormData.domain}
                  onChange={(e) => handleChange("domain", e.target.value)}
                  placeholder="e.g. Automotives"
                />
                <FloatingInput
                  id="companySize"
                  label="Company Size"
                  value={editFormData.companySize}
                  onChange={(e) => handleChange("companySize", e.target.value)}
                  placeholder="e.g. 1000"
                />
              </div>
              <FloatingInput
                id="publicContactMail"
                label="Public Contact Email"
                value={editFormData.publicContactMail}
                onChange={(e) =>
                  handleChange("publicContactMail", e.target.value)
                }
                placeholder="contact@company.com"
                required
                error={validationErrors.publicContactMail}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-neutral-400 text-sm font-normal">
                  Company Name
                </p>
                <p className="text-neutral-800 text-base font-medium wrap-break-word">
                  {displayFormData.companyName || "—"}
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Domain / Industry
                  </p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {displayFormData.domain || "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Company Size
                  </p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {displayFormData.companySize || "—"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-neutral-400 text-sm font-normal">
                  Public Contact Email
                </p>
                <p className="text-neutral-800 text-base font-medium wrap-break-word">
                  {displayFormData.publicContactMail || "—"}
                </p>
              </div>
              {primaryAddress && (
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Headquarters
                  </p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {primaryAddress.branchName
                      ? `${primaryAddress.branchName} — ${displayLocation}`
                      : displayLocation}
                  </p>
                </div>
              )}
            </div>
          )}
        </SectionCard>

        <SectionCard icon={AlignLeft} title="Company Description">
          {isEditing ? (
            <FloatingTextArea
              id="description"
              label="Description"
              value={editFormData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your company, its mission, values, and what makes it unique..."
              maxLength={512}
              required
              error={validationErrors.description}
            />
          ) : (
            <div className="text-neutral-600 text-sm font-normal bg-gray-50 p-6 rounded-lg border border-gray-100">
              {displayFormData.description || "—"}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
