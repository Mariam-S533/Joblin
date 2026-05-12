"use client";

import React from "react";
import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileUploadingCardProps {
  companyName: string;
  industry: string;
  location: string;
  logoUrl: string;
  isEditing: boolean;
  isSaving?: boolean;
  isUploadingLogo?: boolean;
  editLabel?: string;
  saveLabel?: string;
  onEdit: () => void;
  onSave: () => void;
  onLogoUpload?: (file: File) => void;
}

export const ProfileUploadingCard: React.FC<ProfileUploadingCardProps> = ({
  companyName,
  industry,
  location,
  logoUrl,
  isEditing,
  isSaving = false,
  isUploadingLogo = false,
  editLabel = "Update Profile",
  saveLabel = "Save Profile",
  onEdit,
  onSave,
  onLogoUpload,
}) => {
  const country = location.split(",").pop()?.trim() || location || "Country";
  const actionLabel = isEditing
    ? isSaving
      ? "Saving..."
      : saveLabel
    : editLabel;
  const isActionDisabled = isEditing && isSaving;

  return (
    <div className="w-full rounded-2xl border border-[#EDEDED] bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="group relative h-30 w-30 shrink-0 overflow-hidden rounded-2xl border border-dashed border-[#222222] bg-[#F8F8F8]">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={companyName || "Company logo"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ImagePlus className="h-10 w-10 text-[#7A7A7A]" />
              </div>
            )}

            {isEditing && (
              <>
                <input
                  id="profile-card-logo-upload"
                  type="file"
                  accept="image/*"
                  disabled={isUploadingLogo}
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (!file) {
                      return;
                    }
                    onLogoUpload?.(file);
                    event.target.value = "";
                  }}
                />
                <label
                  htmlFor="profile-card-logo-upload"
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  {isUploadingLogo ? "Uploading..." : "Upload"}
                </label>
              </>
            )}
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            <p className="truncate text-base font-medium text-[#028759]">
              {companyName || "Company Name"}
            </p>
            <div className="flex items-center gap-2 text-sm font-normal text-[#515151]">
              <span className="truncate">{industry || "Industry"}</span>
              <span aria-hidden="true">•</span>
              <span className="truncate">{country}</span>
            </div>
          </div>
        </div>

        <div className="flex sm:justify-end">
          <Button
            onClick={isEditing ? onSave : onEdit}
            disabled={isActionDisabled}
            className="h-8 rounded-lg bg-[#02905E] px-4 py-1.75 text-sm font-normal text-white hover:bg-[#028759] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUploadingCard;
