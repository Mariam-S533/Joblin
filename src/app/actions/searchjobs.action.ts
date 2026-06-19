"use server"

import { userToken } from "@/lib/userToken"

const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL



export async function getJobPosts(page: number=1 , pageSize: number =  10){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/job-posts?Page=${page}&PageSize=${pageSize}`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

        if (!res.ok) {
            // throw new Error(`Failed to get posts: ${res.statusText}`)
                   const detail = await res.text();
  console.error("job possssst failed", res.status, detail);
  throw new Error(`get joppppp failed (${res.status}): ${detail}`);
        }
        

    const payload = await res.json()
    return payload
}




export async function getPostDetails(id: string){
    const token  = await userToken()

    const res = await fetch(`${baseUrl}/api/job-posts/${id}`,{
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
