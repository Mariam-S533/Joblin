"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

type ModalSectionProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
};

export default function ModalSection({
  icon: Icon,
  title,
  children,
}: ModalSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 flex items-center justify-center">
          <Icon size={20} className="text-neutral-800" />
        </div>
        <h3 className="text-neutral-800 text-lg font-semibold font-['Inter']">
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
