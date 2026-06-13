import { getCompantDetails, getPostsOfCmpany } from '@/app/actions/company.action'
import CompanyDetails from '@/components/jobSeeker/company/CompanyDetails'
import React from 'react'


//specific company profile
async function page({params} : {params : {id : string}}) {

      const solvedId  = await  params
      const id = solvedId.id
      const compDetails = await getCompantDetails(id)
      const jobsData = await getPostsOfCmpany(id);

  return <>
  
  <CompanyDetails compDetails={compDetails}  jobsData={jobsData}/>
  
  </>
}

export default page