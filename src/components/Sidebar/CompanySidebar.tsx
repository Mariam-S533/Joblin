"use client";

import React, { memo, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  User,
  Briefcase,
  MonitorPlay,
  Bell,
  MessageSquare,
  Settings,
  SlidersHorizontal,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  PlusSquare,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
const SCROLLBAR_STYLES = {
  __html: `
    .custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
    .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `,
};

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  badge?: number;
  isActive?: boolean;
  isCollapsed: boolean;
};

type DropdownItemProps = {
  icon: LucideIcon;
  label: string;
  href: string;
};

const NavItem = memo(function NavItem({
  icon: Icon,
  label,
  href,
  badge,
  isActive,
  isCollapsed,
}: NavItemProps) {
  const isDashboardOrCourseInJob = label === "Dashboard" && href === undefined; // ignoring the weird artifact

  const content = (
    <div
      className={`relative flex items-center justify-between ${isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"} rounded-lg cursor-pointer transition-colors ${isActive ? "bg-gray-200 text-neutral-700" : "text-neutral-700 hover:bg-gray-50"}`}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-6 h-6">
          <Icon
            size={20}
            className={isActive ? "text-neutral-700" : "text-neutral-700"}
            strokeWidth={2}
          />
        </div>
        {!isCollapsed && (
          <span className="text-base font-medium font-['Inter']">{label}</span>
        )}
      </div>

      {/* Badge - Expanded */}
      {!isCollapsed && badge && (
        <div className="w-5 h-5 p-1 bg-red-700 rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5 ml-auto">
          <span className="text-center text-white text-xs font-semibold font-['Inter']">
            {badge}
          </span>
        </div>
      )}

      {/* Badge - Collapsed */}
      {isCollapsed && badge && (
        <div className="absolute -top-1 -right-1 w-5 h-5 p-1 bg-red-700 rounded-[10px] inline-flex flex-col justify-center items-center gap-2.5 z-10 shadow-sm scale-[0.85]">
          <span className="text-center text-white text-xs font-semibold font-['Inter']">
            {badge}
          </span>
        </div>
      )}
    </div>
  );

  if (isDashboardOrCourseInJob) return null; // Filtering out artifact

  return href ? (
    <Link
      href={href}
      className={isCollapsed ? "w-12 flex justify-center" : "w-48"}
    >
      {content}
    </Link>
  ) : (
    <div className={isCollapsed ? "w-12 flex justify-center" : "w-48"}>
      {content}
    </div>
  );
});
NavItem.displayName = "NavItem";

const DropdownItem = memo(function DropdownItem({
  icon: Icon,
  label,
  href,
}: DropdownItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 w-48 h-12 px-5 py-2 rounded-lg text-neutral-700 hover:bg-gray-50 transition-colors"
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <Icon size={18} strokeWidth={2} />
      </div>
      <span className="text-base font-medium font-['Inter']">{label}</span>
    </Link>
  );
});
DropdownItem.displayName = "DropdownItem";

