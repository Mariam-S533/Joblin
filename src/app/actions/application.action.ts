"use server"

import { userToken } from "@/lib/userToken"

const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL 

// Safe JSON parse — backend may return an empty body
async function safeJson(res: Response, fallback?: unknown) {
    const text = await res.text()
    if (!text) return fallback
    return JSON.parse(text)
}

export async function postApplyJob(seekerProfileId: string, jobPostId: string){
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
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to apply this job: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res)
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
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to get your apps: ${res.status} ${res.statusText} - ${detail}`)
        }

    const payload = await safeJson(res, [])
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
            const detail = await res.text().catch(() => "")
            throw new Error(`Failed to withdraw application: ${res.status} ${res.statusText} - ${detail}`)
        }

    return res.status
}
