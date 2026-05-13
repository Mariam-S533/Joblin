"use client";
import { useSession } from "next-auth/react";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Upload,
  Building2,
  AlignLeft,
  Image as ImageIcon,
  Users,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AddTeamMemberModal, {
  type TeamMember,
} from "@/components/Modal/AddTeamMemberModal";
import { FloatingInput } from "@/components/FloatingInputField";
import { FloatingTextArea } from "@/components/FloatingTextAreaField";
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder";
import { TeamMemberCard } from "@/components/TeamMemberCard";
import { SectionCard } from "@/components/SectionCard";
import { ProfileUploadingCard } from "@/components/Modal/ProfileUploadingCard";
import {
  useAddTeamMember,
  useCompanyProfile,
  useRemoveTeamMember,
  useUpdateCompanyProfile,
  useUploadCompanyLogo,
  useUploadCompanyPhotos,
} from "@/hooks/companyProfile";
import {
  parseCompanyProfile,
  serializeCompanyProfile,
} from "@/features/company-profile/utils";
import type { CompanyProfileFormData } from "@/features/company-profile/types";
import { getErrorMessage } from "@/lib/apiClient/error";

type TeamMemberWithId = TeamMember & { id?: string };

const FALLBACK_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg";

export default function CompanyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithId[]>([]);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoUrl, setLogoUrl] = useState(FALLBACK_LOGO);
  const [companyPhotos, setCompanyPhotos] = useState<string[]>([]);
  const companyPhotosInputRef = useRef<HTMLInputElement | null>(null);
  const companyPhotosInsertIndexRef = useRef<number | null>(null);

  const [formData, setFormData] = useState<CompanyProfileFormData>({
    companyName: "",
    industry: "",
    foundedYear: "",
    location: "",
    companySize: "",
    email: "",
    phone: "",
    website: "",
    description: "",
    linkedin: "",
    facebook: "",
    instagram: "",
    x: "",
  });

  const { data: session } = useSession();
  const profileQuery = useCompanyProfile({ enabled: !!session });
  const updateProfileMutation = useUpdateCompanyProfile();
  const uploadLogoMutation = useUploadCompanyLogo();
  const uploadPhotosMutation = useUploadCompanyPhotos();
  const addMemberMutation = useAddTeamMember();
  const removeMemberMutation = useRemoveTeamMember();
  const isSaving = updateProfileMutation.isPending;
  const isUploadingLogo = uploadLogoMutation.isPending;
  const isUploadingPhotos = uploadPhotosMutation.isPending;

  const handleChange = useCallback((field: keyof CompanyProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field when user edits it
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleStartEditing = useCallback(() => {
    setIsEditing(true);
    setErrors({});
  }, []);

  // ─── Validation ─────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim())
      newErrors.companyName = "Company name is required";
    if (!formData.industry.trim()) newErrors.industry = "Industry is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.facebook.trim())
      newErrors.facebook = "Facebook link is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    if (!profileQuery.data || isEditing) {
      return;
    }

    const parsed = parseCompanyProfile(profileQuery.data);
    setProfileId(profileQuery.data.id ?? null);
    setFormData(parsed.formData);
    setLogoUrl(parsed.logoUrl);
    setCompanyPhotos(parsed.companyPhotos);
    setTeamMembers(parsed.teamMembers as TeamMemberWithId[]);
  }, [profileQuery.data, isEditing]);

  useEffect(() => {
    if (!profileQuery.error) {
      return;
    }
    setProfileError(
      getErrorMessage(profileQuery.error, "Failed to load company profile"),
    );
  }, [profileQuery.error]);

  useEffect(() => {
    if (profileQuery.isSuccess) {
      setProfileError(null);
    }
  }, [profileQuery.isSuccess]);

  const handleAddMember = async (member: TeamMember) => {
    try {
      const created = await addMemberMutation.mutateAsync(member);
      const normalizedMember: TeamMemberWithId = {
        fullName: created.fullName ?? member.fullName,
        position: created.position ?? member.position,
        yearsOfExperience:
          created.yearsOfExperience ?? member.yearsOfExperience,
        linkedin: created.linkedin ?? member.linkedin,
        facebook: created.facebook ?? member.facebook,
        instagram: created.instagram ?? member.instagram,
        id: created.id,
      };
      setTeamMembers((prev) => [...prev, normalizedMember]);
    } catch (error) {
      const message = getErrorMessage(error, "Failed to add team member");
      setProfileError(message);
    }
  };

  const handleRemoveMember = async (index: number) => {
    const member = teamMembers[index];
    if (!member) {
      return;
    }
    try {
      if (member.id) {
        await removeMemberMutation.mutateAsync(member.id);
      }
      setTeamMembers((prev) => prev.filter((_, i) => i !== index));
    } catch (error) {
      const message = getErrorMessage(error, "Failed to remove team member");
      setProfileError(message);
    }
  };

  const handleLogoUpload = async (file: File) => {
    const previousLogoUrl = logoUrl;
    const previewUrl = URL.createObjectURL(file);
    setLogoUrl(previewUrl);
    setProfileError(null);

    try {
      const response = await uploadLogoMutation.mutateAsync(file);
      setLogoUrl(response.logoUrl || previewUrl);
    } catch (error) {
      const message = getErrorMessage(error, "Failed to upload logo");
      setLogoUrl(previousLogoUrl);
      setProfileError(message);
    } finally {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const handleCompanyPhotosUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const selectedFiles = Array.from(files);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setCompanyPhotos((prev) => {
      companyPhotosInsertIndexRef.current = prev.length;
      return [...prev, ...previews];
    });
    setProfileError(null);

    try {
      const response = await uploadPhotosMutation.mutateAsync(selectedFiles);
      const uploadedUrls =
        response.photoUrls && response.photoUrls.length > 0
          ? response.photoUrls
          : previews;
      const insertIndex = companyPhotosInsertIndexRef.current ?? 0;
      setCompanyPhotos((prev) => {
        const next = [...prev];
        next.splice(insertIndex, previews.length, ...uploadedUrls);
        return next;
      });
    } catch (error) {
      const message = getErrorMessage(error, "Failed to upload photos");
      setCompanyPhotos((prev) => prev.filter((url) => !previews.includes(url)));
      setProfileError(message);
    } finally {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    }
  };

  const handleCompanyPhotosInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    void handleCompanyPhotosUpload(event.target.files);
    event.target.value = "";
  };

  const handleSaveProfile = async () => {
    setProfileError(null);

    if (!validate()) return;

    try {
      const payload = serializeCompanyProfile({
        id: profileId,
        formData,
        teamMembers,
        logoUrl,
        companyPhotos,
      });
      const updatedProfile = await updateProfileMutation.mutateAsync(payload);
      const parsed = parseCompanyProfile(updatedProfile);
      setProfileId(updatedProfile.id ?? profileId);
      setFormData(parsed.formData);
      setLogoUrl(parsed.logoUrl);
      setCompanyPhotos(parsed.companyPhotos);
      setTeamMembers(parsed.teamMembers as TeamMemberWithId[]);
      setErrors({});
      setIsEditing(false);
    } catch (error) {
      const message = getErrorMessage(error, "Failed to save company profile");
      setProfileError(message);
    }
  };

  return (
    <>
      {/* Main Content */}
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
        {profileError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2">
            {profileError}
          </div>
        )}

        {/* Profile Uploading Card */}
        {profileQuery.data && (
          <ProfileUploadingCard
            companyName={formData.companyName}
            industry={formData.industry}
            location={formData.location}
            logoUrl={logoUrl}
            isEditing={isEditing}
            isSaving={isSaving}
            isUploadingLogo={isUploadingLogo}
            onEdit={handleStartEditing}
            onSave={() => void handleSaveProfile()}
            onLogoUpload={handleLogoUpload}
          />
        )}

        {/* Company Information Section */}
        <SectionCard icon={Building2} title="Company Information">
          {isEditing ? (
            <div className="flex flex-col gap-6">
              <FloatingInput
                id="companyName"
                label="Company Name"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                placeholder="e.g. BMW"
                required
                error={errors.companyName}
              />
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                <FloatingInput
                  id="industry"
                  label="Industry"
                  value={formData.industry}
                  onChange={(e) => handleChange("industry", e.target.value)}
                  placeholder="e.g. Automotives"
                  required
                  error={errors.industry}
                />
                <FloatingInput
                  id="foundedYear"
                  label="Founded Year"
                  value={formData.foundedYear}
                  onChange={(e) => handleChange("foundedYear", e.target.value)}
                  placeholder="e.g. 1916"
                />
              </div>
              <FloatingInput
                id="location"
                label="Location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="e.g. Germany"
              />
              <FloatingInput
                id="companySize"
                label="Company Size"
                value={formData.companySize}
                onChange={(e) => handleChange("companySize", e.target.value)}
                placeholder="e.g. 1000"
              />
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                <FloatingInput
                  id="email"
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="company@example.com"
                  required
                  error={errors.email}
                />
                <FloatingInput
                  id="website"
                  label="Website"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="www.company.com"
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-neutral-400 text-sm font-normal">
                  Company Name
                </p>
                <p className="text-neutral-800 text-base font-medium wrap-break-word">
                  {formData.companyName || "—"}
                </p>
              </div>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Industry
                  </p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {formData.industry || "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Founded Year
                  </p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {formData.foundedYear || "—"}
                  </p>
                </div>
              </div>
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Location
                  </p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {formData.location || "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Company Size
                  </p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {formData.companySize || "—"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-10 w-full">
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">Email</p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {formData.email || "—"}
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Website
                  </p>
                  <p className="text-neutral-800 text-base font-medium wrap-break-word">
                    {formData.website || "—"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </SectionCard>

        {/* Company Description Section */}
        <SectionCard icon={AlignLeft} title="Company Description">
          {isEditing ? (
            <FloatingTextArea
              id="description"
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your company, its mission, values, and what makes it unique..."
              maxLength={512}
              required
              error={errors.description}
            />
          ) : (
            <div className="text-neutral-600 text-sm font-normal bg-gray-50 p-6 rounded-lg border border-gray-100">
              {formData.description}
            </div>
          )}
        </SectionCard>

        {/* Company Photos Section */}
        <SectionCard
          icon={ImageIcon}
          title="Company Photos"
          action={
            <>
              <input
                ref={companyPhotosInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleCompanyPhotosInputChange}
              />
              <Button
                onClick={() => companyPhotosInputRef.current?.click()}
                disabled={isUploadingPhotos}
                className="h-8 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Upload size={16} className="mr-2" />
                {isUploadingPhotos ? "Uploading..." : "Upload Photos"}
              </Button>
            </>
          }
        >
          {companyPhotos.length === 0 ? (
            <PhotoPlaceholder text="No photos yet" />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {companyPhotos.map((photo, index) => (
                <div
                  key={`${photo}-${index}`}
                  className="w-full aspect-square rounded-lg border border-neutral-200 overflow-hidden bg-gray-50"
                >
                  <img
                    src={photo}
                    alt={`Company photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Team Members Section */}
        <SectionCard
          icon={Users}
          title="Team Members"
          action={
            <Button
              onClick={() => setIsModalOpen(true)}
              className="h-8 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
            >
              <Upload size={16} className="mr-2" />
              Add Members
            </Button>
          }
        >
          {teamMembers.length === 0 ? (
            <PhotoPlaceholder text="No team members yet" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member, index) => (
                <TeamMemberCard
                  key={index}
                  member={member}
                  onRemove={() => handleRemoveMember(index)}
                />
              ))}
            </div>
          )}
        </SectionCard>

        {/* Social Media Links Section */}
        <SectionCard icon={LinkIcon} title="Social media Links">
          {isEditing ? (
            <div className="flex flex-col gap-6">
              <FloatingInput
                id="linkedin"
                label="LinkedIn"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="https://linkedin.com/company"
              />
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 md:gap-10">
                <FloatingInput
                  id="facebook"
                  label="Facebook"
                  value={formData.facebook}
                  onChange={(e) => handleChange("facebook", e.target.value)}
                  placeholder="https://facebook.com/.."
                  required
                  error={errors.facebook}
                />
                <FloatingInput
                  id="instagram"
                  label="Instagram"
                  value={formData.instagram}
                  onChange={(e) => handleChange("instagram", e.target.value)}
                  placeholder="https://instagram/.."
                />
              </div>
              <FloatingInput
                id="x"
                label="X"
                value={formData.x}
                onChange={(e) => handleChange("x", e.target.value)}
                placeholder="https://x.com/.."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {formData.linkedin && (
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    LinkedIn
                  </p>
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-800 text-base font-medium hover:text-emerald-600 transition-colors"
                  >
                    {formData.linkedin}
                  </a>
                </div>
              )}
              {formData.x && (
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">X</p>
                  <a
                    href={formData.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-800 text-base font-medium hover:text-emerald-600 transition-colors"
                  >
                    {formData.x}
                  </a>
                </div>
              )}
              {formData.facebook && (
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Facebook
                  </p>
                  <a
                    href={formData.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-800 text-base font-medium hover:text-emerald-600 transition-colors"
                  >
                    {formData.facebook}
                  </a>
                </div>
              )}
              {formData.instagram && (
                <div className="flex flex-col gap-1">
                  <p className="text-neutral-400 text-sm font-normal">
                    Instagram
                  </p>
                  <a
                    href={formData.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-800 text-base font-medium hover:text-emerald-600 transition-colors"
                  >
                    {formData.instagram}
                  </a>
                </div>
              )}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Modal for Add Team Member */}
      <AddTeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMember}
      />
    </>
  );
}
