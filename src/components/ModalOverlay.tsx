"use client";

import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

type ModalOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export const ModalOverlay = ({
  isOpen,
  onClose,
  children,
}: ModalOverlayProps) => {
  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleBackdropKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const portalTarget = typeof document !== "undefined" ? document.body : null;
  if (!portalTarget) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - Click to close */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity cursor-pointer"
        onClick={handleBackdropClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleBackdropKeyDown}
        aria-label="Close modal"
      />

      {/* Modal Content */}
      <div
        className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalTarget,
  );
};
