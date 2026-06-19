"use client";

import React, {
  memo,
  useState,
  useCallback,
  useEffect,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutGrid,
  User,
  Bell,
  Settings,
  SlidersHorizontal,
  LogOut,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
  Users,
  CirclePlus,
  Star,
} from "lucide-react";

import { signOut } from "next-auth/react";
import { useProfileContext } from "@/app/context/ProfilesProvider";
import Image from "next/image";
// Import your Profile Context

const SCROLLBAR_STYLES = {
  __html: `
    .custom-scrollbar::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }

    .custom-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `,
};

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  href?: string;
  badge?: number;
  isActive?: boolean;
  isCollapsed: boolean;
  onClick?: () => void;
};

type DropdownItemProps = {
  icon: LucideIcon;
  label: string;
  isActive?: boolean;
  onClick: () => void;
};

const NavItem = memo(function NavItem({
  icon: Icon,
  label,
  href,
  badge,
  isActive,
  isCollapsed,
  onClick,
}: NavItemProps) {
  const content = (
    <div
      onClick={onClick}
      className={`relative flex items-center justify-between ${
        isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"} 
        rounded-lg cursor-pointer transition-colors ${
        isActive ? "bg-gray-200 text-neutral-700" : "text-neutral-700 hover:bg-gray-50"}`
      }
    >
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center w-6 h-6">
          <Icon size={20} strokeWidth={2} />
        </div>
        {!isCollapsed && (
          <span className="text-base font-medium font-['Inter'] truncate max-w-[120px]">
            {label}
          </span>
        )}
      </div>

      {!isCollapsed && badge && (
        <div className="w-5 h-5 p-1 bg-red-700 rounded-[10px] flex justify-center items-center ml-auto">
          <span className="text-white text-xs font-semibold">
            {badge}
          </span>
        </div>
      )}

      {isCollapsed && badge && (
        <div className="absolute -top-1 -right-1 w-5 h-5 p-1 bg-red-700 rounded-[10px] flex justify-center items-center z-10 shadow-sm scale-[0.85]">
          <span className="text-white text-xs font-semibold">
            {badge}
          </span>
        </div>
      )}
    </div>
  );

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
  isActive,
  onClick,
}: DropdownItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 w-48 h-12 px-5 py-2 rounded-lg transition-colors text-left ${
        isActive ? "bg-gray-100 text-neutral-900 font-semibold" : "text-neutral-700 hover:bg-gray-50"
      }`}
    >
      <div className="w-6 h-6 flex items-center justify-center">
        <Icon size={18} strokeWidth={2} />
      </div>

      <span className="text-base font-medium font-['Inter'] truncate max-w-[130px]">
        {label}
      </span>
    </button>
  );
});

DropdownItem.displayName = "DropdownItem";

export default function CompanySidebar() {
  const pathname = usePathname();
  
  // Consume your profile context values
  const { 
    profilesList, 
    currentProfileId, 
    setCurrentProfileId, 
    setCurrentProfileName 
  } = useProfileContext();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Default dropdown open state changed to 'profiles' to match content
  const [openDropdown, setOpenDropdown] = useState<string | null>("profiles");

  useEffect(() => {
    const checkScreen = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => {
      if (!prev) {
        setOpenDropdown(null);
      }
      return !prev;
    });
  }, []);

  const toggleDropdown = useCallback(
    (dropdown: string) => {
      if (isCollapsed) {
        setIsCollapsed(false);
        setOpenDropdown(dropdown);
      } else {
        setOpenDropdown(
          openDropdown === dropdown ? null : dropdown
        );
      }
    },
    [isCollapsed, openDropdown]
  );

  return (
    <div className="relative">
    <aside
      className={`${isMobile ? "fixed top-25 left-0 z-20": "relative"}
        flex flex-col h-screen bg-white
        transition-all duration-300 ease-in-out
        border border-stone-200/50 shadow-sm
        rounded-2xl overflow-hidden
        ${isCollapsed ? "w-24" : "w-61"}
      `}
    >
      {/* Toggle Button Mobile Only */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="absolute right-4 top-19 flex h-6 w-6 items-center justify-center rounded-2xl bg-white text-neutral-500 hover:text-neutral-900 z-30"
        >
          {isCollapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      )}

      {/* Header */}
      <Link
        href="/"
        className="flex items-center gap-2 px-6 pt-4">
        <div className="w-12 h-12 p-2 bg-joblin-primary rounded-lg flex justify-center items-center shrink-0">
          <div className="w-6 h-6 text-white font-bold flex items-center justify-center text-3xl">
            <span>j</span>
          </div>
        </div>

        {!isCollapsed && (
          <div className="flex flex-col overflow-hidden">
            <div className="text-neutral-800 text-xl font-bold font-['Poppins']">
              Joblin
            </div>
            <div className="text-neutral-500 text-xs font-light font-['Poppins']">
              Dashboard
            </div>
          </div>
        )}
      </Link>

      <div className="w-[85%] h-px mx-auto mt-6 opacity-30 bg-stone-300 rounded-lg mb-3" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col items-center custom-scrollbar pb-6 relative">
        <div className={`w-full ${isCollapsed ? "pl-8" : "pl-6"} mb-3 mt-1 text-neutral-500 text-sm font-medium`}>
          Main
        </div>
        <div className="flex flex-col justify-center items-center gap-2 w-full px-2">
          
          <NavItem
            icon={LayoutGrid}
            label="Dashboard"
            href="/dashboard"
            isCollapsed={isCollapsed}
            isActive={pathname === "/dashboard"}
          />


          {/* Profile Dropdown Section */}
          <div className="flex flex-col items-center w-full">
            <button
              type="button"
              onClick={() => toggleDropdown("profiles")}
              className={`relative flex items-center justify-between ${
                isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"
              } rounded-lg transition-colors ${
                openDropdown === "profiles" ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users size={20} />
                {!isCollapsed && (
                  <span className="text-base font-medium">
                    My Profiles
                  </span>
                )}
              </div>

              {!isCollapsed && (
                <ChevronRight
                  size={16}
                  className={`transition-transform duration-200 ${
                    openDropdown === "profiles" ? "rotate-90" : ""
                  }`}
                />
              )}
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out flex flex-col gap-2 ${
                openDropdown === "profiles" && !isCollapsed
                  ? "max-h-[350px] overflow-y-auto mt-2 pl-5"
                  : "max-h-0 opacity-0"
              } w-full`}
            >


              {/* Action Button: Clear selection to load state for creation form */}
              <DropdownItem
                icon={CirclePlus}
                label="Add New Profile"
                isActive={currentProfileId === null}
                onClick={() => {
                  setCurrentProfileId(null);
                  setCurrentProfileName("My Profile");
                }}
              />

              {/* profiles */}
              {profilesList.map((profile) => {
                const isActive = currentProfileId === profile.id

                return(
                <div key={profile.id} className="rounded-lg bg-gray-50 border border-gray-200 w-48 px-2 py-3 flex flex-col gap-2 ">
                <div className=" flex items-center gap-2 ">
                  {profile.profilePictureUrl ? (
                    <Image
                      src={profile.profilePictureUrl}
                      alt={profile.profileName}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-joblin-primary/10 flex items-center justify-center border border-joblin-primary/20 shrink-0">
                      <span className="text-joblin-primary font-bold text-sm">
                        {(profile.profileName || "P").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-gray-800 truncate"> {profile.profileName} </span>
                    <span className="text-xs text-gray-500 truncate">{profile.technicalDomain || "No domain set"}</span>
                  </div>
                </div>
                    <Link className={`flex w-full items-center gap-2 px-1 border border-joblin-primary rounded justify-center cursor-pointer
                        hover:bg-joblin-primary hover:text-white ${isActive? "bg-joblin-primary text-white": "text-joblin-primary bg-white"}`}
                    type="button"
                    href={`/jobSeeker/profiles/${profile.id}`}
                    onClick={() => setCurrentProfileId(profile.id)}
                    >
                      <Star size={15}/><span>Set Current</span>
                      </Link>
              </div>
                )

              })}
                
            </div>
          </div>





          <NavItem
            icon={Bell}
            label="Notification"
            badge={6}
            href="/company/notifications"
            isCollapsed={isCollapsed}
            isActive={pathname === "/company/notifications"}
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
            label="Activity"
            href="/jobSeeker/activity"
            isCollapsed={isCollapsed}
            isActive={pathname === "/jobSeeker/activity"}
          />
        </div>
      </div>

      {/* Footer */}
      <div
        className={`flex flex-col ${
          isCollapsed ? "items-center gap-2" : "items-start gap-4 pl-6"
        } pb-8 mt-auto bg-white pt-4 z-10 w-full`}
      >
        <button
          onClick={() =>
            signOut({
              callbackUrl: "/login/company",
            })
          }
          className={`flex items-center gap-2 ${
            isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"
          } rounded-lg text-red-700 hover:bg-red-50 transition-colors`}
        >
          <LogOut size={20} />

          {!isCollapsed && (
            <span className="text-base font-medium">
              Log out
            </span>
          )}
        </button>

        <Link
          href="/company/help"
          className={`flex items-center gap-2 ${
            isCollapsed ? "w-12 h-12 justify-center" : "w-48 h-12 px-5 py-2"
          } rounded-lg text-neutral-700 hover:bg-gray-50 transition-colors`}
        >
          <HelpCircle size={20} />

          {!isCollapsed && (
            <span className="text-base font-medium">
              Help
            </span>
          )}
        </Link>
      </div>

      <style dangerouslySetInnerHTML={SCROLLBAR_STYLES} />
    </aside>
    </div>
  );
}