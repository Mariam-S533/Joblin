"use client";

import { Search, Plus, Bell, UserCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  notificationCount?: number;
}

const routeMeta: Array<{
  match: (pathname: string) => boolean;
  title: string;
  subtitle: string;
}> = [
  {
    match: (pathname) => pathname.includes("/company/profile"),
    title: "Employer Profile",
    subtitle: "View and manage all your job applications",
  },
  {
    match: (pathname) => pathname.includes("/company/post-job"),
    title: "Post Job",
    subtitle: "Create and publish your vacancy with complete job details",
  },
  {
    match: (pathname) => pathname.includes("/company/post-course"),
    title: "Post Course",
    subtitle:
      "Updating your information will offer you the most relevent content",
  },
  {
    match: (pathname) =>
      pathname.includes("/company/posted-jobs/") &&
      pathname.includes("/applications"),
    title: "Applications",
    subtitle: "View and manage all your job applications",
  },
  {
    match: (pathname) =>
      pathname.includes("/company/posted-courses/") &&
      pathname.includes("/applications"),
    title: "Course Applications",
    subtitle: "View and manage all your course applicants",
  },
  {
    match: (pathname) => pathname.includes("/company/posted-jobs"),
    title: "Job Posts",
    subtitle: "View and manage all your posted jobs and applications",
  },
  {
    match: (pathname) => pathname.includes("/company/posted-courses"),
    title: "Posted Courses",
    subtitle: "List of all posted Courses done",
  },
  {
    match: (pathname) => pathname.includes("/company/dashboard"),
    title: "Dashboard",
    subtitle: "Track performance, activity, and hiring updates in one place",
  },
  {
    match: (pathname) => pathname.includes("/company/settings"),
    title: "Account Settings",
    subtitle: "Manage your company account preferences",
  },
];

const titleFromPath = (pathname: string) => {
  const clean = pathname.split("?")[0].split("#")[0];
  const segments = clean.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "dashboard";

  return last
    .split("-")
    .map((chunk) => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(" ");
};

export default function DashboardHeader({
  title,
  subtitle,
  notificationCount = 0,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [],
  );

  const resolvedMeta = useMemo(() => {
    const matched = routeMeta.find((item) => item.match(pathname));
    const isCourseRoute =
      pathname.includes("/company/post-course") ||
      pathname.includes("/company/posted-courses");

    return {
      ...(matched ?? {
        title: titleFromPath(pathname),
        subtitle: "Manage and review your company activities",
      }),
      postActionLabel: isCourseRoute ? "Post a Course" : "Post a Job",
    };
  }, [pathname]);

  const headerTitle = title ?? resolvedMeta.title;
  const headerSubtitle = subtitle ?? resolvedMeta.subtitle;
  const { postActionLabel } = resolvedMeta;
  return (
    <div className="w-full bg-neutral-50/50 backdrop-blur-md sticky top-0 z-40 border-b border-neutral-200">
      <div className="px-6 py-4 flex flex-col lg:flex-row  items-center justify-between gap-8">
        {/* Left Section - Title & Description */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-neutral-800">
            {headerTitle}
          </h1>
          <p className="text-xs text-neutral-600">{headerSubtitle}</p>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-4">
          {/* Search Box */}
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-white text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
          </div>

          {/* Post a Job Button */}
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-neutral-400 text-neutral-400 font-medium text-base hover:bg-gray-50 transition">
            <Plus size={24} />
            <span>{postActionLabel}</span>
          </button>

          {/* Notification Badge */}
          <button className="relative w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-neutral-200 hover:bg-gray-50 transition">
            <Bell size={20} className="text-neutral-800" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profile/Settings */}
          <button className="w-12 h-12 flex items-center justify-center rounded-lg bg-white border border-neutral-200 hover:bg-gray-50 transition overflow-hidden">
            <UserCircle className="h-8 w-8 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
