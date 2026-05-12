"use client";

import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, type LucideIcon } from "lucide-react";

type ModalOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  titleIcon?: LucideIcon;
  children: React.ReactNode;
  footerActions?: React.ReactNode;
  width?: string;
  maxHeight?: string;
};

export default function ModalOverlay({
  isOpen,
  onClose,
  title,
  titleIcon: TitleIcon,
  children,
  footerActions,
  width = "w-[606px]",
  maxHeight = "max-h-[90vh]",
}: ModalOverlayProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const portalTarget = typeof document !== "undefined" ? document.body : null;
  if (!portalTarget) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-hidden"
      onClick={handleBackdropClick}
    >
      <div
        className={`${width} ${maxHeight} bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-400 h-20 px-7 py-2.5 flex justify-between items-center rounded-t-3xl shrink-0">
          <div className="flex items-center gap-3">
            {TitleIcon && (
              <div className="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center">
                <TitleIcon size={18} className="text-neutral-800" />
              </div>
            )}
            <h2 className="text-neutral-800 text-lg font-semibold font-['Inter']">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex justify-center items-center hover:bg-gray-100 transition active:bg-gray-200"
            aria-label="Close modal"
          >
            <X size={20} className="text-neutral-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto hide-scrollbar px-7 py-7">
          {children}
        </div>

        {/* Footer - Sticky */}
        {footerActions && (
          <div className="sticky bottom-0 bg-white border-t border-gray-100 px-7 py-5 flex justify-end items-center gap-3 rounded-b-3xl shrink-0">
            {footerActions}
          </div>
        )}
      </div>
    </div>,
    portalTarget,
  );
}
