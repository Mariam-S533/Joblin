import React from 'react'
import { getCourseDetails, getCoursesFromComp } from '@/app/actions/courses.action';
import CourseDetails from '@/components/jobSeeker/courses/CourseDetails';

async function page({params} : {params : {id : string}}) {

    const solvedId  = await  params
    const id = solvedId.id
    const courseDetails = await getCourseDetails(id)

    const companyId = courseDetails?.companyId 
    const similarCourses = await getCoursesFromComp(companyId)


  return <>
  
  <CourseDetails courseDetails={courseDetails} similarCourses={similarCourses}/>
  
  </>
}

export default page