import { getAllCourses } from '@/app/actions/courses.action'
import AllCoursesComp from '@/components/jobSeeker/courses/AllCoursesComp'

async function page() {

    const courses = await getAllCourses(1,10)

  return <>
  
    <AllCoursesComp initialCourses= {courses} />
  
  </>
}

export default page