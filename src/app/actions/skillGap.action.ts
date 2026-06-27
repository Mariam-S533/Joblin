"use server"

import { userToken } from "@/lib/userToken"


export async function getMissedSkills( jobPostId: string  ,seekerProfileId?: string ) {
    
    const token = await userToken()
    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL 
    const params = new URLSearchParams()
    if(seekerProfileId){
        params.append("seekerProfileId", seekerProfileId)
    }
    params.append("jobPostId", jobPostId)

    const res = await fetch(`${baseUrl}/api/Ai/skill-gap?${params.toString()}`,{
        method:'POST',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
    })

     if (!res.ok) {
            throw new Error(`Failed to save profile: ${res.statusText}`)
        }

    const payload = await res.json()
    return payload

}






export async function getAiRecommendedCourses(skills: string[], topN?: number) {
    const token = await userToken()
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    
    const params = new URLSearchParams()
    if (topN !== undefined) {
        params.append("topN", topN.toString())
    }

    // const url = `${baseUrl}/api/Ai/recommend-course${params.toString() ? `?${params.toString()}` : ''}`
    const queryString = params.toString() ? `?${params.toString()}` : ''
    const url = `${baseUrl}/api/Ai/recommend-courses${queryString}`

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify({ skills })
    })

    if (!res.ok) {
         const detail = await res.text();
  console.error("parse-cv failed", res.status, detail);
  throw new Error(`Upload failed (${res.status}): ${detail}`);
    }


    const payload = await res.json()
        console.log("recommmmmmmmmmmmm",payload)

    return payload
}


