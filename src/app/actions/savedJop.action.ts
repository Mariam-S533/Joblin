"use server"
import { userToken } from "@/lib/userToken"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 


// TODO: Uncomment when backend /api/saved-jobs endpoint is fixed
// export async function getAllSavedJobs(){
//     const token  = await userToken()

//     const res = await fetch(`${baseUrl}/api/saved-jobs`,{
//         method:'GET',
//         headers:{
//             "Authorization": `Bearer ${token}`,
//             "X-Tunnel-Skip-AntiPhishing-Page": "true"
//         }
//        })

//         if (!res.ok) {
//             let backendError = ''
//             try {
//                 const errorBody = await res.text()
//                 backendError = ` - Backend: ${errorBody}`
//             } catch {}
//             throw new Error(`Failed to get saved jobs: ${res.status} ${res.statusText}${backendError}`)
//         }

//     const payload = await res.json()
//     return payload
// }

// Temporary stub until backend is fixed
export async function getAllSavedJobs(){
    return []
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
            throw new Error(`Failed to save job post: ${res.status} ${res.statusText}`)
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
            throw new Error(`Failed to unsave job post: ${res.status} ${res.statusText}`)
        }

        //be sure
    const payload = await res.json()
    return payload

}




