"use server"

import { userToken } from "@/lib/userToken"
// import { ParsedCV } from "../Types/profile"
import { ProfileFormData } from "../Types/profileShared"



// export async function parseCV(file: File) {
    
//     const token = await userToken()
//     const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL

//     const formData = new FormData()
//     formData.append("file", file)

//     const res = await fetch(`${baseUrl}/api/SeekerProfile/parse-cv`,{
//         method:'POST',
//         headers:{
//             "X-Tunnel-Skip-AntiPhishing-Page": "true",
//             "Authorization": `Bearer ${token}`
//         },
//         body: formData,
//     })

//     if (!res.ok) {
//         throw new Error(`Upload failed: ${res.statusText}`);
//     }

//     const payload = await res.json()
//     return payload

// }

export async function parseCV(formData: FormData) {
    const token = await userToken()
    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL

    const res = await fetch(`${baseUrl}/api/SeekerProfile/parse-cv`,{
        method: 'POST',
        headers: {
            "X-Tunnel-Skip-AntiPhishing-Page": "true",
            "Authorization": `Bearer ${token}`
        },
        body: formData, 
    })

    if (!res.ok) {
         const detail = await res.text();
  console.error("parse-cv failed", res.status, detail);
  throw new Error(`Upload failed (${res.status}): ${detail}`);
    }

    const payload = await res.json()
    return payload
}



export async function saveParsedData(parsedData:ProfileFormData, seekerProfileName: string  ,seekerProfileId?: string ) {
    
    const token = await userToken()
    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL
    const params = new URLSearchParams()
    if(seekerProfileId){
        params.append("seekerProfileId", seekerProfileId)
    }
    params.append("seekerProfileName", seekerProfileName)

    const res = await fetch(`${baseUrl}/api/SeekerProfile/save-cv?${params.toString()}`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        },
        body: JSON.stringify(parsedData)
    })

     if (!res.ok) {
            throw new Error(`Failed to save profile: ${res.statusText}`)
        }

    const payload = await res.json()
    return payload

}


//get all profiles
export async function getProfiles() {
    
    const token = await userToken()
    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL

    const res = await fetch(`${baseUrl}/api/Profile/my-profiles`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            throw new Error(`Failed to get profiles: ${res.statusText}`)
        }

    const payload = await res.json()
    return payload
}


//get specific profile
export async function getSpecificProfile(profileId: string) {
    
    const token = await userToken()
    const baseUrl  = process.env.NEXT_PUBLIC_BASE_URL

    const res = await fetch(`${baseUrl}/api/Profile/my-profiles/${profileId}`,{
        method:'GET',
        headers:{
            "Authorization": `Bearer ${token}`,
            "X-Tunnel-Skip-AntiPhishing-Page": "true"
        }
    })

     if (!res.ok) {
            throw new Error(`Failed to get this profile: ${res.statusText}`)
        }

    const payload = await res.json()
    return payload
}







// const formData = new FormData()
// formData.append("file", selectedFile)

// await parseCV(formData)