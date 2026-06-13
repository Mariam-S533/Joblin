"use server"

import { userToken } from "@/lib/userToken"

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL



export async function getAllCompanies(){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Company`,{
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


export async function getCompantDetails(id: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/Company/${id}`,{
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

export async function getPostsOfCmpany(companyId: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/job-posts/company/${companyId}`,{
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


