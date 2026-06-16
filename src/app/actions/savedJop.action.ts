import { userToken } from "@/lib/userToken"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL


export async function getAllSavedJobs(){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/saved-jobs`,{
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



export async function saveAjopPost(jobPostId: string, seekerProfileId: string) {
    
    const token = await userToken()

    const res = await fetch(`${baseUrl}/api/saved-jobs/${jobPostId}`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify({seekerProfileId})
    })

     if (!res.ok) {
            throw new Error(`Failed to inrole in a course: ${res.statusText}`)
        }

        //be sure
    const payload = await res.json()
    return payload

}


export async function unSaveAjopPost(jobPostId: string) {
    
    const token = await userToken()

    const res = await fetch(`${baseUrl}/api/saved-jobs/${jobPostId}`,{
        method:'DELETE',
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




