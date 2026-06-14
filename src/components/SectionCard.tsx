import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  icon: LucideIcon;
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
};

export const SectionCard = ({
  icon: Icon,
  title,
  children,
  action,
  className,
}: SectionCardProps) => (
  <div
    className={cn(
      "px-4 py-6 bg-white rounded-2xl border border-gray-200 flex flex-col gap-8",
      className,
    )}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Icon size={20} className="text-neutral-700" />
        <div className="text-neutral-800 text-lg font-bold font-['Inter']">
          {title}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
    {children}
  </div>
);
