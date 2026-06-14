"use client"

import { CompDetails } from '@/app/Types/company'
import Image from "next/image"
import { Globe, Mail, MapPin, Bookmark, Share2, UserPlus, ChevronRight, LucideIcon } from "lucide-react"
import Link from "next/link"
import { Button } from '@/components/ui/button'
import {  Linkedin, Facebook, Instagram, Twitter } from "lucide-react"
import { Badge } from "@/components/ui/badge";
import { JobPost } from '@/app/Types/seekerActivity'

interface CompanyDetailsProps{
  compDetails: CompDetails,
  jobsData:JobPost[]
}


const SOCIAL_PLATFORMS_MAP: Record<string, { icon: LucideIcon; colorClass: string }> = {
  linkedin: { icon: Linkedin, colorClass: "hover:text-[#0A66C2] hover:bg-[#0A66C2]/5 hover:border-[#0A66C2]/20" },
  facebook: { icon: Facebook, colorClass: "hover:text-[#1877F2] hover:bg-[#1877F2]/5 hover:border-[#1877F2]/20" },
  instagram: { icon: Instagram, colorClass: "hover:text-[#E1306C] hover:bg-[#E1306C]/5 hover:border-[#E1306C]/20" },
  twitter: { icon: Twitter, colorClass: "hover:text-black hover:bg-gray-100 hover:border-gray-200" },
  x: { icon: Twitter, colorClass: "hover:text-black hover:bg-gray-100 hover:border-gray-200" },
};


function getRelativeTimeString(dateString: string): string {
  const now = new Date();
  const postedDate = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - postedDate.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
}


