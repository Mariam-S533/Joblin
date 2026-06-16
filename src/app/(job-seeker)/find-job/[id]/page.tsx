import JobPostDetails from "@/components/jobSeeker/FindJob/JobPostDetails"
import { getPostDetails } from "@/app/actions/searchjobs.action"



async function page({params} : {params : {id : string}}) {

    const solvedId  = await  params
    const id = solvedId.id
    const jobPostDetails = await getPostDetails(id)

  return <>
    <JobPostDetails jobPostDetails ={jobPostDetails}/>
  </>
}

export default page