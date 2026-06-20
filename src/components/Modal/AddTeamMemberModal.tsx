"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  ImageIcon,
  Linkedin,
  Facebook,
  Instagram,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ModalOverlay from "@/components/Modal/ModalOverlay";
import ModalSection from "@/components/Modal/ModalSection";
import FloatingInput from "@/components/FormInputs/FloatingInput";

type AddTeamMemberModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (member: TeamMember) => Promise<void>;
};

export type TeamMember = {
  fullName: string;
  position: string;
  yearsOfExperience: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
};

export default function AddTeamMemberModal({
  isOpen,
  onClose,
  onAdd,
}: AddTeamMemberModalProps) {
  const [formData, setFormData] = useState<TeamMember>({
    fullName: "",
    position: "",
    yearsOfExperience: "",
    linkedin: "",
    facebook: "",
    instagram: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof TeamMember, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear validation error for this field when user edits it
    setErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.position.trim()) newErrors.position = "Position is required";
    if (!formData.yearsOfExperience.trim())
      newErrors.yearsOfExperience = "Years of experience is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await onAdd(formData);
      setFormData({
        fullName: "",
        position: "",
        yearsOfExperience: "",
        linkedin: "",
        facebook: "",
        instagram: "",
      });
      setErrors({});
      setPhotoPreview(null);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to add team member";
      setErrors((prev) => ({ ...prev, submit: message }));
    }
  };

  const footerActions = (
    <>
      <Button
        onClick={onClose}
        variant="outline"
        className="h-8 px-4 py-2 rounded-lg text-zinc-800 text-sm font-medium border border-zinc-800 hover:bg-gray-50 transition"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        className="h-8 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition"
      >
        Add New Member
      </Button>
    </>
  );

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      title="Add Team Members"
      titleIcon={Users}
      footerActions={footerActions}
    >
      {errors.submit && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errors.submit}
        </div>
      )}
      {/* Profile Photo Section */}
      <ModalSection icon={ImageIcon} title="Profile Photo">
        <div className="flex justify-between items-start gap-6">
          <div className="w-28 h-28 rounded-2xl border border-neutral-300 overflow-hidden flex items-center justify-center bg-gray-50 shrink-0">
            {photoPreview ? (
              <img
                src={photoPreview}
                alt="Team member preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <ImageIcon className="text-neutral-400" size={32} />
            )}
          </div>
          <div>
            <Button
              onClick={triggerPhotoUpload}
              className="h-8 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition"
            >
              <Upload size={16} />
              Upload Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>
        </div>
      </ModalSection>

      {/* Personal Info Section */}
      <div className="flex flex-col gap-6 border-t border-neutral-200 pt-7">
        <FloatingInput
          id="fullName"
          label="Full Name"
          value={formData.fullName}
          onChange={(value) => handleChange("fullName", value)}
          placeholder="e.g. John Smith"
          required
          error={errors.fullName}
        />
        <FloatingInput
          id="position"
          label="Position/ Job Title"
          value={formData.position}
          onChange={(value) => handleChange("position", value)}
          placeholder="e.g. CEO"
          required
          error={errors.position}
        />
        <FloatingInput
          id="experience"
          label="Years of Experience"
          value={formData.yearsOfExperience}
          onChange={(value) => handleChange("yearsOfExperience", value)}
          placeholder="e.g. 5"
          required
          type="number"
          error={errors.yearsOfExperience}
        />
      </div>

      {/* Social Media Links Section */}
      <ModalSection icon={Linkedin} title="Social Media Links">
        <div className="flex flex-col gap-5">
          <FloatingInput
            id="linkedin"
            label="LinkedIn"
            value={formData.linkedin || ""}
            onChange={(value) => handleChange("linkedin", value)}
            placeholder="https://linkedin.com/username"
          />
          <FloatingInput
            id="facebook"
            label="Facebook"
            value={formData.facebook || ""}
            onChange={(value) => handleChange("facebook", value)}
            placeholder="https://facebook.com/username"
          />
          <FloatingInput
            id="instagram"
            label="Instagram"
            value={formData.instagram || ""}
            onChange={(value) => handleChange("instagram", value)}
            placeholder="https://instagram.com/username"
          />
        </div>
      </ModalSection>
    </ModalOverlay>
  );
}
