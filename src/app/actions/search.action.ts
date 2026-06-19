"use server"

import { userToken } from "@/lib/userToken"

export async function getSearchResult(userInput: string, limit: number = 10) {
    
    const token = await userToken()
    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL
    const params = new URLSearchParams()

    if (userInput) {
        params.append("query", userInput)
    }

    params.append("k", limit.toString())
    params.append("rerank", "true")

    const res = await fetch(`${baseUrl}/api/Search?${params.toString()}`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            throw new Error(`Failed to get results: ${res.statusText}`)
        }

    const payload = await res.json()
    return payload
}