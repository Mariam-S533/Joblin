import { BookmarkCheck, MapPin, Share2 } from 'lucide-react'
import Image from 'next/image'
import { Badge } from "@/components/ui/badge";

function SavedJobTab() {
  return <>
  
  <div className="w-full mt-4 space-y-6">

    <div className="bg-white border border-[#EDEDED] rounded-lg hover:shadow-md overflow-hidden">
            <div className="flex gap-4 p-4">

                                <div className="w-16 h-16 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src="/icons/comany.png" alt="company logo" width={50} height={50}/>
                                </div>

                            <div className="flex-1">
                                  
                                  <div className="flex items-start justify-between ">
                                      <div className="flex flex-col gap-1 w-full mb-1">
                                          <h3 className="text-[12px] text-[#A5A5A5]">McDonaldS</h3>
                                          <p className="text-joblin-black text-[14px] lg:text-[18px]">Web Designer</p>
                                      </div>
                                      <div className="flex items-center gap-2 text-joblin-dark-gray self-start">
                                      <span ><Share2 size={22} /></span>
                                      <span><BookmarkCheck size={22} /></span>
                                    </div>
                                  </div>
                              
                                  <div className="flex flex-col gap-1 w-full mb-1">
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Full Time</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >Onsite</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>London</span>
                                    </div>
                                  </div> 

                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">255$ / Month</p>
                                      <span className="text-joblin-light-gray text-[10px]">1 hour ago</span>
                                    </div>
                              </div>

            </div>        
          </div>
    
  </div>

  
  </>
}

export default SavedJobTab

