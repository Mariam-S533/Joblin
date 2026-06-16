import { getMyApps } from "@/app/actions/application.action"
import { getAllenrollments } from "@/app/actions/courses.action"
import { getAllSavedJobs } from "@/app/actions/savedJop.action"
import ActivityComponent from "@/components/activity/ActivityComponent"


async function page() {

  const myEnrollments = await getAllenrollments()
  const applicationSatus = await getMyApps()
  const allSavedJobs = await getAllSavedJobs()

  return <>
  
  <ActivityComponent myEnrollments={myEnrollments} applicationSatus={applicationSatus} allSavedJobs={allSavedJobs}/>

  </>
}

export default page