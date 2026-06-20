import JobPostDetails from "@/components/jobSeeker/FindJob/JobPostDetails"
import { getPostDetails } from "@/app/actions/searchjobs.action"

type PageProps = {
  params: Promise<{ id: string }>
}

async function page({params} : PageProps) {

    const solvedId  = await  params
    const id = solvedId.id
    const jobPostDetails = await getPostDetails(id)

  return <>
    <JobPostDetails jobPostDetails ={jobPostDetails}/>
  </>
}

export default page