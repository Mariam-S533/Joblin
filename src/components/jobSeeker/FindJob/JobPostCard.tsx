import { JobPost } from '@/app/Types/seekerActivity'
import { Badge } from '@/components/ui/badge'
import { MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

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

function JobPostCard({jobPost}: {jobPost: JobPost}) {
  return (
    <>
                    <Link href={`/find-job/${jobPost.id}`} className=' cursor-pointer '>
                        <div className="p-6  rounded-md border border-[#EDEDED]">
                          <div className="flex items-start justify-between gap-4">
                                <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center">
                                    <Image src={jobPost.companyLogoUrl || "/icons/comany.png"} alt={jobPost.companyName} width={40} height={40} unoptimized={!!jobPost.companyLogoUrl}/>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    <h3 className="text-[12px] text-[#A5A5A5]">{jobPost.companyName}</h3>
                                    <p className="text-joblin-black text-[14px] lg:text-[18px]">{jobPost.title}</p>
                                    <div className="flex items-center gap-1 ">
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{jobPost.jobType}</Badge>
                                        <Badge variant="outline" className="text-joblin-primary bg-[#E6F8F1]" >{jobPost.workMode}</Badge>
                                    </div>
                                    <div className="flex items-center gap-0.5 text-[12px] text-[#353535]">
                                      <MapPin size={10} />
                                      <span>{jobPost.country}-{jobPost.city}</span>
                                    </div>
                                    <div className="flex items-center justify-between font-medium ">
                                      <p className="text-joblin-primary text-[12px] lg:text-[14px]">{jobPost.avgSalary}$/ Month</p>
                                      <span className="text-joblin-light-gray text-[10px]">{getRelativeTimeString(jobPost.createdAt)}</span>
                                    </div>
                                </div>
                          </div>
                        </div>
                        </Link>
    
    </>
  )
}

export default JobPostCard