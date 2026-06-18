import JobSearchComponent from "@/components/jobSeeker/FindJob/JobSearchComponent"
import { getJobPosts } from '@/app/actions/searchjobs.action'


async function page() {

  const data  = await getJobPosts(1, 10)

  return <>
  
    <JobSearchComponent initialData={data }/>
  </>
}

export default page


