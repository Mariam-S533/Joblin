"use server"

import { userToken } from "@/lib/userToken"

const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL



export async function postApplyJob(seekerProfileId: string ,jobPostId: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/applications/${jobPostId}`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify({seekerProfileId})
    })   

     if (!res.ok) {
            throw new Error(`Failed to apply this job: ${res.statusText}`)
        }

    const payload = await res.json()
    return payload
}


export async function getMyApps(){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/applications/my-applications`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            throw new Error(`Failed to get your apps: ${res.statusText}`)
        }

    const payload = await res.json()
    return payload
}


export async function deleteApp(appId: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/applications/${appId}/withdraw`,{
        method:'PATCH',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            throw new Error(`Failed to get your apps: ${res.statusText}`)
        }

    return res.status
}