function CompanyDetails({ compDetails, jobsData }: CompanyDetailsProps) {


  

  return <>
  
          <div className=" w-full min-h-screen bg-white">
            <div className="lg:container md:w-[85%] w-[90%] mx-auto">
            <div className="px-4 py-5 border border-joblin-gray-200 rounded-sm shadow-sm ">

            <div className="flex flex-col lg:flex-row gap-10  ">

              {/* logo image */}
              <div className="flex justify-center md:justify-start ">
                            <div className="w-20 h-20 rounded-xl border border-gray-100 p-2 bg-white flex items-center justify-center shrink-0 shadow-sm">
                              <Image 
                                src={ compDetails.logoUrl ||"/icons/comany.png"} 
                                alt= {compDetails.companyName || "company"} 
                                width={80} 
                                height={80} 
                                className="object-contain"
                              />
                            </div>
               </div>

              {/* info */}
              <div className="flex-1">

                {/* name */}
                <div className="flex justify-between items-center ">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex gap-1">
                    <h1 className="lg:text-[32px] text-[28px] font-bold text-gray-900 leading-none">{compDetails.companyName}</h1>
                    <button type="button" className="flex items-center justify-center text-joblin-primary  hover:bg-gray-50  rounded-lg transition-colors">
                        <Bookmark size={18} />
                    </button>
                    </div>
                    <Link 
                      href={compDetails.domain} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-emerald-600 text-[12px] lg:text-[14px] inline-flex items-center gap-1 hover:underline justify-center sm:justify-start"
                    >
                      <Globe size={14} />
                      {compDetails.domain}
  
                    </Link>
                  </div>

                          {/* Action Buttons */}
                    <div className="flex items-center justify-center sm:justify-end gap-2 w-full sm:w-auto pe-3">
                      <Button type="button" className="bg-joblin-primary hover:bg-joblin-primary/70 text-white px-6 font-semibold rounded-md  text-sm transition-colors">
                        Follow
                      </Button>
                      <button type="button" className="flex items-center justify-center text-joblin-primary hover:bg-gray-50 rounded-lg transition-colors">
                        <Share2 size={18} />
                      </button>
                    </div>
                </div>


              {/* 4cards */}
              <div className="">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-0 pt-6 text-sm ">
                  
                  <div className="flex flex-col gap-1.5 pr-4 pl-2 sm:pl-4 ">
                    <span className="text-gray-400 font-medium flex items-center gap-1.5">
                      <MapPin size={16} className="text-gray-400" /> Location
                    </span>
                    <span className="font-semibold text-[14px] lg:text-[16px] text-[#353535]">
                        <span>{compDetails.addresses.find(add => add.isHeadQuarters)?.city ?? compDetails.addresses[0]?.city ?? "Remote"}</span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 border-l border-gray-100 pl-6 sm:pl-8">
                    <span className="text-gray-400 font-medium flex items-center gap-1.5">
                      <UserPlus size={16}/>
                      Company size
                    </span>
                    <span className="font-semibold text-[14px] lg:text-[16px] text-[#353535]">{compDetails.companySize}</span>
                  </div>

                  <div className="flex flex-col gap-1.5 border-l-0 lg:border-l border-gray-100 pl-2 sm:pl-4 lg:pl-8 pr-4 min-w-0">
                    <span className="text-[14px] text-gray-400 font-medium flex items-center gap-1.5">
                      <Mail size={16} className="text-gray-400" /> Email
                    </span>
                    <span className="font-semibold text-[14px] lg:text-[16px] text-[#353535]">
                      {compDetails.publicContactMail}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 border-l border-gray-100 pl-6 sm:pl-8 ">
                    <span className="text-[14px] text-gray-400 font-medium flex items-center gap-1.5">
                      <UserPlus  size={16} className="text-gray-400" /> Followers
                    </span>
                    <span className="font-semibold text-[14px] lg:text-[16px] text-[#353535]">{compDetails.followersCount}</span>
                  </div>

                </div>
              </div>

              </div>


            </div>

            </div>



            {/* comp info */}
            <div className="my-8">
                <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold">About Company</h2>
                <p className="text-[14px] lg:text-[16px] text-[#282828]">
                    {compDetails.companySize}
                </p>
            </div>


            {/* company job Posts */}
              <div className="my-8">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="">
                      <h2 className="text-[14px] lg:text-[18px]  font-semibold">Company Jobs</h2>
                  </div>
                  <div className=" text-joblin-primary flex  md:items-center text-[14px] gap-2 cursor-pointer font-medium"> 
                       <Link href={`/companies/${compDetails.id}/jobs`} className=" text-joblin-primary flex items-center text-[14px] gap-2 cursor-pointer font-medium">
                       <span>More </span> <ChevronRight size={15}/>
                       </Link> 
                  </div>
                </div>

              <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 ">
              {jobsData.slice(0, 6).map((post)=> (
  
                      <div  key={post.id} className="p-6   rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/icons/comany.png" alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="text-[12px] text-[#A5A5A5]">{post.companyName}</h3>
                                    <p className="text-joblin-black text-[14px] lg:text-[18px]">{post.title}</p>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{post.jobType}</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{post.workMode}</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>{post.city}</span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">{post.avgSalary}$ / Month</p>
                                      <span className="text-joblin-light-gray text-[10px]">{getRelativeTimeString(post.createdAt)}</span>
                                    </div>
                                </div>
                          </div>
                      </div>

               ))}
            </div>


            </div>


            {/* social links */}
            {compDetails.socialLinks && compDetails.socialLinks.length > 0 && (
              <div className="my-8">
              <div className=" border-t border-gray-100 pt-5">
                  <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold text-gray-900">Social Media</h2>
                  <div className="flex items-center gap-3">
                      
                 {compDetails.socialLinks.map((social, index) => {
                  const normalizedKey = social.platform.toLowerCase();
                  const platformConfig = SOCIAL_PLATFORMS_MAP[normalizedKey];
                  
                  // Use specific icon mapped or fallback to dynamic globe instance configuration
                  const IconComponent = platformConfig ? platformConfig.icon : Globe;
                  const customClasses = platformConfig ? platformConfig.colorClass : "hover:text-joblin-primary hover:bg-gray-100";

                  return (
                    <Link 
                      key={index}
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`w-10 h-10 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 transition-all duration-200 shadow-sm ${customClasses}`}
                      title={social.platform}
                    >
                      <IconComponent size={18} />
                    </Link>
                  );
                })}

                  </div>
              </div>  
            </div>
            )}



            </div>
          </div> 
  
  </>
}

export default CompanyDetails