"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      visibleToasts={3}
      richColors
      closeButton
      duration={4000}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-emerald-600" />,
        info: <InfoIcon className="size-5 text-blue-600" />,
        warning: <TriangleAlertIcon className="size-5 text-amber-600" />,
        error: <OctagonXIcon className="size-5 text-red-600" />,
        loading: <Loader2Icon className="size-5 animate-spin text-neutral-500" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:pr-6 group-[.toaster]:pl-4 group-[.toaster]:py-3 group-[.toaster]:rounded-lg group-[.toaster]:shadow-lg group-[.toaster]:border group-[.toaster]:font-sans",
          title: "group-[.toast]:text-sm group-[.toast]:font-semibold group-[.toast]:text-foreground",
          description: "group-[.toast]:text-xs group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:hover:bg-primary/90 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:hover:bg-muted/80 group-[.toast]:rounded-md group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium",
          success:
            "group-[.toaster]:border-emerald-200 group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-900",
          error:
            "group-[.toaster]:border-red-200 group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900",
          warning:
            "group-[.toaster]:border-amber-200 group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-900",
          info:
            "group-[.toaster]:border-blue-200 group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
