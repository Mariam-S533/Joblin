import { getMyApps } from "@/app/actions/application.action"
import { getAllenrollments } from "@/app/actions/courses.action"
import { getAllSavedJobs } from "@/app/actions/savedJop.action"
import ActivityComponent from "@/components/activity/ActivityComponent"


async function page() {

  const [myEnrollments, applicationSatus, allSavedJobs] = await Promise.allSettled([
    getAllenrollments(),
    getMyApps(),
    getAllSavedJobs(),
  ])

  const enrollments = myEnrollments.status === "fulfilled" ? myEnrollments.value : []
  const applications = applicationSatus.status === "fulfilled" ? applicationSatus.value : []
  // const savedJobs = allSavedJobs.status === "fulfilled" ? allSavedJobs.value : []

  return <>

  <ActivityComponent myEnrollments={enrollments} applicationSatus={applications} />

  </>
}

export default page