export default function CompanySidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { mutate: logout } = useLogout();

  const toggleSidebar = useCallback(() => {
    if (!isCollapsed) setOpenDropdown(null);
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const toggleDropdown = useCallback(
    (dropdown: string) => {
      if (isCollapsed) {
        setIsCollapsed(false);
        setOpenDropdown(dropdown);
      } else {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
      }
    },
    [isCollapsed, openDropdown],
  );

  return (
    <aside
      className={`relative flex flex-col h-screen bg-white transition-all duration-300 ease-in-out border-r border-stone-200/50 rounded-2xl overflow-hidden ${
        isCollapsed ? "w-24" : "w-61"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute right-4 top-21 flex h-6 w-6 items-center justify-center rounded-2xl bg-white text-neutral-500 hover:text-neutral-900 z-10 transition-transform"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Header / Logo */}
      <Link
        href="/company/home"
        className={`flex items-center gap-2 ${isCollapsed ? "px-6" : "px-6"} pt-4`}
        aria-label="Joblin home"
      >
        <div className="w-12 h-12 p-2 bg-neutral-800 rounded-lg flex justify-center items-center gap-2 shrink-0">
          <div className="w-6 h-6 text-white font-bold flex items-center justify-center text-xl">
            J
          </div>
        </div>
        {!isCollapsed && (
          <div className="inline-flex flex-col justify-center items-start whitespace-nowrap overflow-hidden">
            <div className="justify-start text-neutral-800 text-lg font-bold font-['Poppins']">
              Joblin
            </div>
            <div className="justify-start text-neutral-500 text-xs font-light font-['Poppins']">
              Dashboard
            </div>
          </div>
        )}
      </Link>

      <div className="w-[85%] h-px mx-auto mt-6 opacity-30 bg-stone-300 rounded-lg mb-3" />

      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center custom-scrollbar pb-6 relative">
        <div
          className={`w-full ${isCollapsed ? "pl-8" : "pl-6"} mb-3 mt-1 justify-start text-neutral-500 text-sm font-medium font-['Inter'] leading-6`}
        >
          Main
        </div>

        <div className="flex flex-col justify-center items-center gap-2 w-full px-2">
          <NavItem
            icon={LayoutGrid}
            label="Dashboard"
            href="/company/dashboard"
            isCollapsed={isCollapsed}
            isActive={pathname === "/company/dashboard"}
          />
          <NavItem
            icon={User}
            label="Employer profile"
            href="/company/profile"
            isCollapsed={isCollapsed}
            isActive={pathname === "/company/profile"}
          />

          {/* Jobs Dropdown */}
          <div className="flex flex-col items-center w-full">
            <button
              type="button"
              onClick={() => toggleDropdown("jobs")}
              aria-expanded={openDropdown === "jobs"}
              aria-controls="sidebar-jobs-dropdown"
              className={`relative flex items-center justify-between ${isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"} rounded-lg cursor-pointer transition-colors ${openDropdown === "jobs" ? "bg-gray-200 text-neutral-700" : "text-neutral-700 hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex justify-center items-center">
                  <Briefcase size={20} strokeWidth={2} />
                </div>
                {!isCollapsed && (
                  <span className="text-base font-medium font-['Inter']">
                    Job{openDropdown === "jobs" ? "s" : ""}
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="w-6 h-6 relative flex items-center justify-center">
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 text-emerald-500 ${openDropdown === "jobs" ? "rotate-90" : ""}`}
                    strokeWidth={3}
                  />
                </div>
              )}
            </button>

            {/* Dropdown Content */}
            <div
              id="sidebar-jobs-dropdown"
              className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-2 ${
                openDropdown === "jobs" && !isCollapsed
                  ? "max-h-60 opacity-100 mt-2 pl-5"
                  : "max-h-0 opacity-0"
              } w-full flex items-start`}
            >
              <DropdownItem
                icon={PlusSquare}
                label="Post Job"
                href="/company/post-job"
              />
              <DropdownItem
                icon={FileText}
                label="Posted Jobs"
                href="/company/posted-jobs"
              />
            </div>
          </div>

          {/* Course Dropdown */}
          <div className="flex flex-col items-center w-full">
            <button
              type="button"
              onClick={() => toggleDropdown("courses")}
              aria-expanded={openDropdown === "courses"}
              aria-controls="sidebar-courses-dropdown"
              className={`relative flex items-center justify-between ${isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"} rounded-lg cursor-pointer transition-colors ${openDropdown === "courses" ? "bg-gray-200 text-neutral-700" : "text-neutral-700 hover:bg-gray-50"}`}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 flex justify-center items-center">
                  <MonitorPlay size={20} strokeWidth={2} />
                </div>
                {!isCollapsed && (
                  <span className="text-base font-medium font-['Inter']">
                    Course
                  </span>
                )}
              </div>
              {!isCollapsed && (
                <div className="w-6 h-6 relative flex items-center justify-center">
                  <ChevronRight
                    size={16}
                    className={`transition-transform duration-200 text-emerald-500 ${openDropdown === "courses" ? "rotate-90" : ""}`}
                    strokeWidth={3}
                  />
                </div>
              )}
            </button>

            {/* Dropdown Content */}
            <div
              id="sidebar-courses-dropdown"
              className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-2 ${
                openDropdown === "courses" && !isCollapsed
                  ? "max-h-60 opacity-100 mt-2 pl-3.5"
                  : "max-h-0 opacity-0"
              } w-full flex items-start`}
            >
              <DropdownItem
                icon={PlusSquare}
                label="Post Course"
                href="/company/post-course"
              />
              <DropdownItem
                icon={FileText}
                label="Posted Courses"
                href="/company/posted-courses"
              />
            </div>
          </div>

          <NavItem
            icon={Bell}
            label="Notification"
            href="/company/notifications"
            isCollapsed={isCollapsed}
            isActive={pathname === "/company/notifications"}
          />
          <NavItem
            icon={MessageSquare}
            label="Message"
            href="/company/messages"
            isCollapsed={isCollapsed}
            isActive={pathname === "/company/messages"}
          />
          <NavItem
            icon={Settings}
            label="Account Setting"
            href="/company/settings"
            isCollapsed={isCollapsed}
            isActive={pathname === "/company/settings"}
          />
          <NavItem
            icon={SlidersHorizontal}
            label="Manage hiring"
            href="/company/manage-hiring"
            isCollapsed={isCollapsed}
            isActive={pathname === "/company/manage-hiring"}
          />
        </div>
      </div>

      {/* Footer Items */}
      <div
        className={`flex flex-col ${isCollapsed ? "items-center gap-2" : "items-start gap-4 pl-6"} pb-8 mt-auto bg-white pt-4 z-10 w-full`}
      >
        <button
          onClick={() =>
            logout(undefined, {
              onSuccess: () => {
                window.location.href = "/login/company";
              },
            })
          }
          className={`flex items-center gap-2 ${isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"} rounded-lg text-red-700 hover:bg-red-50 transition-colors`}
        >
          <div className="w-6 h-6 flex justify-center items-center">
            <LogOut size={20} strokeWidth={2} />
          </div>
          {!isCollapsed && (
            <span className="text-base font-medium font-['Inter'] whitespace-nowrap">
              Log out
            </span>
          )}
        </button>
        <Link
          href="/company/help"
          className={`flex items-center gap-2 ${isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"} rounded-lg text-neutral-700 hover:bg-gray-50 transition-colors`}
        >
          <div className="w-6 h-6 flex justify-center items-center">
            <HelpCircle size={20} strokeWidth={2} />
          </div>
          {!isCollapsed && (
            <span className="text-base font-medium font-['Inter'] whitespace-nowrap">
              Help
            </span>
          )}
        </Link>
      </div>

      {/* Hide scrollbar styles */}
      <style dangerouslySetInnerHTML={SCROLLBAR_STYLES} />
    </aside>
  );
}
