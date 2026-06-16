"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bookmark, CalendarClock, Clock, MapPin, CircleCheck, CircleDollarSign, Video, GraduationCap, Award, BadgeCheck } from "lucide-react"
import Image from "next/image"
import { useProfileContext } from '@/app/context/ProfilesProvider';
import { useState } from "react"
import { CourseOffering } from "@/app/Types/courses.action"
import { enrollIntAcourse } from "@/app/actions/courses.action"
import { toast } from "sonner"

interface CourseDetailsProps {
    courseDetails: CourseOffering;
    similarCourses: CourseOffering[];
}


function CourseDetails({ courseDetails, similarCourses }: CourseDetailsProps) {

        const { currentProfileId } = useProfileContext()
        const [isApplying, setIsApplying] = useState(false)
        const offeringId = courseDetails?.id
        

        async function handleEnrollment(){
            if (isApplying) return
            try {
                setIsApplying(true)
                const res = await enrollIntAcourse(offeringId)
                toast.success("Successfully enrolled in the course!", {position: "top-right", duration: 3000})
            } catch (error) {
                toast.error("Something went wrong. Please try again.", {position: "top-right", duration: 3000})
            }finally {
            setIsApplying(false)
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
                                                    <Image src={"/icons/comany.png"} alt="company logo" width={80} height={80}/>
                                                </div>
                                                <div className="flex flex-col gap-2.5 w-full">
                                                  <div className="flex gap-1 items-center">
                                                    <span className="text-[12px] text-[#A5A5A5]">{courseDetails.companyName}</span>
                                                    <CircleCheck size={15} className="text-joblin-primary"  />
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <h1 className="text-joblin-black text-[14px] lg:text-[18px]">{courseDetails.title}</h1>
                                                        <Badge 
                                                            variant="outline" 
                                                            className="rounded-full bg-joblin-light-green px-3 py-0.5 text-[12px]"
                                                            >
                                                            {courseDetails.offeringStatus}
                                                        </Badge>
                                                        <button type="button">
                                                            {/* onclick call savedjobs endpoint */}
                                                            <Bookmark size={20}  className="text-joblin-primary"/>
                                                        </button>
                                                    </div>
                                                        <div className=" w-[90%]  text-[14px] text-joblin-light-gray">
                                                            <span>{courseDetails.description} </span>
                                                        </div>
                                                    <div className="flex items-center gap-2 text-[12px] text-[#353535]">
                                                        <Button type="button" 
                                                                onClick={handleEnrollment}
                                                                className="bg-joblin-primary text-white hover:bg-joblin-primary/70 px-5">
                                                        {isApplying ? "Enrolling..." : "Enroll Now"}
                                                        </Button>
                                                        <Button type='button' className='bg-white text-joblin-primary border border-joblin-primary hover:bg-joblin-primary hover:text-white px-5'>Message</Button>
                                                    </div>
                                                </div>
                                        </div>
                                </div>

        <div className="flex flex-col gap-9">
                {/* grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-3 md:gap-x-5 my-5 justify-items-center md:justify-items-stretch">
                    
                    {/*  */}
                    <div className="flex w-full justify-center md:justify-start lg:justify-start">
                        <div className="flex items-center gap-3 w-[180px]">
                            <div className="w-7 h-7 flex items-center justify-center text-joblin-black">
                                <Video size={25} className="shrink-0"/>
                            </div>
                            <div className="flex flex-col ">
                                <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.city}</span>
                                <p className="text-[14px] text-joblin-light-gray mt-1 leading-none">Location</p>
                            </div>
                        </div>
                    </div>

                    {/* 2nd Item (Centered on lg, Left-aligned on md, Centered on sm) */}
                    <div className="flex w-full justify-center md:justify-start lg:justify-center">
                        <div className="flex items-center gap-3 w-[180px]">
                            <div className="w-7 h-7 flex items-center justify-center text-joblin-black">
                                <Clock size={25} className="shrink-0"/>
                            </div>
                            <div className="flex flex-col ">
                                <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.duration}</span>
                                <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Total Time</p>
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
                                <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.startDate}</span>
                                <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Start Date</p>
                            </div>
                        </div>
                    </div>

                    {/* 4th Item (End-aligned on lg, Left-aligned on md, Centered on sm) */}
                    <div className="flex w-full justify-center md:justify-start lg:justify-end">
                        <div className="flex items-center gap-3 w-[180px]">
                            <div className="w-7 h-7 flex items-center justify-center text-joblin-black">
                                <CircleDollarSign  size={25} className="shrink-0"/>
                            </div>
                            <div className="flex flex-col ">
                                <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.price}</span>
                                <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Price</p>
                            </div>
                        </div>
                    </div>

                </div>


            {/* course details */}
            <div className="">
              <div className="flex items-start gap-1">
                <GraduationCap size={20} />
                <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold">Course Introdaction</h2>
              </div>
                <p className="text-[14px] lg:text-[16px] text-[#282828]">
                    {courseDetails.description}
                </p>
            </div>

            {/* responspilotes */}
            <div className="">
              <div className="flex items-start gap-1">
                <div> <Award size={20} /></div>
                <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold text-joblin-black">What You&apos;ll Learn</h2>
                </div>
              <p className="text-[14px] lg:text-[16px] text-[#282828]">
                    {courseDetails.outcomeDescription}
                </p>
            </div>

            {/* requirments */}
            <div className="">
                <div className="flex items-start gap-1 ">
                 <div><BadgeCheck  size={20}  className=""/></div>
                <h2 className="  text-[14px] lg:text-[18px] mb-3 font-semibold text-joblin-black">Skills You&apos;ll Gain</h2>
                </div>
                <div className="flex gap-2 items-center">
                      <Badge 
                      variant="outline" 
                      className="rounded-sm text-joblin-primary border-2 border-joblin-primary bg-whigt px-3 py-1 text-[12px]"
                      >
                      {courseDetails.offeringStatus}
                      </Badge>
                </div>  
            </div>

            {/* company */}
              <div className=" my-6">
                  <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold text-joblin-black">Course Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                      <div className="flex flex-col p-2 items-center gap-2">
                      <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Course Level</p>
                      <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.difficultyLevel}</span>
                      </div>

                      <div className="flex flex-col p-2 items-center gap-2">
                      <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Category</p>
                      <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.technicalDomain}</span>
                      </div>

                      <div className="flex flex-col p-2 items-center gap-2">
                      <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Mode</p>
                      <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.deliveryMode}</span>
                      </div>
                </div>
            </div>

            {/* company */}
              <div className=" my-6">
                  <h2 className="text-[14px] lg:text-[18px] mb-3 font-semibold text-joblin-black">Duration & Schedule</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
                      <div className="flex flex-col p-2 items-center gap-2">
                      <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Duration</p>
                      <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.duration}</span>
                      </div>

                      <div className="flex flex-col p-2 items-center gap-2">
                      <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">Start Date</p>
                      <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.startDate}</span>
                      </div>

                      <div className="flex flex-col p-2 items-center gap-2">
                      <p className="text-[14px] text-joblin-light-gray  mt-1 leading-none">End Date</p>
                      <span className="text-[16px] font-medium leading-none text-joblin-black">{courseDetails.endDate}</span>
                      </div>
                </div>
            </div>

        </div>

        {/* similer jobs */}

        <div className="my-9 mb-10">
            <h2 className="text-[14px] lg:text-[18px] mb-4 font-semibold">Similer posts</h2>
                    <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 ">
                    {similarCourses && similarCourses.length > 0? (
                        similarCourses.filter((course) => course.id !== courseDetails.id)
                        .map((course) => (
                            <div key={course.id} className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src={course.companyLogoUrl || "/icons/comany.png"} alt="company logo" width={40} height={40}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="text-[12px] text-[#A5A5A5]">{course.companyName}</h3>
                                    <p className="text-joblin-black text-[14px] lg:text-[18px]">{course.title}</p>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{course.difficultyLevel}</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{course.deliveryMode}</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>{course.city}</span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">{course.price}$ / Month</p>
                                      <span className="text-joblin-light-gray text-[10px]">{course.duration}</span>
                                    </div>
                                </div>
                          </div>
                      </div>
                        ))
                      ) :(
                                <p className="text-sm text-gray-500 col-span-full">No other courses available from this company.</p>
                     )}
                  </div>
            </div>

        </div>

            </div>
        </div>
  
  </>
}

export default CourseDetails