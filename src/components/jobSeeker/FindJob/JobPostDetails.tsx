"use client"

import {  JobPost } from "@/app/Types/seekerActivity"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, CalendarClock, Clock, MapPin, Building2, Zap } from "lucide-react"
import Image from "next/image"
import { useProfileContext } from '@/app/context/ProfilesProvider';
import { postApplyJob } from "@/app/actions/application.action"
import { toast } from "sonner"
import { useState } from "react"
import EnhanceCVDialog from "./EnhanceCVDialog"
import SkillGapDialog from "./SkillGapDialog"


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


function JobPostDetails({jobPostDetails} : {jobPostDetails : JobPost}) {

        const { currentProfileId } = useProfileContext()
        const [showEnhanceDialog, setShowEnhanceDialog] = useState(false)
        const [showSkillGapDialog, setShowSkillGapDialog] = useState(false)


        async function handleApplyClick() {
            if (!currentProfileId) {
                toast.error("Please select or log in to a profile before applying", { position: "top-center", duration: 3000 })
                return
            }
            setShowEnhanceDialog(true)
        }

        async function handleApplyWithoutEnhance() {
            try {
                await postApplyJob(currentProfileId, jobPostDetails.id)
                toast.success("Application submitted successfully!")
            } catch (error) {
                const raw = error instanceof Error ? error.message : ""
                if (raw.includes("400") || raw.includes("Bad Request")) {
                    toast.error("Couldn't apply — please make sure your profile is complete and you haven't already applied for this job.")
                } else {
                    toast.error("Something went wrong while applying. Please try again.")
                }
            }
        }



        



  return <>
  
    <div>
        <div className=" w-full min-h-screen bg-white">
            <div className="lg:container md:w-[85%] w-[90%] mx-auto">
                {/* header */}
            
                                <div className="p-6 border-b-1 shadow-sm mb-8">
                                        <div className="flex items-start justify-between gap-4">
                                                <div className="w-18 h-18 rounded-md overflow-hidden flex items-center justify-center">
                                                    <Image src={ jobPostDetails.companyLogoUrl ||"/icons/comany.png"} alt="company logo" width={80} height={80} unoptimized />
                                                </div>
                                                <div className="flex flex-col gap-2.5 w-full">
                                                    <span className="text-[12px] text-[#A5A5A5]">{jobPostDetails.companyName }</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <h1 className="text-joblin-black text-[14px] lg:text-[18px]">{jobPostDetails.title}</h1>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`rounded-full px-3 py-0.5 text-[12px] ${
                                                                jobPostDetails.jobStatus === 'Active' 
                                                                ? 'text-green-700 bg-green-50 border-green-200' 
                                                                : 'text-gray-600 bg-gray-100 border-gray-300'
                                                            }`}
                                                            >
                                                            {jobPostDetails.jobStatus}
                                                        </Badge>
                                                        <button type="button">
                                                            {/* onclick call savedjobs endpoint */}
                                                            <Bookmark size={20}  className="text-joblin-primary"/>
                                                        </button>
                                                    </div>
                                                    <div className="flex items-center gap-1 ">
                                                        <div className=" flex items-center gap-2 text-[14px] text-joblin-light-gray">
                                                            <span>{jobPostDetails.country}. </span>
                                                            {/* <span>{new Date(jobPostDetails.createdAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </span> */}
                                                            <span>{getRelativeTimeString(jobPostDetails.createdAt)}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[12px] text-[#353535]">
                                                        <Button type="button" 
                                                                onClick={handleApplyClick}
                                                                disabled={jobPostDetails.jobStatus !== 'Active'}
                                                                className="bg-joblin-primary text-white hover:bg-joblin-primary/70 px-5">
                                                        Apply Now
                                                        </Button>
                                                        <Button type='button' className='bg-white text-joblin-primary border border-joblin-primary hover:bg-joblin-primary hover:text-white px-5'>Message</Button>
                                                            <Button
                                                            type="button"
                                                            onClick={() => setShowSkillGapDialog(true)}
                                                            className="bg-white text-joblin-primary border border-joblin-primary hover:bg-joblin-primary hover:text-white px-5 gap-1.5"
                                                        >
                                                            <Zap size={14} />
                                                            Skill Gap
                                                        </Button>
                                                    </div>
                                                </div>
                                        </div>
                                </div>

        <div className="flex flex-col gap-9">
                {/* grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-3 md:gap-x-5 my-5 justify-items-center md:justify-items-stretch">
                    
                    {/* 1st Item (Start-aligned on lg, Left-aligned on md, Centered on sm) */}
                    <div className="flex w-full justify-center md:justify-start lg:justify-start">
                        <div className="flex items-center gap-3 w-[180px]">
                            <div className="w-7 h-7 flex items-center justify-center text-joblin-black">
                                <Clock size={25} className="shrink-0"/>
                            </div>
                            <div className="flex flex-col ">
                                <span className="text-[16px] font-medium leading-none text-joblin-black">{jobPostDetails.jobType}</span>
                                <p className="text-[14px] text-joblin-light-gray mt-1 leading-none">Employment Type</p>
                            </div>
                        </div>
                    </div>

                    {/* 2nd Item (Centered on lg, Left-aligned on md, Centered on sm) */}
                    <div className="flex w-full justify-center md:justify-start lg:justify-center">
                        <div className="flex items-center gap-3 w-[180px]">
                            <div className="w-7 h-7 flex items-center justify-center text-joblin-black">
                                <Building2 size={25} className="shrink-0"/>
                            </div>
                            <div className="flex flex-col ">
                                <span className="text-[16px] font-medium leading-none text-joblin-black">{jobPostDetails.workMode}</span>
                                <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Work Mode</p>
                            </div>
                        </div>
                    </div>

                    {/* 3rd Item (Centered on lg, Left-aligned on md, Centered on sm) */}
                    <div className="flex w-full justify-center md:justify-start lg:justify-center">
                        <div className="flex items-center gap-3 w-[180px]">
                            <div className="w-7 h-7 flex items-center justify-center text-joblin-black">
                                <CalendarClock size={25} className="shrink-0"/>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[16px] font-medium leading-none text-joblin-black">{jobPostDetails.reqExpYears} Years</span>
                                <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Experience Level</p>
                            </div>
                        </div>
                    </div>

                    {/* 4th Item (End-aligned on lg, Left-aligned on md, Centered on sm) */}
                    <div className="flex w-full justify-center md:justify-start lg:justify-end">
                        <div className="flex items-center gap-3 w-[180px]">
                            <div className="w-7 h-7 flex items-center justify-center text-joblin-black">
                                <MapPin size={25} className="shrink-0"/>
                            </div>
                            <div className="flex flex-col ">
                                <span className="text-[16px] font-medium leading-none text-joblin-black">{jobPostDetails.city}</span>
                                <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Location</p>
                            </div>
                        </div>
                    </div>

                </div>


            {/* course details */}
            <div className="">
                <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold">Overview</h2>
                <p className="text-[14px] lg:text-[16px] text-[#282828]">
                    {jobPostDetails.description}
                </p>
            </div>

            {/* responspilotes */}
            <div className="">
                <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold text-joblin-black">Job Responsibilities</h2>
                <ul className="pl-5 list-disc marker:text-[15px]  marker:text-joblin-primary flex flex-col gap-2">
                    <li className="text-[14px] lg:text-[16px] text-[#282828]">
                        <span className="">{jobPostDetails.responsibilities}</span>
                    </li>
                </ul>
            </div>

            {/* requirments */}
                <div className="">
                <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold text-joblin-black">Job Requirments</h2>
                <ul className="pl-5 list-disc marker:text-[15px]  marker:text-joblin-primary flex flex-col gap-2">
                    <li className="text-[14px] lg:text-[16px] text-[#282828]">
                        <span>{jobPostDetails.requirements}</span>
                    </li>
                </ul>
            </div>

            {/* company */}
                <div className=" my-6">
                <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold text-joblin-black">About Company</h2>
                <p className="text-[14px] lg:text-[16px] text-[#282828]">
                </p>
            </div>

        </div>

        {/* similer jobs */}
        <div className="mt-7 mb-10">
            <h2 className="text-[14px] lg:text-[18px] mb-4 font-semibold">Similer Jobs</h2>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
                      <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/icons/comany.png" alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="text-[12px] text-[#A5A5A5]">McDonaldS</h3>
                                    <p className="text-joblin-black text-[14px] lg:text-[18px]">Web Designer</p>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Full Time</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Onsite</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>London</span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">255$ / Month</p>
                                      <span className="text-joblin-light-gray text-[10px]">1 hour ago</span>
                                    </div>
                                </div>
                          </div>
                      </div>
                  </div>
        </div>

            </div>
        </div>
    </div>
   
  {showEnhanceDialog && (
      <EnhanceCVDialog
          jobPostId={jobPostDetails.id}
          jobTitle={jobPostDetails.title}
          onApplyWithoutEnhance={handleApplyWithoutEnhance}
          onCancel={() => setShowEnhanceDialog(false)}
      />
  )}
    {showSkillGapDialog && (
      <SkillGapDialog
          jobPostId={jobPostDetails.id}
          seekerProfileId={currentProfileId ?? undefined}
          onClose={() => setShowSkillGapDialog(false)}
      />
  )}
  </>
}

export default JobPostDetails













