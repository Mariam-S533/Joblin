"use client"

import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"
import Image from "next/image"
import { CourseEnrollment } from "@/app/Types/courses"

export type ApplicationStatus = "Applied" | "Checked" | "Rejected" | "Accepted" | "Interviewed"

const FILTER_OPTIONS: (ApplicationStatus | "All")[] = [
  "All", "Applied", "Checked", "Rejected", "Accepted", "Interviewed"
]

export default function CoursesStatusTab({myEnrollments}: {myEnrollments:CourseEnrollment[]}) {


  const [currentSubFilter, setCurrentSubFilter] = useState<string>("All")
  const [sortOrder, setSortOrder] = useState<string>("newest")
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>(myEnrollments)

      useEffect(() => {
        setEnrollments(myEnrollments)
      }, [myEnrollments])

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case "Interviewed": return "border-cyan-500 text-cyan-600 bg-cyan-50/30"
      case "Applied": return "border-gray-500 text-gray-700 bg-gray-50"
      case "Rejected": return "border-red-500 text-red-600 bg-red-50/30"
      case "Checked": return "border-amber-500 text-amber-600 bg-amber-50/30"
      case "Accepted": return "border-joblin-primary text-joblin-primary bg-green-50/30"
      default: return "border-gray-300 text-gray-600 bg-gray-50"
    }
  }

  const sortedApplications = [...enrollments].sort((a, b) => {
    const timeA = new Date(a.appliedAt).getTime()
    const timeB = new Date(b.appliedAt).getTime()
    return sortOrder === "newest" ? timeB - timeA : timeA - timeB
  })

  const visibleApplications  = sortedApplications.filter(course => 
    currentSubFilter === "All" || course.status.toLowerCase() === currentSubFilter.toLowerCase()
  )

  return (
    <div className="w-full mt-4 space-y-6">
      
      <div className="flex flex-col lg:flex-row justify-between pb-3 gap-4">
        
        <div className="flex gap-2 flex-wrap pb-1 md:justify-between lg:justify-start w-full sm:w-auto">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => {
                setCurrentSubFilter(filter)
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-sm border transition-all cursor-pointer ${
                currentSubFilter === filter
                  ? "bg-joblin-primary border-joblin-primary text-white shadow-sm"
                  : "bg-white text-[#515151] border-[#A5A5A5] hover:border-joblin-primary hover:text-joblin-primary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <select
          title="Sort applications by date"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border rounded-sm px-3 py-1.5 pl-3 pr-10 text-sm bg-white border-[#A5A5A5] text-[#515151] focus:outline-none cursor-pointer self-end"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>

      <div className="space-y-4">
           { visibleApplications .length > 0 ? (
            visibleApplications .map((course) => {

            
            const formattedDate = new Date(course.appliedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric"
            })

            return (
              <div key={course.enrollmentId} className="bg-white border border-[#EDEDED] rounded-lg hover:shadow-md overflow-hidden">
                
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    
                    <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100 shadow-sm flex-shrink-0 relative overflow-hidden">
                      <Image 
                        src={"/company-placeholder.png"} 
                        alt="company" 
                        width={56} 
                        height={56}
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[12px] font-semibold text-[#A5A5A5] capitalize tracking-wide">
                        {course.companyName}
                      </span>
                      <h3 className="text-[18px] font-bold text-gray-900">
                        {course.offeringTitle}
                      </h3>
                      <div className="pt-0.5 flex items-center  gap-4 ">
                        <span className={`px-2 py-1 border text-xs font-medium rounded-[4px] inline-block ${getStatusBadgeStyles(course.status)}`}>
                          {course.status}
                        </span>
                          <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span><strong>Applied On:</strong> {formattedDate}</span>
                      </div>
                      </div>
                    </div>
                  </div>
                  
                </div>

              </div>
            )
          })

        ) : (
          <div className="text-center py-12 border border-dashed rounded-2xl bg-gray-50/50 text-gray-400 text-sm">
            No matching enrollments listed under {currentSubFilter}.
          </div>
        )}
      </div>
    </div>
  )
}

