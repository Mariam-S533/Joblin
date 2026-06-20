import React from "react";
import { X } from "lucide-react";
import { type TeamMember } from "@/components/Modal/AddTeamMemberModal";

type TeamMemberCardProps = {
  member: TeamMember;
  onRemove: () => void;
};

export const TeamMemberCard = ({ member, onRemove }: TeamMemberCardProps) => (
  <div className="p-4 bg-white rounded-lg border border-gray-200 flex justify-between items-start gap-4">
    <div className="flex-1">
      <h4 className="text-neutral-800 font-semibold text-sm">
        {member.fullName}
      </h4>
      <p className="text-neutral-600 text-xs mt-1">{member.position}</p>
      <p className="text-neutral-500 text-xs mt-1">
        {member.yearsOfExperience} years exp.
      </p>
      {(member.linkedin || member.facebook || member.instagram) && (
        <div className="flex gap-2 mt-2">
          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-xs hover:underline"
            >
              LinkedIn
            </a>
          )}
          {member.facebook && (
            <a
              href={member.facebook}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-xs hover:underline"
            >
              FB
            </a>
          )}
          {member.instagram && (
            <a
              href={member.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-xs hover:underline"
            >
              IG
            </a>
          )}
        </div>
      )}
    </div>
    <button
      onClick={onRemove}
      className="text-red-600 hover:text-red-700 transition"
      aria-label="Remove member"
    >
      <X size={16} />
    </button>
  </div>
);
