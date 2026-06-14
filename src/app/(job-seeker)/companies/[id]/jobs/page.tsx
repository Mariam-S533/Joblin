import { getPostsOfCmpany } from '@/app/actions/company.action'
import CompanyPostsComp from '@/components/jobSeeker/company/CompanyPosts'

// all jop posts of specific company
async function page({params} : {params : {id : string}}) {

  const solvedId  = await  params
  const id = solvedId.id
  const companyPosts = await getPostsOfCmpany(id)

  return <>
  
        <CompanyPostsComp companyPosts={companyPosts}/>
  
  </>
}

export default page