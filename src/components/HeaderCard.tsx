import React from "react";
import { Button } from "@/components/ui/button";

type HeaderCardProps = {
  companyName: string;
  industry: string;
  location: string;
  logoUrl: string;
  isEditing: boolean;
  onEditToggle: (value: boolean) => void;
  onLogoUpload?: (file: File) => void;
  isSaving?: boolean;
  isUploadingLogo?: boolean;
};

const FALLBACK_LOGO_URL = "";

export const HeaderCard = ({
  companyName,
  industry,
  location,
  logoUrl,
  isEditing,
  onEditToggle,
  onLogoUpload,
  isSaving = false,
  isUploadingLogo = false,
}: HeaderCardProps) => (
  <div className="w-full p-5 bg-white rounded-2xl border border-gray-200 flex justify-between items-center gap-4 backdrop-blur-md">
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="w-28 h-28 relative rounded-2xl border border-neutral-200 overflow-hidden flex items-center justify-center bg-gray-50">
          <img
            src={logoUrl || FALLBACK_LOGO_URL}
            alt={companyName}
            className="w-full h-full object-cover p-2"
          />
        </div>
        {isEditing && (
          <>
            <input
              id="company-logo-upload"
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
              htmlFor="company-logo-upload"
              className={`text-xs font-medium transition ${
                isUploadingLogo
                  ? "text-neutral-400 cursor-not-allowed"
                  : "text-emerald-600 hover:text-emerald-700 cursor-pointer"
              }`}
            >
              {isUploadingLogo ? "Uploading..." : "Upload logo"}
            </label>
          </>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-emerald-700 text-lg font-bold font-['Inter']">
          {companyName || "Company Name"}
        </div>
        <div className="flex items-center gap-2 text-neutral-500 text-sm font-medium font-['Inter']">
          <span>{industry || "Industry"}</span>
          <div className="w-1 h-1 bg-neutral-400 rounded-full"></div>
          <span>{location?.split(",").pop()?.trim() || "Country"}</span>
        </div>
      </div>
    </div>

    <div>
      {isEditing ? (
        <Button
          onClick={() => onEditToggle(false)}
          disabled={isSaving}
          className="h-8 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 transition rounded-lg text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </Button>
      ) : (
        <Button
          onClick={() => onEditToggle(true)}
          variant="outline"
          className="h-8 px-4 py-2 bg-white border border-emerald-600 hover:bg-emerald-50 transition rounded-lg text-emerald-600 text-sm font-medium"
        >
          Update Profile
        </Button>
      )}
    </div>
  </div>
);
