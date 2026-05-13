"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { NavigationMenu, NavigationMenuItem, NavigationMenuList } from "@/components/ui/navigation-menu"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import { Search, Bell, Menu, LogOut, LogIn, ChevronDown, User, Briefcase, BookOpen, Settings, UserCircle } from "lucide-react"

import { useSession } from "next-auth/react"
import { Separator } from "../ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useLogout } from "@/hooks/useLogout"

const NAV_ITEMS = [
  { href: "/company/home", label: "Home" },
  { href: "/company/post-job", label: "Post a Job" },
  { href: "/company/search-cv", label: "Search CV" },
  { href: "/company/pricing", label: "Pricing" },
]

function CompanyNavbar() {

  const pathname = usePathname()
  const { data: session, status } = useSession()
  const isAuthenticated = status === "authenticated"
  const [open, setOpen] = useState(false)
  const logout = useLogout()

  return (

    <div className="fixed top-0 left-0 w-full z-30 pt-6 ">
      <div className="lg:container w-[90%]  mx-auto">

        <NavigationMenu className="w-full bg-white max-w-full! flex justify-between items-center rounded-sm px-3 md:px-6 py-4 shadow-sm border-1 border-gray-300">

          {/* logo image */}
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/company/home">
                <Image
                  src="/darklogo.svg"
                  alt="logo"
                  width={120}
                  height={50}
                  sizes='25vw'
                />
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>


          {/*  nav linkes */}
          <NavigationMenuList className="hidden lg:flex gap-10 text-[16px] font-medium">

            {NAV_ITEMS.map((item) => (
              <NavigationMenuItem
                key={item.href}
                className={`transition
                ${pathname === item.href && "text-green-600"}
                    `}
              >
                <Link href={item.href}>{item.label}</Link>
              </NavigationMenuItem>
            ))}

          </NavigationMenuList>


          
          <NavigationMenuList className="flex items-center  gap-3 md:gap-6 lg:gap-6">

            {/*  search icon */}
            <NavigationMenuItem>
              <Search size={22} className="cursor-pointer text-[#222222] " />
            </NavigationMenuItem>


             {/*  bell icon */}
            <NavigationMenuItem className="hidden md:block">
              <div className="relative" >
                 <Bell size={22} className="cursor-pointer text-[#222222]" />
              </div>
              <Badge className="absolute -top-3 -right-2 h-5 min-w-5 rounded-full px-1 bg-[#DC0000] text-white">
                12
              </Badge>

            </NavigationMenuItem>


            {/* employer and user dropdownmenu  */}
            <NavigationMenuItem className=" items-center gap-4 flex">
              <div className="hidden md:block">
                <Link href="/seeker/home" className="text-[#515151] hover:text-black">
                  Job seeker
                </Link>
              </div>

              <div className='hidden md:flex items-center'>
                <span className="h-8 ">
                  <Separator orientation="vertical" className="bg-[#A5A5A5]" />
                </span>
              </div>

            {/* ── Loading state: show skeleton to avoid flash ── */}
            {status === "loading" && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                <div className="hidden md:block h-4 w-20 rounded bg-gray-200 animate-pulse" />
              </div>
            )}

            {/* ── Authenticated: user dropdown ── */}
            {isAuthenticated && session && (
              <div>
                <DropdownMenu>

                  <DropdownMenuTrigger asChild>
                    <button type="button" className="flex items-center gap-2 cursor-pointer focus:outline-none group">
                      <div className="">
                        <UserCircle className="h-8 w-8 text-neutral-400 group-hover:text-emerald-500 transition-colors" />
                      </div>
                      <span className="hidden md:block text-[14px] font-semibold text-gray-800 max-w-30 truncate">
                        {session.displayName || "User"}
                      </span>
                      <ChevronDown size={20} className="text-gray-700" />
                    </button>
                  </DropdownMenuTrigger>

                  {/* ── Dropdown Content ── */}
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>
                      <p className="text-[13px] font-semibold text-gray-800 truncate">
                        {session.displayName || "User"}
                      </p>
                      <p className="text-[11px] text-gray-400 font-normal truncate">
                        {session.email || ""}
                      </p>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    {/* Profile links */}
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link href="/company/profile" className="flex items-center gap-2 cursor-pointer">
                          <User size={15} /> My Profile
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/company/dashboard" className="flex items-center gap-2 cursor-pointer">
                          <Briefcase size={15} /> Dashboard
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/company/post-job" className="flex items-center gap-2 cursor-pointer">
                          <BookOpen size={15} /> Post Job
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuItem asChild>
                        <Link href="/company/settings" className="flex items-center gap-2 cursor-pointer">
                          <Settings size={15} /> Settings
                        </Link>
                      </DropdownMenuItem>
                    
                      <DropdownMenuItem asChild className="hidden sm:block lg:hidden">
                          <div className="hidden md:block">
                            <Link href="/company/home" className="text-gray-600 hover:text-black">
                            Employer
                            </Link>
                          </div>
                      </DropdownMenuItem>

                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => logout("/login/company")}
                      className="flex items-center gap-2 text-red-500 focus:text-red-500 focus:bg-red-50 cursor-pointer"
                    >
                      <LogOut size={15} /> Logout
                    </DropdownMenuItem>

                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}


              {/* ── Unauthenticated: Sign Up button ── */}
              {status !== "loading" && !isAuthenticated && (
            <div className='flex text-lg gap-2 justify-center items-center '>
           
              <div className=" bg-[#222222] text-white px-3 py-1 rounded-sm cursor-pointer">
                < Link href="/register/company" className='flex gap-0.5 justify-center items-center'> <LogIn size={18}/> <span className=" text-[16px]">Sign Up</span></Link>
              </div>
            </div>
            )}
            </NavigationMenuItem>


            {/* sheet */}
            <NavigationMenuItem className="lg:hidden text-lg">

              <Sheet open={open} onOpenChange={setOpen}>

                <SheetTrigger>
                  <div className=" bg-gray-400 rounded-full p-2">
                    <Menu  size={20} className="text-[#222222]"/>
                  </div>
                </SheetTrigger>

                <SheetContent side="left" className="w-64">

                  <SheetTitle className="p-4">
                    <Image
                      src="/darklogo.svg"
                      alt="logo"
                      width={120}
                      height={50}
                    />
                  </SheetTitle>

                  <div className="flex flex-col gap-5">

                    {NAV_ITEMS.map((item) => (

                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`border-b p-3 cursor-pointer
                        ${(item.href === "/" && pathname === "/") || 
                            (item.href !== "/" && pathname.startsWith(item.href))
                            ? "text-green-600 font-semibold"
                            : ""}
                        `}
                      >
                        {item.label}
                      </Link>

                    ))}

                  </div>

                </SheetContent>
              </Sheet>


            </NavigationMenuItem>


          </NavigationMenuList>

        </NavigationMenu>

      </div>

    </div>
  )
}

export default CompanyNavbar