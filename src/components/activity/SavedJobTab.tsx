import {  MapPin, Share2 } from 'lucide-react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge";
import { useSaveJobsContext } from '@/app/context/SaveJobsContext';
import BookmarkButton from './BookmarkButton';


function SavedJobTab() {

    const { allSavedJobs } = useSaveJobsContext()


    if (allSavedJobs.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed rounded-2xl bg-gray-50/50 text-gray-400 text-sm mt-4">
        You haven&apos;t saved any jobs yet.
      </div>
    )
  }

  return <>
  
  <div className="w-full mt-4 space-y-6">

    <div className="bg-white border border-[#EDEDED] rounded-lg hover:shadow-md overflow-hidden">
      {allSavedJobs.map((jobPost)=> (
            <div key={jobPost.jobPostId} className="flex gap-4 p-4">

                                <div className="w-16 h-16 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src={ jobPost.companyLogoUrl ||"/icons/comany.png"} alt="company logo" width={50} height={50}/>
                                </div>

                            <div className="flex-1">
                                  
                                  <div className="flex items-start justify-between ">
                                      <div className="flex flex-col gap-1 w-full mb-1">
                                          <h3 className="text-[12px] text-[#A5A5A5]">{jobPost.companyName}</h3>
                                          <p className="text-joblin-black text-[14px] lg:text-[18px]">{jobPost.jobTitle}</p> 
                                      </div>
                                      <div className="flex items-center gap-2 text-joblin-dark-gray self-start">
                                      <span ><Share2 size={22} /></span>
                                        <BookmarkButton jobPostId= {jobPost.jobPostId}  seekerProfileId={jobPost.seekerProfileId}/>
                                    </div>
                                  </div>
                              
                                  <div className="flex flex-col gap-1 w-full mb-1">
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{jobPost.jobType}</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{jobPost.workMode}</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>{jobPost.city}</span>
                                    </div>
                                  </div> 

                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">{jobPost.avgSalary}$ / Month</p>
                                    </div>
                              </div>

            </div> 
       ))}       
    </div>
    
  </div>

  
  </>
}

export default SavedJobTab

