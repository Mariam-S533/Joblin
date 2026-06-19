import { userToken } from "@/lib/userToken"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL



export async function getAllCourses(){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/offering-posts`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
       })

        if (!res.ok) {
            throw new Error(`Failed to get post: ${res.statusText}`)
        }
        
    const payload = await res.json()
    return payload
}


export async function getCourseDetails(id: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/offering-posts/${id}`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
       })

        if (!res.ok) {
            throw new Error(`Failed to get post: ${res.statusText}`)
        }
        
    const payload = await res.json()
    return payload
}




export async function getCoursesFromComp(companyId: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/offering-posts/company/${companyId}`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
       })

        if (!res.ok) {
            throw new Error(`Failed to get post: ${res.statusText}`)
        }
        
    const payload = await res.json()
    return payload
}


export async function enrollIntAcourse(offeringId: string) {
    
    const token = await userToken()

    const res = await fetch(`${baseUrl}/api/offering-enrollments/enroll/${offeringId}`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            throw new Error(`Failed to inrole in a course: ${res.statusText}`)
        }

        //be sure
    const payload = await res.json()
    return payload

}


export async function getAllenrollments(){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/offering-enrollments/my-enrollments`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            throw new Error(`Failed to get post: ${res.statusText}`)
        }
        
    const payload = await res.json()
    return payload
}


